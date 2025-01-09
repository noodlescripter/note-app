import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ResponsiveQuillEditor = ({ content, setContent, modules, formats }) => {
  return (
    <div className="w-full">
      {/* Wrapper with responsive height */}
      <div className="h-auto min-h-[176px] max-h-[350px] md:max-h-[400px] lg:max-h-[450px]">
        {/* Quill container with dynamic height and scrolling */}
        <div className="relative h-full">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Enter note here..."
            className="h-full overflow-y-auto"
          />
        </div>
      </div>

      {/* Custom styles for Quill */}
      <style jsx global>{`
        .ql-container {
          font-size: 16px;
          height: calc(100% - 42px) !important; /* Account for toolbar */
        }

        .ql-editor {
          height: 100%;
          max-height: 100%;
          overflow-y: auto;
        }

        /* Make toolbar sticky */
        .ql-toolbar {
          position: sticky;
          top: 0;
          z-index: 1;
          background: white;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }

        /* Responsive padding */
        @media (max-width: 640px) {
          .ql-editor {
            padding: 0.75rem;
          }
        }

        /* Custom scrollbar */
        .ql-editor::-webkit-scrollbar {
          width: 8px;
        }

        .ql-editor::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .ql-editor::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveQuillEditor;