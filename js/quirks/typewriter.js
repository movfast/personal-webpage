/**
 * Quirk: Typing effect on section titles when scrolled into view
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('typewriter', 'Watched the typewriter!', 10, function () {
        var awarded = false;
        var titles = document.querySelectorAll('.section-title');

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                if (el.dataset.typed) return;
                el.dataset.typed = 'true';
                obs.unobserve(el);

                var text = el.textContent;
                el.textContent = '';
                el.style.borderRight = '2px solid var(--accent)';

                var i = 0;
                var interval = setInterval(function () {
                    el.textContent += text[i];
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        setTimeout(function () { el.style.borderRight = 'none'; }, 600);
                        if (!awarded) {
                            awarded = true;
                            QS.awardXP('typewriter');
                        }
                    }
                }, 40);
            });
        }, { threshold: 0.5 });

        titles.forEach(function (t) { obs.observe(t); });
    });
})();
