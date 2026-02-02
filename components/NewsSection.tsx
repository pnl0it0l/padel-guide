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

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
      {/* Gradient overlays para esconder os extremos */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

      <div className="py-4 overflow-hidden">
        <div className="flex gap-8 animate-scroll whitespace-nowrap">
          {doubledNews.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 hover:scale-105 transition-transform"
            >
              <span className="text-xs font-bold text-red-400 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/40 flex-shrink-0">
                {item.source}
              </span>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                {item.title}
              </span>
              <span className="text-blue-400">→</span>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
