interface LinkCardProps {
  title: string;
  url: string;
  tags: string[];
  opinion?: { type: "recommended" | "caution" | "free" | "paid" };
  image?: string;
}

export default function LinkCard({
  title,
  url,
  tags,
  opinion,
  image,
}: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full bg-gradient-to-br from-gray-900/90 to-gray-900/70 hover:from-gray-800/90 hover:to-gray-800/70 border border-gray-800/80 hover:border-blue-500/60 rounded-xl transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1.5 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {image && (
        <div className="relative h-20 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          {opinion && (
            <div className="absolute top-1.5 right-1.5">
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-bold backdrop-blur-md shadow-lg ${opinion.type === "recommended"
                    ? "bg-green-500/30 text-green-300 border border-green-400/40 shadow-green-500/20"
                    : opinion.type === "free"
                      ? "bg-blue-500/30 text-blue-300 border border-blue-400/40 shadow-blue-500/20"
                      : opinion.type === "paid"
                        ? "bg-purple-500/30 text-purple-300 border border-purple-400/40 shadow-purple-500/20"
                        : "bg-yellow-500/30 text-yellow-300 border border-yellow-400/40 shadow-yellow-500/20"
                  }`}
              >
                {opinion.type === "recommended"
                  ? "⭐"
                  : opinion.type === "free"
                    ? "🎁"
                    : opinion.type === "paid"
                      ? "💳"
                      : "⚠️"}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between gap-2 p-3 flex-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs md:text-sm font-semibold text-gray-100 group-hover:text-blue-400 transition-colors truncate mb-1.5 leading-snug">
            {title}
          </h3>
          {tags.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] px-2 py-0.5 text-gray-400 bg-gray-800/80 rounded-full group-hover:bg-blue-500/20 group-hover:text-blue-300 group-hover:border-blue-500/30 border border-transparent transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {!image && opinion && (
            <span
              className={`text-xs px-2 py-0.5 rounded-md font-bold ${opinion.type === "recommended"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : opinion.type === "free"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : opinion.type === "paid"
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                }`}
            >
              {opinion.type === "recommended"
                ? "⭐"
                : opinion.type === "free"
                  ? "🎁"
                  : opinion.type === "paid"
                    ? "💳"
                    : "⚠️"}
            </span>
          )}

          <svg
            className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
