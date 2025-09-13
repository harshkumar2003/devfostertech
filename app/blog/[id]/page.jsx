import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
export default async function Post({ params }) {
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!post)
    return (
      <p className="text-center pt-32 text-gray-400 text-lg">
        Post not found
      </p>
    )

  return (
    <article className="max-w-5xl mx-auto px-6 py-20 pt-28">
      <div className="text-white pb-8 flex items-center gap-1 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4 text-center items-center"/>
          <Link href='/blog'>Back to Blog</Link>
      </div>
      {/* Hero Section */}
      {post.image_url && (
        <div className="w-full h-[20rem] mb-12 relative rounded-3xl overflow-hidden shadow-xl">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <h1 className="absolute bottom-6 left-6 text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            {post.title}
          </h1>
        </div>
      )}

      {/* Meta Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 text-sm text-gray-400 border-b border-gray-700 pb-6">
        <p>
          Published on{" "}
          <span className="font-medium text-gray-200">
            {new Date(post.created_at).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </p>
        <p>
          By{" "}
          <span className="font-medium text-[#6CDDC2]">
            {post.author || "Admin"}
          </span>
        </p>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#6CDDC2]/10 hover:bg-[#6CDDC2]/20 text-[#6CDDC2] transition-colors text-sm font-medium px-4 py-1.5 rounded-full cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed mb-16">
        {post.content.split("\n").map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      
    </article>
  )
}
