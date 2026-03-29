/**
 * Quirk: Hover tilt on cards (3D perspective)
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('card-tilt', 'Tilted a card!', 5, function () {
        var awarded = false;
        var cards = document.querySelectorAll('.project-card, .blog-card, .detail-card');

        cards.forEach(function (card) {
            card.style.transition = 'transform 0.2s ease';
            card.style.transformStyle = 'preserve-3d';

            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -8;
                var rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';

                if (!awarded) {
                    awarded = true;
                    QS.awardXP('card-tilt');
                }
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    });
})();
