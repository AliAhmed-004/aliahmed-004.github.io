/* ==========================================================================
   SpudByte shared behaviour. Plain JS, no dependencies.
   Every feature is opt-in by markup, so project pages only get what they use.
   ========================================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    /* ---------- Nav: mobile toggle, stuck state, scroll-spy ---------- */
    var nav = $('#nav');
    if (nav) {
        var toggle = $('.nav__toggle', nav);
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.addEventListener('click', function (e) {
                e.stopPropagation();
                var open = nav.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(open));
            });
        }
        $$('.nav__link, .nav__cta', nav).forEach(function (a) {
            a.addEventListener('click', function () { nav.classList.remove('is-open'); });
        });
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target)) nav.classList.remove('is-open');
        });
        var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 24); };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // scroll-spy for in-page links
        var links = $$('.nav__link[href^="#"]', nav);
        var targets = links.map(function (l) { return $(l.getAttribute('href')); });
        if (links.length && 'IntersectionObserver' in window) {
            var spy = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (!en.isIntersecting) return;
                    links.forEach(function (l) {
                        l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
                    });
                });
            }, { rootMargin: '-45% 0px -50% 0px' });
            targets.forEach(function (t) { if (t) spy.observe(t); });
        }
    }

    /* ---------- Reveal on scroll ---------- */
    var revealSel = '.section-header, .feature-card, .step, .card, .stage-card, .tech-grid, .cta-section > .container, ' +
        '.contact-section > .container, .scoring-table, .waves-table, .reveal, .screen-grid figure, .sec-head, .stat, .proj, .chip';
    var items = $$(revealSel);
    if (items.length && 'IntersectionObserver' in window && !reduceMotion) {
        items.forEach(function (el, i) {
            el.classList.add('reveal');
            // gentle stagger among siblings
            var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
            el.style.setProperty('--d', Math.min(idx, 6) * 70 + 'ms');
        });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach(function (el) { io.observe(el); });
    } else {
        document.documentElement.classList.remove('js');
    }

    /* ---------- Hero highlighter kicks in after first paint ---------- */
    requestAnimationFrame(function () { document.body.classList.add('is-ready'); });

    /* ---------- Cursor spotlight on feature cards ---------- */
    $$('.feature-card').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
            var r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* ---------- Count-up numbers: <span data-count="3"> ---------- */
    var counters = $$('[data-count]');
    if (counters.length) {
        var run = function (el) {
            var end = parseInt(el.getAttribute('data-count'), 10);
            if (reduceMotion || isNaN(end)) { el.textContent = end; return; }
            var start = performance.now(), dur = 1100;
            (function tick(now) {
                var p = Math.min((now - start) / dur, 1);
                el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(tick);
            })(start);
        };
        if ('IntersectionObserver' in window) {
            var co = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } });
            }, { threshold: 0.6 });
            counters.forEach(function (c) { c.textContent = '0'; co.observe(c); });
        } else counters.forEach(run);
    }

    /* ---------- Project accordion (home) ---------- */
    var projs = $$('.proj');
    projs.forEach(function (p) {
        var head = $('.proj__head', p);
        head.addEventListener('click', function () {
            var willOpen = !p.classList.contains('is-open');
            projs.forEach(function (o) {
                o.classList.remove('is-open');
                $('.proj__head', o).setAttribute('aria-expanded', 'false');
            });
            if (willOpen) {
                p.classList.add('is-open');
                head.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- Stack jokes ---------- */
    var jokeBar = $('#joke-bar');
    if (jokeBar) {
        var def = jokeBar.textContent;
        $$('.chip[data-joke]').forEach(function (c) {
            var show = function () { jokeBar.textContent = c.getAttribute('data-joke'); };
            var hide = function () { jokeBar.textContent = def; };
            c.addEventListener('mouseenter', show); c.addEventListener('focus', show);
            c.addEventListener('mouseleave', hide); c.addEventListener('blur', hide);
        });
    }

    /* ---------- Copy email ---------- */
    var copyBtn = $('#copy-email');
    if (copyBtn) {
        var label = copyBtn.textContent;
        copyBtn.addEventListener('click', function () {
            var email = copyBtn.getAttribute('data-email');
            var done = function () {
                copyBtn.classList.add('is-copied');
                copyBtn.textContent = 'Copied. Great taste.';
                setTimeout(function () { copyBtn.classList.remove('is-copied'); copyBtn.textContent = label; }, 2200);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(done, function () { window.location.href = 'mailto:' + email; });
            } else { window.location.href = 'mailto:' + email; }
        });
    }

    /* ---------- Easter egg: click the nav logo 5 times for potato rain ---------- */
    var logo = $('.nav__logo');
    if (logo && $('.home-hero') && !reduceMotion) {
        var clicks = 0, timer;
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            clicks++;
            clearTimeout(timer);
            timer = setTimeout(function () { clicks = 0; }, 1200);
            if (clicks >= 5) {
                clicks = 0;
                for (var i = 0; i < 28; i++) {
                    var s = document.createElement('span');
                    s.className = 'spud-rain';
                    s.textContent = '🥔';
                    s.style.left = Math.random() * 100 + 'vw';
                    s.style.animationDelay = Math.random() * 1.2 + 's';
                    document.body.appendChild(s);
                    setTimeout(function (el) { el.remove(); }.bind(null, s), 4200);
                }
            } else if (clicks === 1) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    /* ---------- Sand Fall: grains falling behind the hero ---------- */
    var sand = $('#sand-canvas');
    if (sand && !reduceMotion) {
        var ctx = sand.getContext('2d'), W, H, grains = [];
        var colors = ['#e9a23b', '#d9803a', '#f2c46b', '#c46a3a'];
        var size = function () {
            var r = sand.parentNode.getBoundingClientRect();
            W = sand.width = r.width; H = sand.height = r.height;
        };
        size(); window.addEventListener('resize', size);
        var spawn = function () { grains.push({ x: Math.random() * W, y: -6, v: 1 + Math.random() * 2, c: colors[(Math.random() * colors.length) | 0] }); };
        var floor = [];
        (function frame() {
            ctx.clearRect(0, 0, W, H);
            if (Math.random() < 0.55) spawn();
            grains.forEach(function (g) {
                g.y += g.v;
                var col = Math.floor(g.x / 4), top = floor[col] || H;
                if (g.y >= top - 4) { floor[col] = top - 4; g.dead = true; if (floor[col] < H * 0.84) floor[col] = H; }
                ctx.fillStyle = g.c; ctx.globalAlpha = .55; ctx.fillRect(Math.floor(g.x / 4) * 4, g.y, 4, 4);
            });
            grains = grains.filter(function (g) { return !g.dead; });
            ctx.globalAlpha = .4;
            floor.forEach(function (t, i) { if (t < H) { ctx.fillStyle = colors[i % colors.length]; ctx.fillRect(i * 4, t, 4, H - t); } });
            requestAnimationFrame(frame);
        })();
    }
})();
