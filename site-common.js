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
        { href: 'index.html', label: 'Home' },
        { href: 'about.html', label: 'About' },
        { href: 'current-work.html', label: 'Current Work' },
        { href: 'publications.html', label: 'Publications' },
        { href: 'art.html', label: 'Artistry' },
    ];

    // ── Sidebar emptied; social links now live in the footer ──
    var sidebarHTML = '';

    // ── Build footer HTML (icon-only social links) ──
    var footerHTML = ''
        + '<footer class="site-footer">'
        + '    <div class="footer-links">'
        + '        <a href="mailto:james.wyngaarden@temple.edu" class="footer-link" aria-label="Email" title="Email"><img src="stimuli/logos/Email.png" alt="Email"></a>'
        + '        <a href="https://www.linkedin.com/in/james-wyngaarden-iii" target="_blank" class="footer-link" aria-label="LinkedIn" title="LinkedIn"><img src="stimuli/logos/Linkedin.png" alt="LinkedIn"></a>'
        + '        <a href="https://bsky.app/profile/jameswyngaarden.bsky.social" target="_blank" class="footer-link" aria-label="Bluesky" title="Bluesky"><img src="stimuli/logos/Bluesky.png" alt="Bluesky"></a>'
        + '        <a href="https://github.com/jameswyngaarden" target="_blank" class="footer-link" aria-label="GitHub" title="GitHub"><img src="stimuli/logos/Github.png" alt="GitHub"></a>'
        + '        <a href="https://scholar.google.com/citations?user=84faR-sAAAAJ&hl=en" target="_blank" class="footer-link" aria-label="Google Scholar" title="Google Scholar"><img src="stimuli/logos/Google-Scholar.png" alt="Google Scholar"></a>'
        + '        <a href="https://orcid.org/0000-0002-0858-8721" target="_blank" class="footer-link" aria-label="ORCID" title="ORCID"><img src="stimuli/logos/Orcid.png" alt="ORCID"></a>'
        + '    </div>'
        + '</footer>';

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
        + navHTML
        + '<div class="header-center">'
        + '    <a href="index.html" class="name-home" aria-label="Home" style="text-decoration:none;color:inherit;display:inline-block;">'
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
        + '    </a>'
        + '</div>';

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

    // Background network canvas intentionally not injected (removed site-wide).

    // Inject footer (social icons) at end of main-content
    var mainContentEl = document.getElementById('mainContent');
    if (mainContentEl) {
        var footerWrap = document.createElement('div');
        footerWrap.innerHTML = footerHTML;
        mainContentEl.appendChild(footerWrap.firstChild);
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


})();
