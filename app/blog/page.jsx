import Link from "next/link";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabaseClient";
import AdSenseSlot from "@/components/AdSenseSlot";

const SITE_URL = "https://www.devfostertech.com";

export const metadata = {
  title: "Blog | Dev Foster Tech",
  description:
    "Read Dev Foster Tech blog posts on SEO, web development, performance, and practical digital growth strategies.",
  keywords: [
    "Dev Foster Tech blog",
    "SEO blog",
    "web development articles",
    "Next.js blog",
    "digital growth",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Dev Foster Tech",
    description:
      "Read Dev Foster Tech blog posts on SEO, web development, performance, and practical digital growth strategies.",
    url: `${SITE_URL}/blog`,
    siteName: "Dev Foster Tech",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Dev Foster Tech Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Dev Foster Tech",
    description:
      "Read Dev Foster Tech blog posts on SEO, web development, performance, and practical digital growth strategies.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const stripMarkdown = (value = "") =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]*?)\]\(.*?\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getPreviewText = (value) =>
  stripMarkdown(value).slice(0, 140) || "Read the full article.";

const getPostPath = (post) => `/blog/${post.slug || post.id}`;
const getImageSource = (post) => post.image_url || "/og-image.png";
const ADSENSE_SLOTS = {
  sidebarTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_SIDEBAR_TOP || "",
  sidebarMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_SIDEBAR_MID || "",
  inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_INLINE || "",
};

const PAGE_SIZE = 9;

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const query = (params?.q || "").trim().toLowerCase();
  const activeTag = (params?.tag || "").trim().toLowerCase();
  const currentPage = Math.max(1, Number(params?.page || 1) || 1);

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-20">
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
          Failed to load blog posts: {error.message}
        </p>
      </div>
    );
  }

  const allPosts = posts || [];
  const filteredPosts = allPosts.filter((post) => {
    const title = (post.title || "").toLowerCase();
    const content = (post.content || "").toLowerCase();
    const tags = Array.isArray(post.tags) ? post.tags.map((tag) => String(tag).toLowerCase()) : [];
    const queryMatch = !query || title.includes(query) || content.includes(query) || tags.some((tag) => tag.includes(query));
    const tagMatch = !activeTag || tags.includes(activeTag);
    return queryMatch && tagMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const uniqueTags = Array.from(
    new Set(allPosts.flatMap((post) => (Array.isArray(post.tags) ? post.tags : [])))
  ).slice(0, 20);

  const [featuredPost, ...restPosts] = paginatedPosts;
  const trendingPosts = restPosts.slice(0, 3);
  const latestPosts = featuredPost ? restPosts : paginatedPosts;
  const itemListElements = filteredPosts.slice(0, 20).map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}${getPostPath(post)}`,
    name: post.title,
  }));

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Dev Foster Tech Blog",
    description:
      "Read Dev Foster Tech blog posts on SEO, web development, performance, and practical digital growth strategies.",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Dev Foster Tech",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: itemListElements,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pt-24 pb-20 text-white md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <section className="relative overflow-hidden rounded-3xl border border-[#6CDDC2]/30 bg-gradient-to-br from-[#0f1720] via-[#101922] to-[#091017] p-8 md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#6CDDC2]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-[#6CDDC2]/8 blur-3xl" />
        <p className="inline-flex items-center gap-2 rounded-full border border-[#6CDDC2]/40 bg-[#6CDDC2]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6CDDC2]">
          <Sparkles className="h-4 w-4" />
          DevFoster Blog
        </p>
        <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Insights, case studies, and practical strategies for digital growth
        </h1>
        <p className="mt-5 max-w-3xl text-base text-gray-300 md:text-lg">
          Learn what works in SEO, web engineering, and product execution through actionable write-ups from our team.
        </p>

        <form method="GET" action="/blog" className="mt-8 max-w-2xl">
          <label htmlFor="search" className="sr-only">
            Search articles
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search title, content or tags"
              className="w-full rounded-full border border-[#6CDDC2]/50 bg-black/40 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-400 focus:border-[#6CDDC2]"
            />
            {activeTag && <input type="hidden" name="tag" value={activeTag} />}
            </div>
            <button
              type="submit"
              className="rounded-full bg-[#6CDDC2] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#7ce8d0]"
            >
              Search
            </button>
          </div>
        </form>

        {uniqueTags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full border px-3 py-1 text-xs ${!activeTag ? "border-[#6CDDC2] text-[#6CDDC2]" : "border-white/20 text-gray-300"}`}
            >
              All
            </Link>
            {uniqueTags.map((tag) => {
              const selected = activeTag === String(tag).toLowerCase();
              const href = `/blog?tag=${encodeURIComponent(tag)}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
              return (
                <Link
                  key={tag}
                  href={href}
                  className={`rounded-full border px-3 py-1 text-xs ${selected ? "border-[#6CDDC2] text-[#6CDDC2]" : "border-white/20 text-gray-300"}`}
                >
                  #{tag}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-[#6CDDC2]/25 bg-[#0b1116] p-6 md:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6CDDC2]">Featured Article</h2>
          {!featuredPost && (
            <div className="mt-5 rounded-xl border border-white/10 bg-[#0f1115] p-5 text-sm text-gray-400">
              No posts match your filters.
            </div>
          )}

          {featuredPost && (
            <Link href={getPostPath(featuredPost)} className="group mt-6 block">
              <img
                src={getImageSource(featuredPost)}
                alt={featuredPost.title}
                className="h-72 w-full rounded-2xl object-cover transition group-hover:opacity-90"
              />
              <h3 className="mt-5 text-3xl font-bold leading-snug text-white group-hover:text-[#6CDDC2]">
                {featuredPost.title}
              </h3>
              <p className="mt-3 text-gray-300">{getPreviewText(featuredPost.content)}</p>
              <p className="mt-4 text-sm text-gray-400">{formatDate(featuredPost.created_at)}</p>
            </Link>
          )}
        </div>

        <aside className="space-y-6">
          <AdSenseSlot
            slot={ADSENSE_SLOTS.sidebarTop}
            label="Top sidebar banner (300x250 or responsive)."
          />

          <div className="rounded-3xl border border-[#6CDDC2]/25 bg-[#0b1116] p-6">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#6CDDC2]">
              <TrendingUp className="h-4 w-4" />
              Trending Reads
            </h3>
            <div className="mt-4 space-y-4">
              {trendingPosts.length === 0 && <p className="text-sm text-gray-400">More posts will appear here.</p>}
              {trendingPosts.map((post) => (
                <Link key={post.id} href={getPostPath(post)} className="block rounded-xl border border-white/10 p-3 hover:border-[#6CDDC2]/40">
                  <p className="font-semibold text-white">{post.title}</p>
                  <p className="mt-2 text-xs text-gray-400">{formatDate(post.created_at)}</p>
                </Link>
              ))}
            </div>
          </div>

          <AdSenseSlot
            slot={ADSENSE_SLOTS.sidebarMid}
            label="Mid-page sidebar banner for high-visibility placements."
          />
        </aside>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#6CDDC2]">Latest Articles</h2>
          <p className="text-sm text-gray-400">{filteredPosts.length} matching posts</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestPosts.map((post) => (
            <Link key={post.id} href={getPostPath(post)} className="block">
              <Card
                title={post.title}
                description={getPreviewText(post.content)}
                image={getImageSource(post)}
                tags={post.tags || []}
                date={post.created_at}
              />
            </Link>
          ))}
        </div>
      </section>

      {totalPages > 1 && (
        <section className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const targetPage = idx + 1;
            const href = `/blog?page=${targetPage}${query ? `&q=${encodeURIComponent(query)}` : ""}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ""}`;
            const selected = targetPage === page;
            return (
              <Link
                key={targetPage}
                href={href}
                className={`rounded-md border px-3 py-1.5 text-sm transition ${selected ? "border-[#6CDDC2] bg-[#6CDDC2]/10 text-[#6CDDC2]" : "border-white/20 text-gray-300 hover:border-[#6CDDC2]/60 hover:text-[#6CDDC2]"}`}
              >
                {targetPage}
              </Link>
            );
          })}
        </section>
      )}

      <section className="mt-12">
        <AdSenseSlot
          slot={ADSENSE_SLOTS.inline}
          label="Inline content ad slot (good for responsive horizontal units)."
        />
      </section>
    </main>
  );
}
