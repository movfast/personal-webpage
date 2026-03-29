/**
 * Quirk: Night mode toggle — double-press N
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('night-mode', 'Toggled night mode!', 15, function () {
        var lastN = 0;
        var isNight = false;

        document.addEventListener('keydown', function (e) {
            if (e.key.toLowerCase() !== 'n' || e.ctrlKey || e.altKey || e.metaKey) return;
            var now = Date.now();
            if (now - lastN < 400) {
                isNight = !isNight;
                QS.awardXP('night-mode');
                QS.playRetroClick();

                var root = document.documentElement;
                if (isNight) {
                    root.style.setProperty('--bg', '#050510');
                    root.style.setProperty('--surface', '#0a0a1a');
                    root.style.setProperty('--border', '#1a1a30');
                    root.style.setProperty('--text-muted', '#606080');
                    document.body.style.transition = 'background 0.5s';
                } else {
                    root.style.setProperty('--bg', '#12122a');
                    root.style.setProperty('--surface', '#1a1a40');
                    root.style.setProperty('--border', '#2e2e5e');
                    root.style.setProperty('--text-muted', '#a0a0c0');
                    document.body.style.transition = 'background 0.5s';
                }
            }
            lastN = now;
        });
    });
})();
