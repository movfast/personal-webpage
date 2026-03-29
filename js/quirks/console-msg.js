/**
 * Quirk: Secret "hire me" in console
 */
(function () {
    var QS = window.QuirkSystem;

    QS.registerQuirk('console-msg', 'Found the secret console message!', 10, function () {
        console.log(
            '%c Hey there, curious one! \uD83D\uDC40 ',
            'background: #6c63ff; color: white; font-size: 16px; padding: 8px 12px; border-radius: 4px;'
        );
        console.log(
            '%c Type %cdiscover()%c in the console for a surprise!',
            'color: #8888a0; font-size: 13px;',
            'color: #e63946; font-weight: bold; font-size: 13px;',
            'color: #8888a0; font-size: 13px;'
        );

        window.discover = function () {
            QS.awardXP('console-msg');
            QS.playPowerUp();
            console.log(
                '%c \uD83C\uDF89 Achievement unlocked: Console Explorer! +10 XP',
                'background: #1a1a40; color: #e63946; font-size: 14px; padding: 6px 10px; border-radius: 4px;'
            );
            return '\u2728 You found it! Check the scoreboard on the page.';
        };
    });
})();
