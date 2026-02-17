'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "@/utils/uploadImage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const MAX_IMAGE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MIN_CONTENT_LENGTH = 120;
const MAX_TAGS = 10;
const MAX_TITLE_LENGTH = 140;
const MAX_META_DESCRIPTION_LENGTH = 160;
const SITE_URL = "https://www.devfostertech.com";

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

const toTagArray = (rawTags) =>
  Array.from(
    new Set(
      rawTags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    )
  ).slice(0, MAX_TAGS);

const stripMarkdown = (value = "") =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*?\]\(.*?\)/g, " ")
    .replace(/\[[^\]]*?\]\(.*?\)/g, "$1")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toMetaDescription = (content = "", maxLength = MAX_META_DESCRIPTION_LENGTH) => {
  const plain = stripMarkdown(content);
  if (!plain) return "";
  return plain.length > maxLength ? `${plain.slice(0, maxLength - 1)}...` : plain;
};

const toReadingTime = (content = "") => {
  const words = stripMarkdown(content).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getExcerpt = (text) => text?.replace(/\s+/g, " ").trim().slice(0, 140) || "No content.";

const revokeIfBlob = (value) => {
  if (value?.startsWith("blob:")) {
    URL.revokeObjectURL(value);
  }
};

export default function AdminBlogUpload() {
  const formRef = useRef(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Dev Foster Tech");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingPostId, setEditingPostId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [copiedPostId, setCopiedPostId] = useState(null);

  const contentChars = content.trim().length;
  const parsedTags = useMemo(() => toTagArray(tags), [tags]);
  const isEditing = Boolean(editingPostId);
  const seoSlugPreview = useMemo(() => generateSlug(title) || "your-post-slug", [title]);
  const seoMetaTitlePreview = useMemo(
    () => (title.trim() ? `${title.trim()} | Dev Foster Tech` : "Your Post Title | Dev Foster Tech"),
    [title]
  );
  const seoMetaDescriptionPreview = useMemo(
    () => toMetaDescription(content) || "Meta description will be generated from your article content.",
    [content]
  );
  const seoReadingTimePreview = useMemo(() => toReadingTime(content), [content]);
  const seoUrlPreview = `${SITE_URL}/blog/${seoSlugPreview}`;
  const draftStorageKey = "admin_blog_draft_v2";

  const getAuthHeaders = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("Admin session expired. Please login again.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    };
  };

  const apiRequest = async (url, options = {}) => {
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.error || "API request failed.");
    }
    return body;
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (raw) {
        const draft = JSON.parse(raw);
        setTitle(draft.title || "");
        setAuthor(draft.author || "Dev Foster Tech");
        setContent(draft.content || "");
        setTags(draft.tags || "");
      }
    } catch {
      // ignore invalid local draft
    }

    fetchPosts();

    return () => {
      revokeIfBlob(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const draft = {
      title,
      author,
      content,
      tags,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(draftStorageKey, JSON.stringify(draft));
  }, [title, author, content, tags]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const fetchPosts = async () => {
    try {
      const result = await apiRequest("/api/admin/posts");
      setPosts(result.posts || []);
    } catch (fetchError) {
      setError(`Failed to load posts: ${fetchError.message}`);
      setLoadingPosts(false);
      return;
    }
    setLoadingPosts(false);
  };

  const getUniqueSlug = async (rawSlug, currentPostId = null) => {
    const baseSlug = rawSlug || `post-${Date.now()}`;
    const { data: existing, error: slugError } = await supabase
      .from("posts")
      .select("id, slug")
      .ilike("slug", `${baseSlug}%`);

    if (slugError) throw slugError;

    const existingSlugs = new Set(
      (existing || []).filter((item) => item.id !== currentPostId).map((item) => item.slug)
    );

    if (!existingSlugs.has(baseSlug)) {
      return baseSlug;
    }

    let suffix = 1;
    let nextSlug = `${baseSlug}-${suffix}`;
    while (existingSlugs.has(nextSlug)) {
      suffix += 1;
      nextSlug = `${baseSlug}-${suffix}`;
    }

    return nextSlug;
  };

  const clearForm = () => {
    revokeIfBlob(preview);
    setTitle("");
    setAuthor("Dev Foster Tech");
    setContent("");
    setTags("");
    setImage(null);
    setPreview(null);
    setRemoveImage(false);
    setEditingPostId(null);
  };

  const validateForm = () => {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      return "Title and content are required.";
    }

    if (!isEditing && !image) {
      return "Featured image is required for new posts.";
    }

    if (cleanTitle.length > MAX_TITLE_LENGTH) {
      return `Title must be ${MAX_TITLE_LENGTH} characters or less.`;
    }

    if (cleanContent.length < MIN_CONTENT_LENGTH) {
      return `Content must be at least ${MIN_CONTENT_LENGTH} characters.`;
    }

    if (image) {
      const imageSizeMb = image.size / (1024 * 1024);
      if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
        return "Image must be JPG, PNG, WEBP, or GIF.";
      }
      if (imageSizeMb > MAX_IMAGE_SIZE_MB) {
        return `Image size must be ${MAX_IMAGE_SIZE_MB}MB or less.`;
      }
    }

    return null;
  };

  const onSelectImage = (file) => {
    revokeIfBlob(preview);
    setImage(file);
    setRemoveImage(false);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else if (!isEditing) {
      setPreview(null);
    }
  };

  const onEditPost = (post) => {
    setError(null);
    setMessage(null);

    revokeIfBlob(preview);
    setEditingPostId(post.id);
    setTitle(post.title || "");
    setAuthor(post.author || "Dev Foster Tech");
    setContent(post.content || "");
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    setImage(null);
    setPreview(post.image_url || null);
    setRemoveImage(false);
  };

  const onCancelEdit = () => {
    clearForm();
    setError(null);
    setMessage("Edit canceled.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const cleanAuthor = author.trim() || "Dev Foster Tech";

    setSaving(true);

    try {
      const slug = await getUniqueSlug(generateSlug(cleanTitle), editingPostId || null);
      let imageUrl = preview;

      if (removeImage) {
        imageUrl = null;
      }

      if (image) {
        imageUrl = await uploadImage(image, "blogs");
      }

      const payload = {
        title: cleanTitle,
        slug,
        author: cleanAuthor,
        content: cleanContent,
        tags: parsedTags,
        image_url: imageUrl,
      };

      if (isEditing) {
        await apiRequest(`/api/admin/posts/${editingPostId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage(`Post updated successfully. URL: /blog/${slug}`);
      } else {
        await apiRequest("/api/admin/posts", {
          method: "POST",
          body: JSON.stringify({
            ...payload,
            created_at: new Date().toISOString(),
          }),
        });
        setMessage(`Post published successfully. URL: /blog/${slug}`);
      }

      clearForm();
      localStorage.removeItem(draftStorageKey);
      await fetchPosts();
    } catch (submitError) {
      setError(`Operation failed: ${submitError.message}`);
    } finally {
      setSaving(false);
    }
  };

  const onDeletePost = async (postId) => {
    setError(null);
    setMessage(null);

    const post = posts.find((item) => item.id === postId);
    const confirmText = `Delete \"${post?.title || "this post"}\"? This cannot be undone.`;
    if (!window.confirm(confirmText)) {
      return;
    }

    setDeletingId(postId);

    try {
      await apiRequest(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (editingPostId === postId) {
        clearForm();
      }

      setMessage("Post deleted successfully.");
      await fetchPosts();
    } catch (deleteError) {
      setError(`Delete failed: ${deleteError.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const onCopyPostUrl = async (post) => {
    const url = `${SITE_URL}/blog/${post.slug || post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 1500);
    } catch {
      setCopiedPostId(null);
    }
  };

  return (
    <div className="mx-auto mt-16 grid max-w-7xl gap-8 px-4 lg:grid-cols-[1.2fr_1fr]">
      <section className="rounded-xl border border-[#6CDDC2]/30 bg-black p-8">
        <h1 className="text-3xl font-bold text-white">{isEditing ? "Edit Post" : "New Post"}</h1>
        <p className="mt-2 text-sm text-gray-400">Admins can create, edit, and delete blog posts from this panel.</p>

        <div className="mt-5 rounded-lg border border-[#6CDDC2]/25 bg-[#0f1115] p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6CDDC2]">Dynamic SEO Preview</h2>
          <p className="mt-3 text-xs text-gray-400">
            These values are generated automatically while you type, like modern CMS platforms.
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="text-gray-400">URL:</span> {seoUrlPreview}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Meta Title:</span> {seoMetaTitlePreview}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Meta Description:</span> {seoMetaDescriptionPreview}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Estimated Reading Time:</span> {seoReadingTimePreview} min read
            </p>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            className="w-full rounded-lg bg-gray-900 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#6CDDC2]"
            required
          />
          <p className="-mt-3 text-xs text-gray-400">{title.length}/{MAX_TITLE_LENGTH} characters</p>

          <textarea
            placeholder="Write post content (Markdown supported)."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={12}
            className="w-full rounded-lg bg-gray-900 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#6CDDC2]"
            required
          />
          <p className="-mt-3 text-xs text-gray-400">
            {contentChars} characters (minimum {MIN_CONTENT_LENGTH})
          </p>

          <div className="-mt-1">
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className="rounded-md border border-white/30 px-3 py-1.5 text-xs font-medium text-white hover:border-[#6CDDC2]/70"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          {showPreview && (
            <div className="rounded-lg border border-[#6CDDC2]/25 bg-[#0f1115] p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6CDDC2]">Live Preview</p>
              <div className="mt-4 text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    h1: (props) => <h1 className="mt-5 text-3xl font-bold text-white" {...props} />,
                    h2: (props) => <h2 className="mt-5 text-2xl font-bold text-white" {...props} />,
                    h3: (props) => <h3 className="mt-4 text-xl font-semibold text-white" {...props} />,
                    p: (props) => <p className="mt-3 leading-7 text-gray-200" {...props} />,
                    a: (props) => <a className="text-[#6CDDC2] underline" {...props} />,
                    ul: (props) => <ul className="mt-3 list-disc space-y-1 pl-6 text-gray-200" {...props} />,
                    ol: (props) => <ol className="mt-3 list-decimal space-y-1 pl-6 text-gray-200" {...props} />,
                    blockquote: (props) => <blockquote className="mt-4 border-l-4 border-[#6CDDC2]/70 pl-3 italic text-gray-300" {...props} />,
                    code: ({ inline, children, ...props }) =>
                      inline ? (
                        <code className="rounded bg-white/10 px-1 py-0.5 text-[#6CDDC2]" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="text-[#b8f5e7]" {...props}>
                          {children}
                        </code>
                      ),
                    pre: (props) => <pre className="mt-4 overflow-x-auto rounded-md border border-white/10 bg-black/40 p-3" {...props} />,
                    table: (props) => (
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full border-collapse border border-white/20 text-xs" {...props} />
                      </div>
                    ),
                    th: (props) => <th className="border border-white/20 px-2 py-1 text-left text-white" {...props} />,
                    td: (props) => <td className="border border-white/20 px-2 py-1 text-gray-200" {...props} />,
                  }}
                >
                  {content || "_Your markdown preview will appear here._"}
                </ReactMarkdown>
              </div>
            </div>
          )}

          <input
            type="text"
            placeholder="Author name"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="w-full rounded-lg bg-gray-900 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#6CDDC2]"
          />

          <input
            type="text"
            placeholder={`Tags (comma separated, max ${MAX_TAGS})`}
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="w-full rounded-lg bg-gray-900 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#6CDDC2]"
          />

          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsedTags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#6CDDC2]/20 px-3 py-1 text-xs text-[#6CDDC2]">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif"
              onChange={(event) => onSelectImage(event.target.files?.[0] || null)}
              className="w-full text-gray-400"
            />
            <p className="mt-2 text-xs text-gray-500">Accepted: JPG, PNG, WEBP, GIF. Max size: {MAX_IMAGE_SIZE_MB}MB.</p>

            {preview && (
              <div className="mt-4 space-y-3">
                <img src={preview} alt="Preview" className="max-h-56 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    revokeIfBlob(preview);
                    setImage(null);
                    setPreview(null);
                    setRemoveImage(true);
                  }}
                  className="rounded-md border border-red-400/60 px-3 py-1 text-xs text-red-300 hover:bg-red-400/10"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#6CDDC2] px-6 py-3 font-semibold text-black transition hover:bg-[#5ac3aa] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (isEditing ? "Saving..." : "Publishing...") : isEditing ? "Save Changes" : "Publish Post"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
        {message && <p className="mt-6 text-sm text-emerald-400">{message}</p>}
      </section>

      <section className="rounded-xl border border-[#6CDDC2]/30 bg-black p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Manage Posts</h2>
          <span className="text-sm text-gray-400">{posts.length} total</span>
        </div>

        {loadingPosts && <p className="mt-6 text-gray-400">Loading posts...</p>}

        {!loadingPosts && posts.length === 0 && (
          <p className="mt-6 rounded-lg border border-white/10 p-4 text-sm text-gray-400">No posts yet.</p>
        )}

        <div className="mt-5 space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg border border-white/10 bg-[#0f1115] p-4">
              <h3 className="text-lg font-semibold text-white">{post.title}</h3>
              <p className="mt-1 text-xs text-gray-400">
                {formatDate(post.created_at)} · {post.author || "Dev Foster Tech"} · /blog/{post.slug || post.id}
              </p>
              <p className="mt-3 text-sm text-gray-300">{getExcerpt(post.content)}</p>

              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={`${post.id}-${tag}`} className="rounded-full bg-[#6CDDC2]/15 px-2.5 py-1 text-xs text-[#6CDDC2]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <a
                  href={`${SITE_URL}/blog/${post.slug || post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-white/25 px-3 py-1.5 text-sm text-white hover:border-[#6CDDC2]/60"
                >
                  View Live
                </a>
                <button
                  type="button"
                  onClick={() => onCopyPostUrl(post)}
                  className="rounded-md border border-white/25 px-3 py-1.5 text-sm text-white hover:border-[#6CDDC2]/60"
                >
                  {copiedPostId === post.id ? "Copied" : "Copy URL"}
                </button>
                <button
                  type="button"
                  onClick={() => onEditPost(post)}
                  className="rounded-md border border-[#6CDDC2]/60 px-3 py-1.5 text-sm text-[#6CDDC2] hover:bg-[#6CDDC2]/10"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePost(post.id)}
                  disabled={deletingId === post.id}
                  className="rounded-md border border-red-500/60 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === post.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

