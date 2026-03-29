/**
 * Quirk: Emoji trail — hold Shift and move mouse
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('emoji-trail', 'Left a trail!', 15, function () {
        var awarded = false;
        var emojis = ['\u2728', '\uD83E\uDD16', '\uD83E\uDDE0', '\uD83D\uDD25', '\uD83D\uDCA1', '\uD83D\uDE80', '\u26A1'];
        var lastTime = 0;

        document.addEventListener('mousemove', function (e) {
            if (!e.shiftKey) return;
            var now = Date.now();
            if (now - lastTime < 80) return;
            lastTime = now;

            if (!awarded) {
                awarded = true;
                QS.awardXP('emoji-trail');
            }

            var emoji = document.createElement('span');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            Object.assign(emoji.style, {
                position: 'fixed',
                left: e.clientX + 'px',
                top: e.clientY + 'px',
                fontSize: '1.2rem',
                pointerEvents: 'none',
                zIndex: '9995',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.8s ease-out',
                opacity: '1',
            });
            document.body.appendChild(emoji);

            requestAnimationFrame(function () {
                emoji.style.top = (e.clientY - 40 - Math.random() * 30) + 'px';
                emoji.style.left = (e.clientX + (Math.random() - 0.5) * 40) + 'px';
                emoji.style.opacity = '0';
                emoji.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });

            setTimeout(function () { emoji.remove(); }, 900);
        });
    });
})();
