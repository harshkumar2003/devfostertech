import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"
import BlogShareButtons from "@/components/BlogShareButtons"
import BlogMarkdownContent from "@/components/BlogMarkdownContent"
import ArticleViewTracker from "@/components/ArticleViewTracker"

const SITE_URL = "https://www.devfostertech.com"

const toPlainText = (value = "") => value.replace(/[#>*`~_\-\[\]\(\)!]/g, "").replace(/\s+/g, " ").trim()
const toDescription = (value = "", maxLength = 160) => {
  const clean = toPlainText(value)
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean
}
const toReadingTime = (value = "") => Math.max(1, Math.ceil(toPlainText(value).split(" ").filter(Boolean).length / 200))
const getPostPath = (post) => `/blog/${post.slug || post.id}`

const normalizeHeadingText = (value = "") =>
  value
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/[*_~]/g, "")
    .trim()

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")

const buildHeadingAnchors = (content = "") => {
  const idCount = new Map()
  const lines = content.split(/\r?\n/)
  const headings = []

  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/)
    if (!match) continue

    const level = match[1].length
    const text = normalizeHeadingText(match[2])
    if (!text) continue

    const baseId = slugify(text) || `section-${headings.length + 1}`
    const seenCount = idCount.get(baseId) || 0
    idCount.set(baseId, seenCount + 1)
    const id = seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`

    headings.push({ id, text, level })
  }

  return headings
}

async function getPostBySlugOrId(slug) {
  const { data: postBySlug, error: slugError } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (postBySlug || slugError) {
    return { post: postBySlug, error: slugError }
  }

  const fallbackResult = await supabase
    .from("posts")
    .select("*")
    .eq("id", slug)
    .maybeSingle()

  return { post: fallbackResult.data, error: fallbackResult.error }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { post } = await getPostBySlugOrId(slug)

  if (!post) {
    return {
      title: "Post Not Found | Dev Foster Tech",
      description: "The requested blog post could not be found.",
      alternates: { canonical: `${SITE_URL}/blog` },
    }
  }

  const canonicalSlug = post.slug || post.id
  const canonicalUrl = `${SITE_URL}/blog/${canonicalSlug}`
  const description = toDescription(post.content || post.title)
  const ogImage = post.image_url || `${SITE_URL}/og-image.png`

  return {
    title: `${post.title} | Dev Foster Tech`,
    description,
    keywords: Array.isArray(post.tags) ? post.tags : [],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      siteName: "Dev Foster Tech",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at || post.created_at,
      authors: [post.author || "Dev Foster Tech"],
      tags: Array.isArray(post.tags) ? post.tags : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Post({ params }) {
  const { slug } = await params
  const { post, error } = await getPostBySlugOrId(slug)

  if (post?.slug && slug !== post.slug) {
    redirect(`/blog/${post.slug}`)
  }

  if (error) {
    return <p className="text-center pt-32 text-red-400 text-lg">Error: {error.message}</p>
  }

  if (!post) {
    redirect("/blog")
  }

  const { data: allPosts } = await supabase
    .from("posts")
    .select("id,title,slug,tags,created_at")
    .order("created_at", { ascending: false })

  const postList = allPosts || []
  const currentIndex = postList.findIndex((item) => item.id === post.id)
  const newerPost = currentIndex > 0 ? postList[currentIndex - 1] : null
  const olderPost = currentIndex >= 0 && currentIndex < postList.length - 1 ? postList[currentIndex + 1] : null

  const currentTags = new Set(Array.isArray(post.tags) ? post.tags : [])
  let relatedPosts = postList
    .filter((item) => item.id !== post.id)
    .filter((item) => Array.isArray(item.tags) && item.tags.some((tag) => currentTags.has(tag)))
    .slice(0, 3)

  if (relatedPosts.length === 0) {
    relatedPosts = postList.filter((item) => item.id !== post.id).slice(0, 3)
  }

  const headingAnchors = buildHeadingAnchors(post.content || "")
  const canonicalSlug = post.slug || post.id
  const canonicalUrl = `${SITE_URL}/blog/${canonicalSlug}`
  const description = toDescription(post.content || post.title)
  const imageSource = post.image_url || "/og-image.png"
  const readingTime = toReadingTime(post.content || "")
  const publishedAt = new Date(post.created_at)
  const updatedAt = post.updated_at ? new Date(post.updated_at) : publishedAt

  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: post.image_url ? [post.image_url] : [`${SITE_URL}/og-image.png`],
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    wordCount: toPlainText(post.content || "").split(" ").filter(Boolean).length,
    timeRequired: `PT${readingTime}M`,
    author: {
      "@type": "Person",
      name: post.author || "Dev Foster Tech",
    },
    publisher: {
      "@type": "Organization",
      name: "Dev Foster Tech",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    keywords: Array.isArray(post.tags) ? post.tags.join(", ") : "",
  }

  return (
    <article className="mx-auto max-w-7xl px-6 py-20 pt-28 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }} />
      <ArticleViewTracker slug={canonicalSlug} title={post.title} />

      <div className="pb-8 flex items-center gap-2 hover:text-[#6CDDC2]">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/blog">Back to Blog</Link>
      </div>

      <div className="w-full h-[20rem] mb-10 relative rounded-3xl overflow-hidden shadow-xl">
        <img src={imageSource} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <h1 className="absolute bottom-6 left-6 pr-6 text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
          {post.title}
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-400 border-b border-gray-700 pb-6">
            <p>
              Published: <span className="font-medium text-gray-200">{publishedAt.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
            </p>
            <p>
              Updated: <span className="font-medium text-gray-200">{updatedAt.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
            </p>
            <p>
              By <span className="font-medium text-[#6CDDC2]">{post.author || "Dev Foster Tech"}</span>
            </p>
            <p>{readingTime} min read</p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#6CDDC2]/10 hover:bg-[#6CDDC2]/20 text-[#6CDDC2] transition-colors text-sm font-medium px-4 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mb-14">
            <BlogMarkdownContent
              content={post.content || ""}
              headingAnchors={headingAnchors}
              articleSlug={canonicalSlug}
              articleTitle={post.title}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 mb-12">
            {olderPost ? (
              <Link href={getPostPath(olderPost)} className="rounded-xl border border-white/10 bg-[#0f1115] p-4 hover:border-[#6CDDC2]/50">
                <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Previous Article</p>
                <p className="mt-2 font-semibold text-white">{olderPost.title}</p>
              </Link>
            ) : (
              <div className="rounded-xl border border-white/10 bg-[#0f1115] p-4 text-gray-500">No previous article</div>
            )}

            {newerPost ? (
              <Link href={getPostPath(newerPost)} className="rounded-xl border border-white/10 bg-[#0f1115] p-4 hover:border-[#6CDDC2]/50">
                <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Next Article</p>
                <p className="mt-2 font-semibold text-white">{newerPost.title}</p>
              </Link>
            ) : (
              <div className="rounded-xl border border-white/10 bg-[#0f1115] p-4 text-gray-500">No next article</div>
            )}
          </div>

          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-[#6CDDC2] mb-4">Related Articles</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.id}
                    href={getPostPath(item)}
                    className="rounded-xl border border-white/10 bg-[#0f1115] p-4 hover:border-[#6CDDC2]/50"
                  >
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 self-start">
          <BlogShareButtons title={post.title} url={canonicalUrl} slug={canonicalSlug} />

          <div className="rounded-xl border border-white/10 bg-[#0f1115] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Table of Contents</p>
            {headingAnchors.length === 0 && <p className="mt-3 text-sm text-gray-500">No section headings in this article.</p>}
            <ul className="mt-3 space-y-2 text-sm">
              {headingAnchors.map((heading) => (
                <li key={heading.id} className={heading.level >= 3 ? "ml-3" : ""}>
                  <a href={`#${heading.id}`} className="text-gray-300 hover:text-[#6CDDC2]">
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  )
}
