/**
 * Quirk: Gravity drop on Ctrl+Shift+G
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('gravity-drop', 'Broke gravity!', 25, function () {
        function triggerGravity() {
            QS.awardXP('gravity-drop');
            QS.playPowerUp();

            var elements = document.querySelectorAll(
                '.project-card, .blog-card, .detail-card, .skill-category, .tag'
            );

            elements.forEach(function (el) {
                el.style.transition = 'transform 1s cubic-bezier(0.55, 0, 1, 0.45)';
                el.style.transform = 'translateY(' + (window.innerHeight + 200) + 'px) rotate(' + (Math.random() * 40 - 20) + 'deg)';
            });

            setTimeout(function () {
                elements.forEach(function (el) {
                    el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    el.style.transform = 'translateY(0) rotate(0deg)';
                });
            }, 2000);
        }

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'G') {
                e.preventDefault();
                triggerGravity();
            }
        });
    });
})();
