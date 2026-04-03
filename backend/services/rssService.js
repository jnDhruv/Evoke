// backend/services/rssService.js
const Parser = require("rss-parser");
const parser = new Parser();

const DISRUPTION_KEYWORDS = [
  "curfew",
  "bandh",
  "strike",
  "protest",
  "shutdown",
  "flood",
  "waterlogging",
  "riot",
  "blocked",
  "closed",
  "cancelled",
  "disruption",
  "closure",
  "agitation",
];

const SEVERITY_HIGH = ["curfew", "bandh", "riot", "flood"];
const SEVERITY_MED = ["strike", "protest", "shutdown", "waterlogging"];

const RSS_FEEDS = [
  "https://feeds.feedburner.com/ndtvnews-top-stories",
  "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
];

async function getSocialScore(pincode) {
  try {
    let allHeadlines = [];

    for (const feed of RSS_FEEDS) {
      try {
        const result = await parser.parseURL(feed);
        allHeadlines = allHeadlines.concat(
          result.items.map((i) =>
            (i.title + " " + (i.contentSnippet || "")).toLowerCase(),
          ),
        );
      } catch (e) {
        // One feed failing shouldn't break everything
        console.warn("RSS feed failed:", feed);
      }
    }

    let score = 0;
    let matchedKeywords = [];

    for (const headline of allHeadlines) {
      for (const kw of DISRUPTION_KEYWORDS) {
        if (headline.includes(kw)) {
          matchedKeywords.push(kw);
          if (SEVERITY_HIGH.includes(kw)) score = Math.max(score, 0.85);
          else if (SEVERITY_MED.includes(kw)) score = Math.max(score, 0.55);
          else score = Math.max(score, 0.35);
        }
      }
    }

    return {
      score: parseFloat(score.toFixed(2)),
      matchedKeywords: [...new Set(matchedKeywords)].slice(0, 5),
    };
  } catch (err) {
    console.error("RSS error:", err.message);
    return { score: 0, matchedKeywords: [] };
  }
}

module.exports = { getSocialScore };
