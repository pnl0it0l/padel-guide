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
      className="group flex flex-col bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 hover:border-blue-500/50 rounded-lg transition-all duration-200 overflow-hidden"
    >
      {image && (
        <div className="relative h-20 w-full overflow-hidden bg-gray-700/30">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
            {title}
          </h3>
          {tags.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 text-gray-400 bg-gray-700/50 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {opinion && (
          <div className="flex-shrink-0">
            <span
              className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                opinion.type === "recommended"
                  ? "bg-green-500/20 text-green-400"
                  : opinion.type === "free"
                    ? "bg-blue-500/20 text-blue-400"
                    : opinion.type === "paid"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-yellow-500/20 text-yellow-400"
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

        <svg
          className="w-3 h-3 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0"
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
    </a>
  );
}
