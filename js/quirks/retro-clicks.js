/**
 * Quirk: Retro click sound on all buttons/links
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('retro-clicks', 'Discovered retro clicks!', 5, function () {
        var firstClick = true;
        document.addEventListener('click', function (e) {
            if (e.target.closest('a, button, .btn, .project-card, .blog-card, .detail-card')) {
                QS.playRetroClick();
                if (firstClick) {
                    firstClick = false;
                    QS.awardXP('retro-clicks');
                }
            }
        });
    });
})();
