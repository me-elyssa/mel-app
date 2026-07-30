import DOMPurify from "isomorphic-dompurify";

interface RichTextContentProps {
  html: string;
  className?: string;
}

export default function RichTextContent({ html, className = "" }: RichTextContentProps) {
  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
