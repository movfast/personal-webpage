/**
 * Quirk: Triple-click anywhere -> confetti
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('confetti', 'Confetti party!', 20, function () {
        var clickCount = 0;
        var clickTimer = null;

        document.addEventListener('click', function () {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(function () { clickCount = 0; }, 400);

            if (clickCount === 3) {
                clickCount = 0;
                QS.awardXP('confetti');
                QS.playSuccessSound();
                launchConfetti();
            }
        });

        function launchConfetti() {
            var colors = ['#e63946', '#2dc653', '#f9a825', '#4361ee', '#f472b6', '#a78bfa'];

            for (var i = 0; i < 80; i++) {
                var confetti = document.createElement('div');
                var color = colors[Math.floor(Math.random() * colors.length)];
                var left = Math.random() * 100;
                var delay = Math.random() * 0.5;
                var size = 6 + Math.random() * 6;
                var rotation = Math.random() * 360;

                Object.assign(confetti.style, {
                    position: 'fixed',
                    top: '-10px',
                    left: left + 'vw',
                    width: size + 'px',
                    height: size * (Math.random() > 0.5 ? 1 : 0.6) + 'px',
                    background: color,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    zIndex: '9999',
                    pointerEvents: 'none',
                    transform: 'rotate(' + rotation + 'deg)',
                    animation: 'confettiFall ' + (2 + Math.random() * 2) + 's ' + delay + 's ease-in forwards',
                });
                document.body.appendChild(confetti);
                setTimeout((function (c) {
                    return function () { c.remove(); };
                })(confetti), 4500);
            }
        }

        // Inject confetti keyframes once
        var style = document.createElement('style');
        style.textContent = '\
            @keyframes confettiFall {\
                0% { top: -10px; opacity: 1; }\
                80% { opacity: 1; }\
                100% { top: 105vh; opacity: 0; transform: rotate(720deg) translateX(50px); }\
            }\
        ';
        document.head.appendChild(style);
    });
})();
