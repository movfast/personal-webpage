/**
 * Quirk: Rainbow wave on logo click
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('rainbow-wave', 'Unleashed the rainbow!', 15, function () {
        var logo = document.querySelector('.logo');
        if (!logo) return;
        logo.style.cursor = 'pointer';

        logo.addEventListener('click', function () {
            QS.awardXP('rainbow-wave');
            QS.playPowerUp();

            var overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '9998',
                pointerEvents: 'none',
                background: 'linear-gradient(135deg, #e63946, #f9a825, #2dc653, #4361ee)',
                opacity: '0',
                transition: 'opacity 0.4s',
            });
            document.body.appendChild(overlay);
            requestAnimationFrame(function () { overlay.style.opacity = '0.25'; });
            setTimeout(function () {
                overlay.style.opacity = '0';
                setTimeout(function () { overlay.remove(); }, 400);
            }, 800);
        });
    });
})();
