import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EnhancedQuillCard = ({ content, title, timestamp }) => {
  const processContent = (htmlContent) => {
    if (!htmlContent) return "";

    let processed = htmlContent
      // Handle Quill syntax blocks
      .replace(
        /<pre class="ql-syntax"([^>]*)>(.*?)<\/pre>/gs,
        '<div class="bg-gray-50 rounded-lg p-4 my-4 overflow-x-auto w-full max-w-5xl max-h-[600px] min-h-[400px] mx-auto"><pre class="font-mono text-sm text-gray-800"$1>$2</pre></div>'
      )
      // Handle markdown-style code blocks
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<div class="bg-gray-50 rounded-lg p-4 my-4 overflow-x-auto"><pre class="font-mono text-sm text-gray-800">$2</pre></div>'
      )
      // Handle empty paragraphs
      .replace(/<p><br><\/p>/g, '<p class="h-4"></p>')
      // Convert plain URLs to links
      .replace(
        /\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600">$1</a>'
      )
      // Handle markdown style links [text](url)
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600">$1</a>'
      )
      // Handle plain URLs at the start of text
      .replace(
        /(^|\s)(https?:\/\/[^\s]+)/g,
        '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600">$2</a>'
      )
      // Handle markdown lists if not already in HTML
      .replace(/^-\s+(.+)$/gm, "<ul><li>$1</li></ul>")
      .replace(/^\d+\.\s+(.+)$/gm, "<ol><li>$1</li></ol>")
      // Handle markdown headings if not already in HTML
      .replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
      .replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
      .replace(/^#\s+(.+)$/gm, "<h1>$1</h1>")
      // Handle markdown bold and italic if not in HTML
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.+?)_/g, "<em>$1</em>");

    return processed;
  };
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4">
      <Card className="w-full max-w-5xl max-h-[800px] min-h-[400px] mx-auto">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <span className="text-sm text-gray-500">
            {formatDate(timestamp)}
          </span>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto">
          <div
            className={`
              space-y-4 
              [&>p]:mb-4 
              [&>p>a]:text-blue-500 
              [&>p>a]:hover:text-blue-600 
              [&>p>a]:underline 
              [&>p>a]:break-words
              
              [&>ul]:list-disc 
              [&>ul]:pl-6 
              [&>ul]:mb-4 
              [&>ul>li]:mb-2
              
              [&>ol]:list-decimal 
              [&>ol]:pl-6 
              [&>ol]:mb-4 
              [&>ol>li]:mb-2
              
              [&>h1]:text-3xl 
              [&>h1]:font-bold 
              [&>h1]:mb-4
              
              [&>h2]:text-2xl 
              [&>h2]:font-bold 
              [&>h2]:mb-3
              
              [&>h3]:text-xl 
              [&>h3]:font-bold 
              [&>h3]:mb-3
              
              [&_strong]:font-bold
              [&_em]:italic
              
              [&_code]:bg-gray-100 
              [&_code]:px-1 
              [&_code]:py-0.5 
              [&_code]:rounded 
              [&_code]:font-mono 
              [&_code]:text-sm
              
              [&_table]:w-full 
              [&_table]:border-collapse 
              [&_table]:mb-4
              [&_th]:border 
              [&_th]:border-gray-200 
              [&_th]:p-2 
              [&_th]:bg-gray-50
              [&_td]:border 
              [&_td]:border-gray-200 
              [&_td]:p-2
              
              [&_img]:max-w-full 
              [&_img]:h-auto 
              [&_img]:rounded-lg
              
              [&>ul>li>ul]:pl-6 
              [&>ul>li>ul]:mt-2 
              [&>ul>li>ul]:list-circle
              [&>ol>li>ol]:pl-6 
              [&>ol>li>ol]:mt-2
              
              [&_blockquote]:text-gray-700
              [&_blockquote]:pl-4
              [&_blockquote]:border-l-4
              [&_blockquote]:border-gray-200
              
              [&_hr]:my-6 
              [&_hr]:border-t 
              [&_hr]:border-gray-200
            `}
            dangerouslySetInnerHTML={{ __html: processContent(content) }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedQuillCard;
