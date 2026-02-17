'use client'
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { trackEvent } from "@/lib/clientAnalytics";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");

const childrenToText = (children) => {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (!children) return "";
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (children.props?.children) return childrenToText(children.props.children);
  return "";
};

export default function BlogMarkdownContent({ content, headingAnchors, articleSlug, articleTitle }) {
  const [copiedCode, setCopiedCode] = useState("");
  let headingCursor = 0;

  const copyCode = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      trackEvent("article_code_copy", {
        slug: articleSlug,
        title: articleTitle,
      });
      setCopiedCode(value);
      setTimeout(() => setCopiedCode(""), 1500);
    } catch {
      setCopiedCode("");
    }
  };

  const nextHeadingId = (children) => {
    const fromMap = headingAnchors?.[headingCursor]?.id;
    headingCursor += 1;
    if (fromMap) return fromMap;
    return slugify(childrenToText(children) || `section-${headingCursor}`);
  };

  const markdownComponents = {
    h1: ({ children, ...props }) => <h1 id={nextHeadingId(children)} className="mt-8 text-4xl font-bold text-white scroll-mt-28" {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 id={nextHeadingId(children)} className="mt-8 text-3xl font-bold text-white scroll-mt-28" {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 id={nextHeadingId(children)} className="mt-6 text-2xl font-semibold text-white scroll-mt-28" {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 id={nextHeadingId(children)} className="mt-6 text-xl font-semibold text-white scroll-mt-28" {...props}>{children}</h4>,
    p: (props) => <p className="mt-4 text-gray-200 leading-8" {...props} />,
    a: (props) => <a className="text-[#6CDDC2] underline underline-offset-2 hover:text-[#7ce8d0]" {...props} />,
    ul: (props) => <ul className="mt-4 list-disc pl-6 text-gray-200 space-y-2" {...props} />,
    ol: (props) => <ol className="mt-4 list-decimal pl-6 text-gray-200 space-y-2" {...props} />,
    li: (props) => <li className="leading-7" {...props} />,
    blockquote: (props) => <blockquote className="mt-6 border-l-4 border-[#6CDDC2]/70 pl-4 italic text-gray-300" {...props} />,
    hr: () => <hr className="my-8 border-white/15" />,
    code: ({ inline, className, children, ...props }) => {
      const codeText = String(children).replace(/\n$/, "");
      if (inline) {
        return (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[#6CDDC2]" {...props}>
            {children}
          </code>
        );
      }

      return (
        <div className="mt-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => copyCode(codeText)}
              className="mb-2 rounded-md border border-white/20 px-2.5 py-1 text-xs text-gray-200 hover:border-[#6CDDC2]/60"
            >
              {copiedCode === codeText ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#0f1115] p-4 text-sm">
            <code className={`text-[#b8f5e7] ${className || ""}`} {...props}>
              {codeText}
            </code>
          </pre>
        </div>
      );
    },
    pre: ({ children }) => <>{children}</>,
    table: (props) => (
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse border border-white/20 text-sm" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-white/10 text-white" {...props} />,
    th: (props) => <th className="border border-white/20 px-3 py-2 text-left font-semibold" {...props} />,
    td: (props) => <td className="border border-white/20 px-3 py-2 text-gray-200" {...props} />,
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
      {content || ""}
    </ReactMarkdown>
  );
}
