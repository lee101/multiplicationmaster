(function () {
    "use strict";
    var SITE = 'https://multiplicationmaster.v5games.com/';
    function shareText() {
        var s = window.mmShare;
        return s ? 'I scored ' + s.score + ' points' + (s.stars ? ' and ' + s.stars + ' star' + (s.stars > 1 ? 's' : '') : '') +
            ' on level ' + s.level + ' of Multiplication Master. Can you beat me?' :
            'Multiplication Master: a free times tables game. Build equations and beat the clock!';
    }
    function flash(btn, msg) {
        var old = btn.getAttribute('data-label') || btn.textContent;
        btn.setAttribute('data-label', old);
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = old; }, 1800);
    }
    function copy(text, btn) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () { flash(btn, 'Copied'); }, function () { window.prompt('Copy this link', text); });
        } else {
            window.prompt('Copy this link', text);
        }
    }
    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('[data-share],[data-copy-link]');
        if (!btn) return;
        e.preventDefault();
        if (btn.hasAttribute('data-copy-link')) return copy(SITE, btn);
        var text = shareText();
        if (navigator.share) {
            navigator.share({title: 'Multiplication Master', text: text, url: SITE}).catch(function () {});
        } else {
            copy(text + ' ' + SITE, btn);
        }
    });
})();
(function () {
    function sweep() {
        var chips = document.querySelectorAll('.google-anno-sc,.google-anno-skip');
        for (var i = 0; i < chips.length; i++) chips[i].parentNode && chips[i].parentNode.removeChild(chips[i]);
        var w = document.querySelectorAll('.google-anno,.google-anno-t,.google-anno-wrapper');
        for (var j = 0; j < w.length; j++) {
            var el = w[j], p = el.parentNode;
            if (!p) continue;
            while (el.firstChild) p.insertBefore(el.firstChild, el);
            p.removeChild(el);
        }
    }
    new MutationObserver(sweep).observe(document.documentElement, {childList: true, subtree: true});
    sweep();
})();
