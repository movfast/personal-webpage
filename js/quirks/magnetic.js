/**
 * Quirk: Magnetic cursor — elements subtly pull toward mouse
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('magnetic', 'Felt the magnetism!', 10, function () {
        var awarded = false;
        var btns = document.querySelectorAll('.btn');

        btns.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
                btn.style.transition = 'transform 0.1s ease';

                if (!awarded) {
                    awarded = true;
                    QS.awardXP('magnetic');
                }
            });

            btn.addEventListener('mouseleave', function () {
                btn.style.transform = 'translate(0, 0)';
                btn.style.transition = 'transform 0.3s ease';
            });
        });
    });
})();
