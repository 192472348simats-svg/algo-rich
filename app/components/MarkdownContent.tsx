"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const components: Components = {
    h1: ({ children, ...props }) => (
      <h1
        className="text-3xl font-bold text-white mt-8 mb-4 first:mt-0"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => {
      const id =
        typeof children === "string"
          ? children.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
          : undefined;
      return (
        <h2
          id={id}
          className="text-2xl font-bold text-gold-primary mt-10 mb-4 scroll-mt-24"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => (
      <h3
        className="text-xl font-semibold text-gold-light mt-6 mb-3"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p
        className="text-gray-light/90 leading-[1.8] mb-4 text-[17px]"
        {...props}
      >
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 ml-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-gray-light/85 text-[17px] leading-relaxed" {...props}>
        {children}
      </li>
    ),
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-gold-primary hover:text-gold-light underline decoration-gold-primary/30 hover:decoration-gold-primary transition-colors"
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-gold-primary/60 pl-4 py-2 my-6 bg-gold-primary/5 rounded-r-lg"
        {...props}
      >
        <div className="text-gray-light/80 italic">{children}</div>
      </blockquote>
    ),
    code: ({ children, className, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code
            className="bg-gold-primary/10 text-gold-light px-1.5 py-0.5 rounded text-[15px] font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={`${className || ""} text-[15px]`} {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => (
      <pre
        className="bg-[#0A1128] border border-gold-primary/20 rounded-xl p-5 my-6 overflow-x-auto text-[15px] leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table
          className="w-full border-collapse border border-gold-primary/20 rounded-lg overflow-hidden"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-navy-light/60" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }) => (
      <th
        className="text-left px-4 py-3 text-gold-primary font-semibold text-sm border-b border-gold-primary/20"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="px-4 py-3 text-gray-light/80 text-sm border-b border-navy-light/30"
        {...props}
      >
        {children}
      </td>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-white" {...props}>
        {children}
      </strong>
    ),
    hr: (props) => (
      <hr className="border-gold-primary/20 my-8" {...props} />
    ),
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
