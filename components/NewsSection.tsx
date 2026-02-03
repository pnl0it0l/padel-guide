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
      <div className="relative overflow-hidden bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
        <div className="flex gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 min-w-[400px]">
              <div className="h-3 bg-gray-700 rounded w-24"></div>
              <div className="h-3 bg-gray-700 rounded w-64"></div>
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
    <div className="relative overflow-hidden bg-gray-900 backdrop-blur-sm rounded-lg border border-gray-800 shadow-xl">
      {/* Gradient overlays para esconder os extremos */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

      <div className="py-4 overflow-hidden group/ticker">
        <div className="flex gap-8 animate-scroll whitespace-nowrap group-hover/ticker:[animation-play-state:paused]">
          {newsWithHeaders.map((item, index) =>
            item.type === "header" ? (
              <div
                key={`header-${index}`}
                className="flex items-center gap-2 px-4"
              >
                <span className="text-sm font-semibold text-blue-500 uppercase tracking-wider">
                  NEWS
                </span>
                <span className="text-gray-700">•</span>
              </div>
            ) : item.type === "news" ? (
              <a
                key={index}
                href={item.data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 hover:scale-105 transition-all"
              >
                <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-500/20 flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  {item.data.source}
                </span>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-normal">
                  {item.data.title}
                </span>
                <span className="text-blue-500 group-hover:text-blue-400 transition-colors">
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
