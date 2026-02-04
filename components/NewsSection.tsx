"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  contentSnippet: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data.news || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading news:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="relative overflow-hidden glass rounded-2xl p-5 shadow-xl">
        <div className="flex gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 min-w-[400px]">
              <div className="h-3 bg-gray-700/50 rounded w-24"></div>
              <div className="h-3 bg-gray-700/50 rounded w-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Não foi possível carregar as notícias</p>
      </div>
    );
  }

  // Duplica as notícias para criar o loop infinito
  const doubledNews = [...news, ...news];

  // Cria array com header "NOTÍCIAS" repetido
  const newsWithHeaders: Array<
    { type: "header" } | { type: "news"; data: NewsItem }
  > = [];
  for (let i = 0; i < doubledNews.length; i++) {
    if (i % 3 === 0) {
      newsWithHeaders.push({ type: "header" });
    }
    newsWithHeaders.push({ type: "news", data: doubledNews[i] });
  }

  return (
    <div className="relative overflow-hidden glass rounded-2xl shadow-2xl border border-gray-700/50">
      {/* Gradient overlays para esconder os extremos */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

      <div className="py-5 overflow-hidden group/ticker">
        <div className="flex gap-10 animate-scroll whitespace-nowrap group-hover/ticker:[animation-play-state:paused]">
          {newsWithHeaders.map((item, index) =>
            item.type === "header" ? (
              <div
                key={`header-${index}`}
                className="flex items-center gap-3 px-4"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                    NEWS
                  </span>
                </div>
                <span className="text-gray-600">•</span>
              </div>
            ) : item.type === "news" ? (
              <a
                key={index}
                href={item.data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/item flex items-center gap-3 hover:scale-105 transition-all duration-300"
              >
                <span className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30 flex-shrink-0 group-hover/item:bg-blue-500/30 group-hover/item:border-blue-400/50 transition-all duration-300 shadow-sm">
                  {item.data.source}
                </span>
                <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors font-medium">
                  {item.data.title}
                </span>
                <span className="text-blue-400 group-hover/item:text-blue-300 transition-colors text-lg">
                  →
                </span>
              </a>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
