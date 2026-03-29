/**
 * Quirk: Konami code -> matrix rain
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('konami-matrix', 'Entered the Matrix!', 50, function () {
        var code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right B A
        var pos = 0;

        document.addEventListener('keydown', function (e) {
            if (e.keyCode === code[pos]) {
                pos++;
                if (pos === code.length) {
                    pos = 0;
                    QS.awardXP('konami-matrix');
                    QS.playSuccessSound();
                    startMatrixRain();
                }
            } else {
                pos = 0;
            }
        });

        function startMatrixRain() {
            var canvas = document.createElement('canvas');
            Object.assign(canvas.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '9997',
                pointerEvents: 'none',
            });
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);

            var ctx = canvas.getContext('2d');
            var cols = Math.floor(canvas.width / 14);
            var drops = Array(cols).fill(1);
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01アイウエオカキクケコ'.split('');

            var interval = setInterval(function () {
                ctx.fillStyle = 'rgba(18, 18, 42, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#2dc653';
                ctx.font = '14px monospace';

                drops.forEach(function (y, i) {
                    var char = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(char, i * 14, y * 14);
                    if (y * 14 > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                });
            }, 50);

            setTimeout(function () {
                clearInterval(interval);
                canvas.style.transition = 'opacity 1s';
                canvas.style.opacity = '0';
                setTimeout(function () { canvas.remove(); }, 1000);
            }, 4000);
        }
    });
})();
