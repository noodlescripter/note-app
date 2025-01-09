"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import OpenAI from "openai";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Card, CardContent } from "@/components/ui/card";
import { useAPIKey } from "./provider/apikey-provider";
import { Plus } from "lucide-react";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

// Quill editor formats
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "color",
  "background",
  "align",
  "link",
];

const RichAIContent = ({ aiContent }) => {
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
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <CardContent className="p-6">
          <div className="prose prose-invert max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {renderContent(aiContent)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function AddDialog() {
  const [noteTitle, setNoteTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiContent, setAiContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { apiKey } = useAPIKey();

  async function generateAIResponse(e) {
    e.preventDefault();
    setLoading(true);
    const key = apiKey.key.trim();
    const prompt = apiKey.prompt.trim();
    console.log(prompt);
    try {
      const openai = new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true, // Only if you're calling OpenAI directly from browser
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: `${content}`,
          },
        ],
      });
      console.log(completion.choices[0].message.content);
      setAiContent(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const makeBod = {
      subMainMenu: noteTitle,
      subMenus: {
        original: content,
        ai: aiContent,
      },
      createdAt: new Date().toISOString(),
    };
    const res = await axios.post("/api/v1/postData", makeBod);
    if (res.status === 201) {
      window.location.reload();
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-0"><Plus/>Add</Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-6 py-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-4xl flex items-center justify-between gap-4">
                <Label htmlFor="name" className="min-w-24 text-right">
                  Title
                </Label>
                <Input
                  id="name"
                  value={noteTitle}
                  className="flex-1"
                  onChange={(e) => setNoteTitle(e.target.value)}
                />
              </div>

              <div className="w-full max-w-4xl flex items-start justify-between gap-4">
                <Label htmlFor="content" className="min-w-24 text-right mt-2">
                  Content
                </Label>
                <div className="flex-1 h-64">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    className="h-full"
                    placeholder="Enter your note here..."
                  />
                  <style jsx global>{`
                    .ql-container {
                      height: calc(100% - 42px) !important;
                    }
                    .ql-editor {
                      height: 100%;
                      overflow-y: auto;
                    }
                  `}</style>
                </div>
              </div>
            </div>
          </div>
        </div>
        {aiContent && <RichAIContent aiContent={aiContent}></RichAIContent>}
        <DialogFooter>
          <Button type="submit" onClick={generateAIResponse}>
            Generate AI Response
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
