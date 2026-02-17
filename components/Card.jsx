function Card({ title, description, image, tags = [], date }) {
  const imageSource = image || "/og-image.png";

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-[#6CDDC2]/35 bg-gradient-to-b from-[#0e141b] to-[#0a1016] shadow-md transition hover:-translate-y-1 hover:border-[#6CDDC2]/70 hover:shadow-[0_16px_40px_rgba(108,221,194,0.12)]">
      
      {/* Image Section */}
      <div className="relative h-52 w-full">
        <img
          src={imageSource}
          alt={title}
          className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b10] via-transparent to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="flex h-full flex-col p-5">

    {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full border border-[#6CDDC2]/35 bg-[#6CDDC2]/12 px-2.5 py-1 text-[11px] font-medium text-[#6CDDC2]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}



        {/* Title */}
        {title && <h2 className="mb-2 line-clamp-2 text-lg font-bold text-white">{title}</h2>}

        {/* Description */}
        {description && (
          <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-300">
            {description}
          </p>
        )}

        

        {/* Date */}
        {date && (
          <p className="mt-auto border-t border-white/10 pt-3 text-xs text-gray-400">
            {new Date(date).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </article>
  );
}

export default Card;
