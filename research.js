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

  // Assign every visible node its target: the focus to the centre, each
  // neighbour to a slot on an elliptical ring. The ring radii are derived from
  // the focus's ACTUAL measured size so neighbours always clear it with a gap
  // (no more top/bottom nodes landing on the focus), capped by the stage so they
  // never clip. Angles are organic — a per-focus rotation plus bounded jitter —
  // rather than rigid 90° cardinals. Returns each neighbour's unit direction so
  // callers can seed entering nodes on the same ray. Does not touch x/y.
  function assignTargets(c) {
    var neigh = (neighborIds[focusId] || []).filter(function (nid) { return simById[nid]; });
    var range = nodeSizeRange();
    // Focus half-extents. Once the focus image has decoded, use its real box;
    // before then (first load) fall back to the CSS max-bounds (--rfocus-w wide,
    // 42vh tall) so the ring is sized generously enough to clear ANY image
    // without waiting on a load event.
    var fEl = simById[focusId].el;
    var fImg = fEl.querySelector(".research-node__img");
    var loaded = fImg && fImg.complete && fImg.naturalWidth;
    var rfw = parseFloat(getComputedStyle(stage).getPropertyValue("--rfocus-w")) || 200;
    var maxFH = 0.42 * (window.innerHeight || stage.clientHeight);
    var fHW = loaded ? fEl.offsetWidth / 2 : rfw / 2;
    var fHH = loaded ? fEl.offsetHeight / 2 : maxFH / 2;
    var nHW = range.max / 2, nHH = range.max * 0.62, gap = 60;
    var rx = Math.max(120, Math.min(fHW + nHW + gap, stage.clientWidth / 2 - nHW - 12));
    var ry = Math.max(120, Math.min(fHH + nHH + gap, stage.clientHeight / 2 - nHH - 12));

    simById[focusId].tx = c.x;
    simById[focusId].ty = c.y;

    var rng = makeRng(hashStr(focusId));
    var rot = rng() * Math.PI * 2;
    var seg = (Math.PI * 2) / Math.max(1, neigh.length);
    var dirs = {};
    neigh.forEach(function (nid, i) {
      var a = rot + i * seg + (rng() - 0.5) * seg * 0.7;
      var ux = Math.cos(a), uy = Math.sin(a);
      simById[nid].tx = c.x + ux * rx;
      simById[nid].ty = c.y + uy * ry;
      dirs[nid] = { ux: ux, uy: uy };
    });
    return { rx: rx, ry: ry, dirs: dirs };
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
    // Images load after layout. When the FOCUS image arrives its real height is
    // finally known, so re-lay the ring off it (fixes the first-load case where
    // the focus measured tiny before its image decoded); otherwise just repaint.
    img.addEventListener("load", function () {
      if (n.id === focusId && !reduce.matches) {
        assignTargets(center());
        sim.alpha(Math.max(sim.alpha(), 0.4)).restart();
      } else {
        paint();
      }
    });

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

  // Deterministic pseudo-random from a string, so each focus gets its own stable
  // ring rotation + per-node jitter (organic angles that don't shuffle on reload).
  function hashStr(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0;
    }
    return h;
  }
  function makeRng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  // --- Simulation ------------------------------------------------------------
  // Every node is pulled toward a target (the focus toward the centre, each
  // neighbour toward its ring slot) by forceX/forceY. The focus is pulled harder
  // so it glides in and holds the middle WITHOUT a hard fx/fy pin — that lets a
  // clicked neighbour animate into the centre instead of teleporting. A firm
  // velocityDecay damps the motion so nodes ease to rest with no overshoot (so no
  // snap-back). Collision only nudges neighbours apart; the ring radii are sized
  // to clear the focus geometrically. Lines are drawn by hand in paint().
  var links = [];
  var sim = d3.forceSimulation()
    .velocityDecay(0.55)
    .force("x", d3.forceX(function (d) { return d.tx; })
      .strength(function (d) { return d.id === focusId ? 0.45 : 0.22; }))
    .force("y", d3.forceY(function (d) { return d.ty; })
      .strength(function (d) { return d.id === focusId ? 0.45 : 0.22; }))
    .force("charge", d3.forceManyBody().strength(-12))
    .force("collide", d3.forceCollide().radius(function (d) {
      if (!d.el) return 70;
      // Average of half-width and half-height: firm enough to separate
      // neighbours without a tall portrait's huge circle shoving them off-ring.
      return (d.el.offsetWidth + d.el.offsetHeight) / 4 + 8;
    }).strength(0.7))
    .on("tick", paint)
    .stop();

  // Write current node positions to the DOM. Shared by the tick loop and the
  // reduced-motion static path.
  function paint() {
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
    // Track which are newly entering this transition (they get seeded on their
    // ray below; persisting nodes keep their position and simply glide over).
    var neigh = visibleIds.filter(function (nid) { return nid !== focusId; });
    var entering = {};
    var simNodes = visibleIds.map(function (nid) {
      var s = simById[nid];
      if (!s) { s = simById[nid] = { id: nid, x: c.x, y: c.y }; }
      clearTimeout(leaveTimers[nid]);
      var el = elById[nid];
      if (!el) { el = elById[nid] = makeNode(byId[nid]); entering[nid] = true; }
      el.classList.remove("is-leaving");
      s.el = el;
      s.fx = null; s.fy = null;   // no hard pin — targets do the positioning
      return s;
    });

    // Roles + per-neighbour size (by connection strength) FIRST, so the focus
    // reports its real bounded size before we measure it to lay out the ring.
    var range = nodeSizeRange();
    var scores = neigh.map(function (nid) { return score(byId[focusId], byId[nid]); });
    var sMin = Math.min.apply(null, scores);
    var sMax = Math.max.apply(null, scores);
    simNodes.forEach(function (s) {
      if (s.id === focusId) {
        s.el.classList.add("is-focus");
        s.el.style.width = "";   // let the CSS focus size apply
      } else {
        s.el.classList.remove("is-focus");
        var i = neigh.indexOf(s.id);
        var norm = sMax > sMin ? (scores[i] - sMin) / (sMax - sMin) : 1;
        s.el.style.width = (range.min + norm * (range.max - range.min)) + "px";
      }
    });

    // Targets (focus -> centre, neighbours -> organic ring sized off the focus).
    var layout = assignTargets(c);
    // Seed only the entering neighbours, just outside the centre on their ray,
    // so they fan outward. Persisting neighbours (and the clicked node, which is
    // now the focus) keep their current position and glide to the new target.
    neigh.forEach(function (nid) {
      if (!entering[nid]) return;
      var d = layout.dirs[nid], s = simById[nid];
      s.x = c.x + d.ux * layout.rx * 0.35 + (Math.random() - 0.5) * 16;
      s.y = c.y + d.uy * layout.ry * 0.35 + (Math.random() - 0.5) * 16;
    });

    // Lines: focus -> each neighbour (node-object refs, reused by paint()).
    var focusNode = simById[focusId];
    links = neigh.map(function (nid) {
      var ln = lineById[nid] || (lineById[nid] = makeLine());
      return { source: focusNode, target: simById[nid], line: ln };
    });

    sim.nodes(simNodes);

    if (reduce.matches) {
      // Jump straight to the targets, no animation.
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
