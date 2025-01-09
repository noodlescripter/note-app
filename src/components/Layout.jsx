import React, { createContext, useContext, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

// Theme context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => useContext(ThemeContext);

// Layout component
const Layout = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [selectedNoteType, setSelectedNoteType] = useState({});

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title: noteTitle,
      content: noteContent,
      originalContent: noteContent,
      aiContent: "AI enhanced version of: " + noteContent, // This would be replaced with actual AI processing
      timestamp: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setNoteTitle('');
    setNoteContent('');
    setIsAddNoteOpen(false);
    setSelectedNoteType({ ...selectedNoteType, [newNote.id]: 'original' });
  };
  
  // Theme configurations
  const themes = {
    light: {
      background: 'bg-gray-50',
      text: 'text-gray-900',
      nav: 'bg-white',
      sidebar: 'bg-gray-100',
      card: 'bg-white',
      search: 'text-gray-900',
    },
    dark: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
      nav: 'bg-gray-800',
      sidebar: 'bg-gray-800',
      card: 'bg-gray-800',
      search: 'text-gray-100',
    },
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      {/* Navigation */}
      <nav className="fixed w-full top-4 left-0 z-50 px-4">
        <div className={`${currentTheme.nav} bg-opacity-80 backdrop-blur-sm mx-auto max-w-6xl rounded-full h-14 shadow-lg flex items-center justify-between px-6`}>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Note App</h1>
            
            {/* Search Bar */}
            <div className={`relative ${currentTheme.search}`}>
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-full w-64 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentTheme.text}`}
              />
              <span className="absolute left-3 top-2.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Add Button */}
            <button 
              onClick={() => setIsAddNoteOpen(true)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Add Note Modal */}
            <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
              <DialogContent className={`${currentTheme.card} sm:max-w-md`}>
                <DialogHeader>
                  <DialogTitle>Add New Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      placeholder="Enter note title"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className={`${currentTheme.background} ${currentTheme.text}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Content
                    </label>
                    <Textarea
                      id="content"
                      placeholder="Write your note here..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className={`${currentTheme.background} ${currentTheme.text} min-h-[100px]`}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote}>
                    Add Note
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main layout with sidebar */}
      <div className="container flex">
        {/* Sidebar with Notes List */}
        <aside className={`${currentTheme.sidebar} w-80 fixed h-full left-0 top-20 overflow-y-auto border-r border-gray-200 dark:border-gray-700`}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">My Notes</h2>
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`${currentTheme.card} p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer group`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => setSelectedNoteType({ ...selectedNoteType, [note.id]: 'original' })}
                          className={selectedNoteType[note.id] === 'original' ? 'bg-blue-50 dark:bg-blue-900' : ''}
                        >
                          Original Note
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setSelectedNoteType({ ...selectedNoteType, [note.id]: 'ai' })}
                          className={selectedNoteType[note.id] === 'ai' ? 'bg-blue-50 dark:bg-blue-900' : ''}
                        >
                          AI Enhanced
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {selectedNoteType[note.id] === 'ai' ? note.aiContent : note.originalContent}
                  </p>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(note.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No notes yet. Click the + button to add your first note!
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="ml-80 flex-1 p-8">
          <div className={`${currentTheme.card} rounded-xl shadow-sm p-6`}>
            <h2 className="text-2xl font-semibold mb-4">Select a note to view</h2>
            <p className="text-gray-500">Choose a note from the sidebar to view its contents here.</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};


export default Layout;