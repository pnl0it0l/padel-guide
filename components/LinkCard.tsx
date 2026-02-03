interface LinkCardProps {
  title: string;
  url: string;
  tags: string[];
  opinion?: {
    type: "recommended" | "caution" | "free" | "paid";
  };
}

export default function LinkCard({
  title,
  url,
  tags,
  opinion,
}: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-2 p-3 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 hover:border-blue-500/50 rounded-lg transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
          {title}
        </h3>
        {tags.length > 0 && (
          <div className="flex gap-1 mt-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 text-gray-400 bg-gray-700/50 rounded-full"
              >
                {tag}
              </span>
          ))}
        </div>

        {/* Opinion Badge */}
        {opinion && (
          <div
            className={`
            flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-bold shadow-lg
            ${opinionConfig[opinion.type].className}
          `}
          >
            <span>{opinionConfig[opinion.type].label}</span>
            <span className="text-xs font-medium opacity-90">
              • {opinion.note}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
