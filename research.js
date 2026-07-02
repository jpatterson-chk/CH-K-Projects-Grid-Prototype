// research.js — drives the Research page "web of images".
//
// Reads window.RESEARCH_NODES / RESEARCH_CONFIG (research-data.js), derives each
// node's nearest neighbours from shared tags, and lays out a focused subgraph
// (the focus node + its top-N neighbours) as a d3 force-directed web. Clicking a
// neighbour re-centres on it: it glides to the middle, the old focus demotes to a
// neighbour slot, new neighbours + connecting lines draw in, and the floating
// annotation swaps. Honours prefers-reduced-motion by placing nodes at fixed
// radial slots with no animation. Vanilla DOM throughout; d3-force only does the
// physics — we paint the SVG lines and node transforms ourselves each tick.

(function () {
  var stage = document.getElementById("researchWeb");
  var svg = document.getElementById("researchLinks");
  var noteBox = document.getElementById("researchNote");
  var data = window.RESEARCH_NODES || [];
  if (!stage || !svg || !data.length || typeof d3 === "undefined") return;

  var CONFIG = window.RESEARCH_CONFIG || {};
  var NEIGHBORS = CONFIG.neighbors || 4;
  var WEIGHTS = CONFIG.tagWeights || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var SVGNS = "http://www.w3.org/2000/svg";

  // --- Model -----------------------------------------------------------------
  // Same filename -> Title-Case derivation as the projects grid, for nodes that
  // omit an explicit title.
  function titleFromFilename(name) {
    return name
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  var nodes = data.map(function (d) {
    return {
      id: d.file,
      file: d.file,
      title: d.title || titleFromFilename(d.file),
      tags: d.tags || [],
      note: d.note || "",
      video: d.video || null,
    };
  });
  var byId = {};
  nodes.forEach(function (n) { byId[n.id] = n; });

  // Weighted shared-tag similarity, precomputed once. Neighbours = the top-N
  // scoring nodes (score > 0), deterministic tie-break by title so the web is
  // stable across reloads.
  function score(a, b) {
    var bt = b.tags, s = 0;
    for (var i = 0; i < a.tags.length; i++) {
      if (bt.indexOf(a.tags[i]) !== -1) s += (WEIGHTS[a.tags[i]] || 1);
    }
    return s;
  }
  var neighborIds = {};
  nodes.forEach(function (a) {
    var ranked = nodes
      .filter(function (b) { return b.id !== a.id; })
      .map(function (b) { return { id: b.id, s: score(a, b), t: b.title }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (x, y) { return y.s - x.s || (x.t < y.t ? -1 : 1); });
    neighborIds[a.id] = ranked.slice(0, NEIGHBORS).map(function (r) { return r.id; });
  });

  // --- View bookkeeping ------------------------------------------------------
  var elById = {};       // id -> <figure>
  var simById = {};      // id -> d3 node (persists x/y across re-centres)
  var lineById = {};     // neighbour id -> <line>
  var leaveTimers = {};  // id -> timeout removing a departing node
  var focusId = null;

  function center() {
    return { x: stage.clientWidth / 2, y: stage.clientHeight * 0.47 };
  }

  // Read the current (breakpoint-dependent) neighbour size range from CSS.
  function nodeSizeRange() {
    var cs = getComputedStyle(stage);
    return {
      min: parseFloat(cs.getPropertyValue("--rnode-min")) || 88,
      max: parseFloat(cs.getPropertyValue("--rnode-max")) || 150,
    };
  }

  // Elliptical ring radii: horizontal bound by width, vertical by height (both
  // leaving room for a node's half-extent). So a tall, narrow phone spreads the
  // neighbours vertically while a wide desktop spreads them horizontally — the
  // ring always fits without clipping.
  function slotRadii() {
    var r = nodeSizeRange();
    return {
      rx: Math.max(90, Math.min(440, stage.clientWidth / 2 - r.max * 0.6 - 16)),
      ry: Math.max(90, Math.min(430, stage.clientHeight / 2 - r.max * 0.85 - 16)),
    };
  }

  function makeNode(n) {
    var fig = document.createElement("figure");
    fig.className = "research-node is-entering";
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", n.title);

    var img = document.createElement("img");
    img.className = "research-node__img";
    img.src = "images/" + n.file;
    img.alt = n.title;
    // Images load after layout; re-centre once the real height is known.
    img.addEventListener("load", paint);

    var cap = document.createElement("figcaption");
    cap.className = "research-node__title";
    cap.textContent = n.title;

    fig.appendChild(img);
    fig.appendChild(cap);

    function activate() { if (n.id !== focusId) focusOn(n.id); }
    fig.addEventListener("click", activate);
    fig.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });

    stage.insertBefore(fig, svg.nextSibling);  // above lines, below annotation
    // Fade in on the next frame (no-op under reduced motion — CSS pins opacity).
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { fig.classList.remove("is-entering"); });
    });
    return fig;
  }

  function makeLine() {
    var ln = document.createElementNS(SVGNS, "line");
    svg.appendChild(ln);
    return ln;
  }

  // --- Simulation ------------------------------------------------------------
  // Each neighbour is given a target radial slot (d.tx/d.ty); forceX/forceY pull
  // it there so re-centring animates as a smooth glide, while a size-aware
  // collision keeps the (portrait) images from overlapping. Lines are drawn by
  // hand in paint(), so no link force is needed. A little charge adds organic
  // drift without letting nodes pile up.
  var links = [];
  var sim = d3.forceSimulation()
    .force("x", d3.forceX(function (d) { return d.tx; }).strength(0.32))
    .force("y", d3.forceY(function (d) { return d.ty; }).strength(0.32))
    .force("charge", d3.forceManyBody().strength(-10))
    .force("collide", d3.forceCollide().radius(function (d) {
      if (!d.el) return 80;
      return Math.max(d.el.offsetWidth, d.el.offsetHeight) / 2 + 12;
    }).strength(0.9))
    .on("tick", paint)
    .on("end", snapToTargets)
    .stop();

  // When the sim cools, settle every neighbour exactly on its target slot, so
  // the resting layout is always the clean deterministic ring regardless of how
  // far the damped glide got.
  function snapToTargets() {
    sim.nodes().forEach(function (d) {
      if (d.id !== focusId) { d.x = d.tx; d.y = d.ty; }
    });
    paint();
  }

  // Write current node positions to the DOM. Shared by the tick loop and the
  // reduced-motion static path.
  function paint() {
    var c = center();
    sim.nodes().forEach(function (d) {
      var hw = d.el.offsetWidth / 2, hh = d.el.offsetHeight / 2;
      if (d.id !== focusId) {
        d.x = Math.max(hw, Math.min(stage.clientWidth - hw, d.x));
        d.y = Math.max(hh, Math.min(stage.clientHeight - hh, d.y));
      }
      d.el.style.transform = "translate(" + (d.x - hw) + "px," + (d.y - hh) + "px)";
    });
    links.forEach(function (lk) {
      var s = lk.source, t = lk.target;
      lk.line.setAttribute("x1", s.x); lk.line.setAttribute("y1", s.y);
      lk.line.setAttribute("x2", t.x); lk.line.setAttribute("y2", t.y);
    });
    // Keep the focus centred even if a resize moved the middle.
    var f = simById[focusId];
    if (f) { f.fx = c.x; f.fy = c.y; }
  }

  // --- Focus / re-centre -----------------------------------------------------
  function focusOn(id, initial) {
    var c = center();
    focusId = id;

    var visibleIds = [id].concat(neighborIds[id] || []);
    var visibleSet = {};
    visibleIds.forEach(function (v) { visibleSet[v] = true; });

    // Retire nodes/lines that leave the view.
    Object.keys(elById).forEach(function (nid) {
      if (visibleSet[nid]) return;
      var el = elById[nid];
      el.classList.add("is-leaving");
      clearTimeout(leaveTimers[nid]);
      leaveTimers[nid] = setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
        delete elById[nid];
      }, reduce.matches ? 0 : 420);
      if (lineById[nid]) { svg.removeChild(lineById[nid]); delete lineById[nid]; }
    });

    // Build the visible sim nodes, reusing prior positions for continuity.
    var simNodes = visibleIds.map(function (nid) {
      var s = simById[nid];
      if (!s) {
        s = simById[nid] = { id: nid, x: c.x, y: c.y };
      }
      // Revive a node that was mid-leave.
      clearTimeout(leaveTimers[nid]);
      var el = elById[nid];
      if (!el) {
        el = elById[nid] = makeNode(byId[nid]);
        s.x = c.x + (Math.random() - 0.5) * 60;   // start near centre, then spread
        s.y = c.y + (Math.random() - 0.5) * 60;
      }
      el.classList.remove("is-leaving");
      s.el = el;
      return s;
    });

    // Roles + target slots. The focus pins to the centre + scales up; each
    // neighbour gets an evenly-spaced slot on a ring, which forceX/forceY then
    // pull it toward. Assign targets BEFORE sim.nodes() so the forces initialise
    // with them.
    var neigh = visibleIds.filter(function (nid) { return nid !== focusId; });
    var rad = slotRadii();

    // Size each neighbour by connection strength: the most-connected reads
    // largest, the least smallest, so the hierarchy is legible. Normalise the
    // shared-tag scores across the current neighbours onto the CSS size range.
    var range = nodeSizeRange();
    var scores = neigh.map(function (nid) {
      return score(byId[focusId], byId[nid]);
    });
    var sMin = Math.min.apply(null, scores);
    var sMax = Math.max.apply(null, scores);

    simNodes.forEach(function (s) {
      if (s.id === focusId) {
        s.el.classList.add("is-focus");
        s.el.style.width = "";   // let the CSS focus size apply
        s.fx = c.x; s.fy = c.y; s.tx = c.x; s.ty = c.y;
      } else {
        s.el.classList.remove("is-focus");
        s.fx = null; s.fy = null;
        var i = neigh.indexOf(s.id);
        var norm = sMax > sMin ? (scores[i] - sMin) / (sMax - sMin) : 1;
        s.el.style.width = (range.min + norm * (range.max - range.min)) + "px";
        var a = -Math.PI / 2 + (i / neigh.length) * Math.PI * 2;
        var ux = Math.cos(a), uy = Math.sin(a);
        s.tx = c.x + ux * rad.rx;
        s.ty = c.y + uy * rad.ry;
        // Start just outside the centre ON the target ray, so each neighbour
        // eases straight out to its slot instead of trying to cross the pinned
        // focus (whose collision would otherwise trap it on the near side).
        s.x = c.x + ux * rad.rx * 0.3 + (Math.random() - 0.5) * 20;
        s.y = c.y + uy * rad.ry * 0.3 + (Math.random() - 0.5) * 20;
      }
    });

    // Lines: focus -> each neighbour (node-object refs, reused by paint()).
    var focusNode = simById[focusId];
    links = neigh.map(function (nid) {
      var ln = lineById[nid] || (lineById[nid] = makeLine());
      return { source: focusNode, target: simById[nid], line: ln };
    });

    sim.nodes(simNodes);

    if (reduce.matches) {
      // Jump straight to the target slots, no animation.
      simNodes.forEach(function (s) { s.x = s.tx; s.y = s.ty; });
      sim.stop();
      paint();
    } else {
      sim.alpha(initial ? 1 : 0.9).restart();
    }

    updateNote(byId[focusId]);
  }

  // --- Annotation block ------------------------------------------------------
  function renderNote(n) {
    noteBox.innerHTML = "";
    var h = document.createElement("h2");
    h.className = "research-annotation__title";
    h.textContent = n.title;
    noteBox.appendChild(h);
    if (n.note) {
      var p = document.createElement("p");
      p.className = "research-annotation__note";
      p.textContent = n.note;
      noteBox.appendChild(p);
    }
    noteBox.hidden = false;
  }
  function updateNote(n) {
    if (reduce.matches || noteBox.hidden) { renderNote(n); return; }
    noteBox.classList.add("is-swapping");
    var swap = function () {
      renderNote(n);
      requestAnimationFrame(function () { noteBox.classList.remove("is-swapping"); });
      noteBox.removeEventListener("transitionend", swap);
    };
    noteBox.addEventListener("transitionend", swap);
    // Fallback in case the transition doesn't fire.
    setTimeout(swap, 360);
  }

  // --- Resize ----------------------------------------------------------------
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Recompute the centre + ring, re-point every node's target slot, then
      // let the sim ease over (or, under reduced motion, jump).
      if (focusId) focusOn(focusId, false);
    }, 150);
  });

  // --- Start -----------------------------------------------------------------
  focusOn(nodes[0].id, true);
})();
