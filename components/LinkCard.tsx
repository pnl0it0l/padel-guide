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
      className="group flex flex-col h-full bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-blue-500 rounded-lg transition-all duration-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {image && (
        <div className="relative h-24 w-full overflow-hidden bg-gray-800">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 p-3 flex-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-100 group-hover:text-blue-400 transition-colors truncate mb-1">
            {title}
          </h3>
          {tags.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 text-gray-400 bg-gray-800/60 rounded-full group-hover:bg-gray-700 group-hover:text-gray-300 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {opinion && (
            <span
              className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                opinion.type === "recommended"
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
            className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0"
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
