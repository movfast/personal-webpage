/**
 * Quirk: Particle burst on project card click
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('particle-burst', 'Sparked a project!', 10, function () {
        var awarded = false;

        document.addEventListener('click', function (e) {
            var card = e.target.closest('.project-card');
            if (!card) return;

            if (!awarded) {
                awarded = true;
                QS.awardXP('particle-burst');
            }

            var rect = card.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;

            for (var i = 0; i < 20; i++) {
                var particle = document.createElement('div');
                var angle = (Math.PI * 2 * i) / 20;
                var distance = 60 + Math.random() * 80;
                var size = 4 + Math.random() * 4;
                var hues = [0, 45, 140, 230]; // red, yellow, green, blue
                var hue = hues[Math.floor(Math.random() * hues.length)];

                Object.assign(particle.style, {
                    position: 'fixed',
                    left: cx + 'px',
                    top: cy + 'px',
                    width: size + 'px',
                    height: size + 'px',
                    borderRadius: '50%',
                    background: 'hsl(' + hue + ', 80%, 65%)',
                    zIndex: '9996',
                    pointerEvents: 'none',
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    opacity: '1',
                });
                document.body.appendChild(particle);

                (function (p, a, d) {
                    requestAnimationFrame(function () {
                        p.style.left = cx + Math.cos(a) * d + 'px';
                        p.style.top = cy + Math.sin(a) * d + 'px';
                        p.style.opacity = '0';
                        p.style.transform = 'scale(0)';
                    });
                })(particle, angle, distance);

                setTimeout((function (p) {
                    return function () { p.remove(); };
                })(particle), 700);
            }
        });
    });
})();
