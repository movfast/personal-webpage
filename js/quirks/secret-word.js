/**
 * Quirk: Secret word — type "spies" anywhere on the page
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('secret-word', 'Totally a spy!', 30, function () {
        var secret = 'spies';
        var buffer = '';

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            buffer += e.key.toLowerCase();
            if (buffer.length > secret.length) buffer = buffer.slice(-secret.length);

            if (buffer === secret) {
                buffer = '';
                QS.awardXP('secret-word');
                QS.playSuccessSound();

                // Flash the page in Totally Spies colors
                var colors = ['#e63946', '#2dc653', '#f9a825'];
                var i = 0;
                var flash = setInterval(function () {
                    document.body.style.boxShadow = 'inset 0 0 100px ' + colors[i % 3] + '40';
                    i++;
                    if (i > 6) {
                        clearInterval(flash);
                        document.body.style.boxShadow = 'none';
                    }
                }, 150);

                // Spin the logo
                var logo = document.querySelector('.logo');
                if (logo) {
                    logo.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    logo.style.transform = 'rotate(720deg) scale(1.3)';
                    setTimeout(function () {
                        logo.style.transform = 'rotate(0) scale(1)';
                    }, 1000);
                }
            }
        });
    });
})();
