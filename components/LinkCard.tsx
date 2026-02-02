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
  image?: string;
}

const opinionConfig = {
  recommended: {
    label: "⭐ Recomendado",
    className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
  },
  caution: {
    label: "⚠️ Atenção",
    className: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
  },
  free: {
    label: "🎁 Grátis",
    className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
  },
  paid: {
    label: "💳 Pago",
    className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  },
};

export default function LinkCard({
  title,
  url,
  description,
  tags,
  opinion,
  image,
}: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700/50
                 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 
                 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
    >
      {/* Image */}
      {image && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-900/30 to-green-900/30">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors pr-2">
            {title}
          </h3>
          <div className="w-8 h-8 rounded-full bg-gray-700/50 group-hover:bg-blue-500/20 flex items-center justify-center flex-shrink-0 transition-colors">
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-bold text-gray-300 bg-gray-700/50 rounded-full border border-gray-600/50
                         group-hover:bg-blue-500/20 group-hover:text-blue-400 group-hover:border-blue-500/50 transition-colors"
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
