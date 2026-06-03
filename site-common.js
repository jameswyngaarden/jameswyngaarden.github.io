/* ═══════════════════════════════════════════════════════════════
   site-common.js — Shared components for jameswyngaarden.com
   Injects: sidebar, header+nav, canvas, link preview, animations
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ── Detect current page for nav active state ──
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    var NAV_ITEMS = [
        { href: 'index.html', label: 'About' },
        { href: 'current-work.html', label: 'Current Work' },
        { href: 'publications.html', label: 'Publications' },
        { href: 'art.html', label: 'Artistry' },
    ];

    // ── Build sidebar HTML ──
    var sidebarHTML = ''
        + '<div class="sidebar-profile">'
        + '    <div class="sidebar-links">'
        + '        <a href="mailto:james.wyngaarden@temple.edu" class="sidebar-link">'
        + '            <img src="stimuli/logos/Email.png" alt="">Email'
        + '        </a>'
        + '        <a href="https://www.linkedin.com/in/james-wyngaarden-iii" target="_blank" class="sidebar-link">'
        + '            <img src="stimuli/logos/Linkedin.png" alt="">LinkedIn'
        + '        </a>'
        + '        <a href="https://bsky.app/profile/jameswyngaarden.bsky.social" target="_blank" class="sidebar-link">'
        + '            <img src="stimuli/logos/Bluesky.png" alt="">Bluesky'
        + '        </a>'
        + '        <a href="https://github.com/jameswyngaarden" target="_blank" class="sidebar-link">'
        + '            <img src="stimuli/logos/Github.png" alt="">GitHub'
        + '        </a>'
        + '        <a href="https://scholar.google.com/citations?user=84faR-sAAAAJ&hl=en" target="_blank" class="sidebar-link">'
        + '            <img src="stimuli/logos/Google-Scholar.png" alt="">Google Scholar'
        + '        </a>'
        + '        <a href="https://orcid.org/0000-0002-0858-8721" target="_blank" class="sidebar-link">'
        + '            <img src="stimuli/logos/Orcid.png" alt="">ORCID'
        + '        </a>'
        + '    </div>'
        + '</div>';

    // ── Build nav HTML with active state ──
    var navHTML = '<nav class="nav">';
    for (var i = 0; i < NAV_ITEMS.length; i++) {
        var item = NAV_ITEMS[i];
        var isActive = (page === item.href) || (page === '' && item.href === 'index.html');
        navHTML += '<a href="' + item.href + '" class="nav-link' + (isActive ? ' active' : '') + '">' + item.label + '</a>';
    }
    navHTML += '</nav>';

    // ── Build header HTML (SVG name animation + subtitle + nav) ──
    var headerHTML = ''
        + '<div class="header-center">'
        + '    <div class="name-animated" id="nameAnimated">'
        + '        <svg class="glyph-svg" viewBox="35 0 529 730" id="svgJ">'
        + '            <g transform="translate(0, 730) scale(1, -1)">'
        + '                <path d="M300 -19Q221 -19 161.0 12.0Q101 43 68.0 103.0Q35 163 35 250V282H176V238Q176 180 210.0 146.5Q244 113 299 113Q355 113 388.5 146.5Q422 180 422 238V625H564V250Q564 163 531.0 103.0Q498 43 439.0 12.0Q380 -19 300 -19ZM124 605V730H564V605Z"/>'
        + '            </g>'
        + '        </svg>'
        + '        <span class="clip-word cw1"><span class="cl">a</span><span class="cl">m</span><span class="cl from-bottom">e</span><span class="cl">s</span></span>'
        + '        <span class="clip-space cs1"></span>'
        + '        <svg class="glyph-svg" viewBox="90 0 545 740" id="svgB">'
        + '            <g transform="translate(0, 735) scale(1, -1)">'
        + '                <path d="M209 -5V109H392Q442 109 468.0 136.5Q494 164 494 212Q494 260 468.0 286.5Q442 313 392 313H209V400H382Q455 400 512.5 382.5Q570 365 602.5 324.0Q635 283 635 214V200Q635 135 606.5 89.5Q578 44 521.5 19.5Q465 -5 382 -5ZM90 -5V735H229V-5ZM209 336V423H365Q416 423 440.0 450.0Q464 477 464 522Q464 567 440.0 594.0Q416 621 365 621H209V735H352Q476 735 540.5 683.0Q605 631 605 534V520Q605 452 572.5 411.5Q540 371 483.0 353.5Q426 336 352 336Z"/>'
        + '            </g>'
        + '        </svg>'
        + '        <span class="clip-word cw1"><span class="cl from-center">.</span></span>'
        + '        <span class="clip-space cs1"></span>'
        + '        <svg class="glyph-svg" viewBox="24 0 1014 730" id="svgW">'
        + '            <g transform="translate(0, 730) scale(1, -1)">'
        + '                <path d="M210 0L24 730H171L322 95L283 118H383L339 95L458 702H580L432 0ZM646 0L485 702H612L749 95L706 118H804L766 95L899 730H1038L872 0Z"/>'
        + '            </g>'
        + '        </svg>'
        + '        <span class="clip-word cw2"><span class="cl from-top">y</span><span class="cl">n</span><span class="cl from-bottom">g</span><span class="cl">a</span><span class="cl">a</span><span class="cl signature">r</span><span class="cl">d</span><span class="cl from-bottom">e</span><span class="cl">n</span></span>'
        + '        <span class="clip-space cs2"></span>'
        + '        <svg class="glyph-svg i-glyph i1" viewBox="92 0 142 730">'
        + '            <g transform="translate(0, 730) scale(1, -1)"><path d="M92 0V730H234V0Z"/></g>'
        + '        </svg>'
        + '        <svg class="glyph-svg i-glyph i2" viewBox="92 0 142 730">'
        + '            <g transform="translate(0, 730) scale(1, -1)"><path d="M92 0V730H234V0Z"/></g>'
        + '        </svg>'
        + '        <svg class="glyph-svg i-glyph i3" viewBox="92 0 142 730">'
        + '            <g transform="translate(0, 730) scale(1, -1)"><path d="M92 0V730H234V0Z"/></g>'
        + '        </svg>'
        + '    </div>'
        + '    <p class="subtitle">Research Scientist &ensp;&middot;&ensp; Decision Making &ensp;&middot;&ensp; Computational Modeling</p>'
        + '</div>'
        + navHTML;

    // ── Link preview HTML ──
    var linkPreviewHTML = ''
        + '<div class="link-preview" id="linkPreview">'
        + '    <img class="link-preview-image" id="previewImage" src="" alt="">'
        + '    <div class="link-preview-content">'
        + '        <div class="link-preview-title" id="previewTitle"></div>'
        + '        <div class="link-preview-description" id="previewDesc"></div>'
        + '        <div class="link-preview-source" id="previewSource"></div>'
        + '    </div>'
        + '</div>';

    // ── Inject into the DOM ──
    // Expected page structure:
    //   <div class="container">
    //     <aside class="sidebar" id="sidebar"></aside>
    //     <div class="main-content" id="mainContent">
    //       <header id="siteHeader"></header>
    //       ... page-specific content ...
    //     </div>
    //   </div>

    var sidebar = document.getElementById('sidebar');
    var siteHeader = document.getElementById('siteHeader');

    if (sidebar) sidebar.innerHTML = sidebarHTML;
    if (siteHeader) siteHeader.innerHTML = headerHTML;

    // Inject canvas into main-content
    var mainContent = document.getElementById('mainContent');
    if (mainContent) {
        var canvas = document.createElement('canvas');
        canvas.id = 'networkCanvas';
        mainContent.insertBefore(canvas, mainContent.firstChild);
    }

    // Inject link preview at end of body
    var previewDiv = document.createElement('div');
    previewDiv.innerHTML = linkPreviewHTML;
    document.body.appendChild(previewDiv.firstChild);

    // ── Name Animation ──
    var nameAnimated = document.getElementById('nameAnimated');
    if (nameAnimated) {
        setTimeout(function() { nameAnimated.classList.add('animate'); }, 100);
        setTimeout(function() {
            nameAnimated.classList.add('phase2');
            // Rhythmic stagger: sine curve timing for clip-path letters
            var letters = nameAnimated.querySelectorAll('.cl');
            var total = letters.length;
            var baseDelay = 100;
            for (var i = 0; i < total; i++) {
                var t = total > 1 ? i / (total - 1) : 0;
                var eased = (1 - Math.cos(t * Math.PI)) / 2;
                var delay = baseDelay + eased * 680;
                letters[i].style.animationDelay = Math.round(delay) + 'ms';
            }
        }, 2100);
    }

    // ── Link Preview Functionality ──
    (function() {
        var preview = document.getElementById('linkPreview');
        var previewImage = document.getElementById('previewImage');
        var previewTitle = document.getElementById('previewTitle');
        var previewDesc = document.getElementById('previewDesc');
        var previewSource = document.getElementById('previewSource');
        if (!preview) return;

        var hideTimeout;

        document.querySelectorAll('a[data-preview-title]').forEach(function(link) {
            link.addEventListener('mouseenter', function() {
                clearTimeout(hideTimeout);
                previewTitle.textContent = link.dataset.previewTitle;
                previewDesc.textContent = link.dataset.previewDesc;
                previewSource.textContent = link.dataset.previewSource;
                if (link.dataset.previewImg) {
                    previewImage.src = link.dataset.previewImg;
                    previewImage.style.display = 'block';
                } else {
                    previewImage.style.display = 'none';
                }
                preview.classList.add('visible');
            });

            link.addEventListener('mousemove', function(e) {
                var pw = 320;
                var ph = preview.offsetHeight;
                var pad = 15;
                var x = e.clientX + pad;
                var y = e.clientY + pad;
                if (x + pw > window.innerWidth) x = e.clientX - pw - pad;
                if (y + ph > window.innerHeight) y = e.clientY - ph - pad;
                preview.style.left = x + 'px';
                preview.style.top = y + 'px';
            });

            link.addEventListener('mouseleave', function() {
                hideTimeout = setTimeout(function() {
                    preview.classList.remove('visible');
                }, 100);
            });
        });
    })();

    // ── Neural Network Particle Animation with Lissajous Resonance ──
    (function() {
        var canvas = document.getElementById('networkCanvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var container = document.getElementById('mainContent');

        var PALETTE = [
            { r: 106, g: 176, b: 212 },
            { r: 126, g: 200, b: 164 },
            { r: 160, g: 212, b: 207 },
            { r:  74, g: 143, b: 168 },
            { r: 139, g: 191, b: 122 },
            { r: 194, g: 221, b: 230 },
        ];

        var cfg = {
            nodeCount: 100,
            linkDist: 120,
            speed: 0.18,
            nodeAlpha: 0.35,
            edgeAlpha: 0.10,
            driftTime: 8,
            convergeTime: 3,
            holdTime: 2,
            curveScale: 0.30,
        };

        var nodes = [];
        var W, H;
        var paused = false;

        var LISSAJOUS_PRESETS = [
            [1, 2, Math.PI / 4],
            [3, 2, Math.PI / 2],
            [3, 4, Math.PI / 3],
            [5, 4, Math.PI / 6],
            [2, 3, Math.PI / 4],
            [1, 3, Math.PI / 2],
            [3, 5, Math.PI / 3],
            [4, 5, Math.PI / 4],
        ];

        var currentPreset = 0;
        var curveRotation = 0;
        var phase = 'drift';
        var phaseTimer = 0;
        var blendFactor = 0;

        function resize() {
            var dpr = window.devicePixelRatio || 1;
            W = container.offsetWidth;
            H = container.offsetHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createNode() {
            var c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * cfg.speed,
                vy: (Math.random() - 0.5) * cfg.speed,
                r: 1.5 + Math.random() * 2,
                color: c,
                t: Math.random() * Math.PI * 2,
            };
        }

        function initNodes() {
            nodes = [];
            for (var i = 0; i < cfg.nodeCount; i++) {
                var n = createNode();
                n.t = (i / cfg.nodeCount) * Math.PI * 2;
                nodes.push(n);
            }
        }

        function lissajousTarget(t, preset, scrollY) {
            var freqA = preset[0];
            var freqB = preset[1];
            var delta = preset[2];
            var scaleX = W * cfg.curveScale;
            var scaleY = Math.min(W, 600) * cfg.curveScale * 0.7;

            var rawX = Math.sin(freqA * t + delta);
            var rawY = Math.sin(freqB * t);

            var cosR = Math.cos(curveRotation);
            var sinR = Math.sin(curveRotation);
            var rx = rawX * cosR - rawY * sinR;
            var ry = rawX * sinR + rawY * cosR;

            var centerX = W / 2;
            var centerY = scrollY + window.innerHeight / 2;
            centerY = Math.max(window.innerHeight * 0.4, Math.min(H - window.innerHeight * 0.4, centerY));

            return { x: centerX + rx * scaleX, y: centerY + ry * scaleY };
        }

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function startConverging() {
            phase = 'converging';
            phaseTimer = 0;
            currentPreset = (currentPreset + 1) % LISSAJOUS_PRESETS.length;
            curveRotation = Math.random() * Math.PI * 2;
        }

        var dt = 1 / 60;

        function updatePhase() {
            phaseTimer += dt;

            if (phase === 'drift') {
                blendFactor = 0;
                if (phaseTimer >= cfg.driftTime) startConverging();
            } else if (phase === 'converging') {
                blendFactor = easeInOutCubic(Math.min(phaseTimer / cfg.convergeTime, 1));
                if (phaseTimer >= cfg.convergeTime) {
                    phase = 'holding';
                    phaseTimer = 0;
                    blendFactor = 1;
                }
            } else if (phase === 'holding') {
                blendFactor = 1;
                if (phaseTimer >= cfg.holdTime) {
                    phase = 'releasing';
                    phaseTimer = 0;
                }
            } else if (phase === 'releasing') {
                blendFactor = 1 - easeInOutCubic(Math.min(phaseTimer / cfg.convergeTime, 1));
                if (phaseTimer >= cfg.convergeTime) {
                    phase = 'drift';
                    phaseTimer = 0;
                    blendFactor = 0;
                }
            }
        }

        function updateNodes() {
            var pad = 20;
            var scrollY = window.scrollY || window.pageYOffset;
            var windowH = window.innerHeight;
            var preset = LISSAJOUS_PRESETS[currentPreset];

            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];

                n.vx += (Math.random() - 0.5) * 0.012;
                n.vy += (Math.random() - 0.5) * 0.012;
                n.vx *= 0.995;
                n.vy *= 0.995;

                var spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
                var minV = cfg.speed * 0.3;
                if (spd < minV && spd > 0) {
                    n.vx = (n.vx / spd) * minV;
                    n.vy = (n.vy / spd) * minV;
                }

                var freeX = n.x + n.vx;
                var freeY = n.y + n.vy;

                if (freeX < -pad) freeX = W + pad;
                if (freeX > W + pad) freeX = -pad;
                if (freeY < -pad) freeY = H + pad;
                if (freeY > H + pad) freeY = -pad;

                if (blendFactor > 0.001) {
                    var viewTop = scrollY - windowH;
                    var viewBot = scrollY + windowH * 2;
                    var nearViewport = (n.y > viewTop && n.y < viewBot);

                    if (nearViewport) {
                        var target = lissajousTarget(n.t, preset, scrollY);
                        n.x = freeX * (1 - blendFactor) + target.x * blendFactor;
                        n.y = freeY * (1 - blendFactor) + target.y * blendFactor;
                        if (blendFactor > 0.5) {
                            n.t += 0.003 * blendFactor;
                        }
                    } else {
                        n.x = freeX;
                        n.y = freeY;
                    }
                } else {
                    n.x = freeX;
                    n.y = freeY;
                }

                if (blendFactor < 0.99) {
                    n.vx = n.x - (n.x - n.vx);
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            var distSq = cfg.linkDist * cfg.linkDist;

            for (var i = 0; i < nodes.length; i++) {
                for (var j = i + 1; j < nodes.length; j++) {
                    var a = nodes[i], b = nodes[j];
                    var dx = a.x - b.x, dy = a.y - b.y;
                    var d2 = dx * dx + dy * dy;
                    if (d2 < distSq) {
                        var t = 1 - Math.sqrt(d2) / cfg.linkDist;
                        var cr = (a.color.r + b.color.r) >> 1;
                        var cg = (a.color.g + b.color.g) >> 1;
                        var cb = (a.color.b + b.color.b) >> 1;
                        ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (t * cfg.edgeAlpha) + ')';
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            for (var k = 0; k < nodes.length; k++) {
                var n = nodes[k];
                ctx.fillStyle = 'rgba(' + n.color.r + ',' + n.color.g + ',' + n.color.b + ',' + cfg.nodeAlpha + ')';
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function loop() {
            if (!paused) { updatePhase(); updateNodes(); draw(); }
            requestAnimationFrame(loop);
        }

        var observer = new IntersectionObserver(
            function(entries) { paused = !entries[0].isIntersecting; },
            { threshold: 0.01 }
        );
        observer.observe(container);

        resize();
        initNodes();
        loop();
        window.addEventListener('resize', function() { resize(); });
    })();

})();
