/**
 * init.js — Kick off all registered quirks and create the scoreboard.
 * Must load after registry.js and all individual quirk files.
 */
(function () {
    var QS = window.QuirkSystem;

    document.addEventListener('DOMContentLoaded', function () {
        // Sound & interaction
        QS.quirks['retro-clicks'].init();
        QS.quirks['rainbow-wave'].init();
        QS.quirks['particle-burst'].init();
        QS.quirks['confetti'].init();

        // Visual effects
        QS.quirks['typewriter'].init();
        QS.quirks['card-tilt'].init();
        QS.quirks['gravity-drop'].init();

        // Ambient
        QS.quirks['magnetic'].init();
        QS.quirks['emoji-trail'].init();

        // Secrets
        QS.quirks['konami-matrix'].init();
        QS.quirks['console-msg'].init();
        QS.quirks['secret-word'].init();
        QS.quirks['night-mode'].init();

        // Scoreboard (always last)
        QS.createScoreboard();
    });
})();
