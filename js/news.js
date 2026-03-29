(function () {
    const FEEDS = [
        "https://techcrunch.com/category/artificial-intelligence/feed/",
        "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
        "https://feeds.arstechnica.com/arstechnica/technology-lab",
        "https://blog.google/technology/ai/rss/"
    ];
    const PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";
    const MAX_ARTICLES = 6;
    const MAX_PER_SOURCE = 2;
    const CACHE_KEY = "mh-ai-news";
    const CACHE_TTL = 3600000; // 1 hour in ms

    function trimToSentences(text, count) {
        var clean = text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        var sentences = clean.match(/[^.!?]+[.!?]+/g);
        if (!sentences) return clean;
        return sentences.slice(0, count).join(" ").trim();
    }

    function formatDate(dateStr) {
        var d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    function escapeHTML(str) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function renderArticles(articles) {
        var grid = document.getElementById("news-grid");
        if (!articles.length) {
            grid.innerHTML = '<div class="news-loading">Could not load news. Check back later.</div>';
            return;
        }
        grid.innerHTML = articles.map(function (a) {
            return (
                '<a href="' + encodeURI(a.link) + '" target="_blank" rel="noopener" class="news-card">' +
                    '<div class="news-date">' + escapeHTML(formatDate(a.pubDate)) + '</div>' +
                    '<h3>' + escapeHTML(a.title) + '</h3>' +
                    '<p>' + escapeHTML(a.summary) + '</p>' +
                    '<span class="news-source">' + escapeHTML(a.source) + '</span>' +
                '</a>'
            );
        }).join("");
    }

    function getSourceName(feedUrl) {
        if (feedUrl.indexOf("techcrunch") !== -1) return "TechCrunch";
        if (feedUrl.indexOf("theverge") !== -1) return "The Verge";
        if (feedUrl.indexOf("arstechnica") !== -1) return "Ars Technica";
        if (feedUrl.indexOf("blog.google") !== -1) return "Google AI Blog";
        return "AI News";
    }

    function fetchFeed(feedUrl) {
        return fetch(PROXY + encodeURIComponent(feedUrl))
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.status !== "ok" || !data.items) return [];
                var source = getSourceName(feedUrl);
                return data.items.map(function (item) {
                    return {
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate,
                        summary: trimToSentences(item.description || item.content || "", 3),
                        source: source
                    };
                });
            })
            .catch(function () { return []; });
    }

    function loadNews() {
        // Check cache
        var cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                var parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < CACHE_TTL) {
                    renderArticles(parsed.articles);
                    return;
                }
            } catch (e) { /* stale or corrupt cache, refetch */ }
        }

        Promise.all(FEEDS.map(fetchFeed))
            .then(function (results) {
                var all = [];
                results.forEach(function (items) { all = all.concat(items); });

                // Sort by date, newest first
                all.sort(function (a, b) { return new Date(b.pubDate) - new Date(a.pubDate); });

                // Cap per source so one feed can't dominate
                var articles = [];
                var sourceCounts = {};
                for (var i = 0; i < all.length && articles.length < MAX_ARTICLES; i++) {
                    var src = all[i].source;
                    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
                    if (sourceCounts[src] <= MAX_PER_SOURCE) {
                        articles.push(all[i]);
                    }
                }

                // Cache results
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    articles: articles
                }));

                renderArticles(articles);
            });
    }

    if (document.getElementById("news-grid")) {
        loadNews();
    }
})();
