/**
 * registry.js — Core quirk system: registration, XP tracking,
 * localStorage persistence, toast notifications, sound helpers,
 * and the scoreboard UI.
 *
 * Loads first. Exposes everything via window.QuirkSystem.
 */

(function () {
    const quirks = {};
    const discovered = JSON.parse(localStorage.getItem('mh-discovered') || '{}');
    let totalXP = parseInt(localStorage.getItem('mh-xp') || '0', 10);

    // ============================================================
    // QUIRK REGISTRY
    // ============================================================

    function registerQuirk(name, description, xp, initFn) {
        quirks[name] = { description, xp, init: initFn };
    }

    function awardXP(quirkName) {
        if (discovered[quirkName]) return;
        discovered[quirkName] = true;
        totalXP += quirks[quirkName].xp;
        localStorage.setItem('mh-discovered', JSON.stringify(discovered));
        localStorage.setItem('mh-xp', totalXP.toString());
        showToast('+' + quirks[quirkName].xp + ' XP — ' + quirks[quirkName].description, quirkName);
        updateScoreboard();
    }

    // ============================================================
    // TOAST NOTIFICATION
    // ============================================================

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: '#e63946',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.3s, transform 0.3s',
            pointerEvents: 'none',
            fontFamily: 'system-ui, sans-serif',
        });
        document.body.appendChild(toast);
        requestAnimationFrame(function () {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(function () { toast.remove(); }, 300);
        }, 2500);
    }

    // ============================================================
    // SOUND HELPERS (all generated, no external files needed)
    // ============================================================

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playRetroClick() {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    }

    function playSuccessSound() {
        var notes = [523, 659, 784];
        notes.forEach(function (freq, i) {
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.2);
            osc.start(audioCtx.currentTime + i * 0.1);
            osc.stop(audioCtx.currentTime + i * 0.1 + 0.2);
        });
    }

    function playPowerUp() {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
    }

    // ============================================================
    // SCOREBOARD — persistent XP tracker
    // ============================================================

    function createScoreboard() {
        var board = document.createElement('div');
        board.id = 'xp-board';
        Object.assign(board.style, {
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            background: '#1a1a24',
            border: '1px solid #2a2a3a',
            borderRadius: '10px',
            padding: '0.6rem 1rem',
            zIndex: '9990',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.8rem',
            color: '#e4e4ef',
            cursor: 'pointer',
            transition: 'all 0.3s',
            userSelect: 'none',
        });
        board.innerHTML = '<span style="color:#e63946;font-weight:700;">XP</span> <span id="xp-count">' + totalXP + '</span> · <span id="xp-found">' + Object.keys(discovered).length + '</span>/' + Object.keys(quirks).length;

        // Expand on click to show all quirks
        board.addEventListener('click', function () {
            var existing = document.getElementById('xp-details');
            if (existing) { existing.remove(); return; }

            var details = document.createElement('div');
            details.id = 'xp-details';
            Object.assign(details.style, {
                position: 'fixed',
                bottom: '3.5rem',
                right: '1rem',
                background: '#1a1a24',
                border: '1px solid #2a2a3a',
                borderRadius: '10px',
                padding: '1rem',
                zIndex: '9990',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.8rem',
                color: '#e4e4ef',
                maxWidth: '280px',
            });

            var html = '<div style="font-weight:700;margin-bottom:0.5rem;color:#e63946;">Easter Eggs</div>';
            for (var name in quirks) {
                if (!quirks.hasOwnProperty(name)) continue;
                var q = quirks[name];
                var found = discovered[name];
                html += '<div style="padding:0.25rem 0;color:' + (found ? '#e4e4ef' : '#555') + '">' + (found ? '✓' : '?') + ' ' + (found ? q.description : '???') + ' <span style="color:#e63946;float:right">' + q.xp + ' XP</span></div>';
            }
            html += '<div style="margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid #2a2a3a;font-weight:700;">Total: ' + totalXP + ' XP</div>';
            details.innerHTML = html;
            document.body.appendChild(details);

            var close = function (e) {
                if (!details.contains(e.target) && !board.contains(e.target)) {
                    details.remove();
                    document.removeEventListener('click', close);
                }
            };
            setTimeout(function () { document.addEventListener('click', close); }, 10);
        });

        document.body.appendChild(board);
    }

    function updateScoreboard() {
        var count = document.getElementById('xp-count');
        var found = document.getElementById('xp-found');
        if (count) count.textContent = totalXP;
        if (found) found.textContent = Object.keys(discovered).length;
    }

    // ============================================================
    // EXPOSE VIA window.QuirkSystem
    // ============================================================

    window.QuirkSystem = {
        quirks: quirks,
        discovered: discovered,
        registerQuirk: registerQuirk,
        awardXP: awardXP,
        showToast: showToast,
        playRetroClick: playRetroClick,
        playSuccessSound: playSuccessSound,
        playPowerUp: playPowerUp,
        createScoreboard: createScoreboard,
        updateScoreboard: updateScoreboard,
    };
})();
