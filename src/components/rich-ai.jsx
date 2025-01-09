import { Card, CardContent } from "./ui/card";
export const RichAIContent = ({ aiContent }) => {
  if (!aiContent) return null;

  // Helper function to detect if a string is a code block
  const isCodeBlock = (text) => {
    return text.startsWith("```") && text.endsWith("```");
  };

  // Helper function to detect if a string is a list item
  const isListItem = (text) => {
    return text.trim().startsWith("-") || text.trim().match(/^\d+\./);
  };

  // Helper function to detect if a string is a link
  const isLink = (text) => {
    return text.match(/\[.*\]\(.*\)/);
  };

  // Helper function to convert markdown links to JSX
  const renderLinks = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          className="text-blue-400 hover:text-blue-300 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // Function to render different types of content
  const renderContent = (content) => {
    const lines = content.split("\n");

    return lines.map((line, index) => {
      // Handle code blocks
      if (isCodeBlock(line)) {
        const code = line.replace(/```(\w+)?/, "").replace(/```$/, "");
        return (
          <pre
            key={index}
            className="my-4 p-4 bg-gray-800 rounded-lg overflow-x-auto"
          >
            <code className="text-sm text-gray-200">{code}</code>
          </pre>
        );
      }

      // Handle list items
      if (isListItem(line)) {
        return (
          <li key={index} className="ml-6 my-1 text-gray-100">
            {renderLinks(line.replace(/^-|\d+\.\s/, ""))}
          </li>
        );
      }

      // Handle empty lines
      if (!line.trim()) {
        return <br key={index} />;
      }

      // Handle regular text with potential links
      return (
        <p key={index} className="my-2 text-gray-100">
          {renderLinks(line)}
        </p>
      );
    });
  };

  return (
    <div className="max-w-screen mx-auto p-1">
      <Card className="overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <CardContent className="p-6">
          <div className="prose prose-invert max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {renderContent(aiContent)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};