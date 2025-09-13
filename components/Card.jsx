function Card({ title, description, image, tags = [], date }) {
  return (
    <div className="bg-gray-900 border border-[#6CDDC2] rounded-2xl overflow-hidden shadow-md w-80 flex flex-col">
      
      {/* Image Section */}
      {image && (
        <div className="relative w-full h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">

    {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#6CDDC2]/30 text-[#6CDDC2] text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}



        {/* Title */}
        {title && <h2 className="text-xl font-bold text-white mb-2">{title}</h2>}

        {/* Description */}
        {description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}

        

        {/* Date */}
        {date && (
          <p className="text-gray-400 text-xs mt-auto">
            {new Date(date).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export default Card;
