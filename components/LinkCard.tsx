interface LinkCardProps {
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  opinion?: {
    type: "recommended" | "caution" | "free" | "paid";
    note: string;
  };
}

const opinionConfig = {
  recommended: {
    label: "⭐ Recomendado",
    className: "bg-green-50 text-green-700",
  },
  caution: {
    label: "⚠️ Atenção",
    className: "bg-yellow-50 text-yellow-700",
  },
  free: {
    label: "🎁 Grátis",
    className: "bg-blue-50 text-blue-700",
  },
  paid: {
    label: "💳 Pago",
    className: "bg-purple-50 text-purple-700",
  },
};

export default function LinkCard({
  title,
  url,
  description,
  tags,
  opinion,
}: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 bg-white border border-gray-200 rounded-lg 
                 hover:border-blue-400 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Opinion Badge */}
      {opinion && (
        <div
          className={`
          flex items-center gap-2 text-sm px-3 py-2 rounded
          ${opinionConfig[opinion.type].className}
        `}
        >
          <span className="font-medium">
            {opinionConfig[opinion.type].label}
          </span>
          <span className="text-xs">• {opinion.note}</span>
        </div>
      )}
    </a>
  );
}
