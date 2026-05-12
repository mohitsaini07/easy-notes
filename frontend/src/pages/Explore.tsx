import { useEffect, useState } from 'react';
import axios, { getFileUrl } from '../api/axios';
import { Search, Download, Eye, ArrowUpDown, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreviewModal } from '../components/PreviewModal';

interface Note {
  _id: string;
  title: string;
  description: string;
  subject: string;
  fileUrl: string;
  downloads: number;
  likes: number;
  views: number;
  uploader: { name: string; avatar: string };
  tags: string[];
  createdAt: string;
}

export const Explore = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('latest');
  
  // Preview Modal State
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/notes?keyword=${keyword}&sort=${sort}`);
      setNotes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchNotes, 500);
    return () => clearTimeout(timeoutId);
  }, [keyword, sort]);

  const handleDownload = async (note: Note) => {
    try {
      const response = await fetch(getFileUrl(note.fileUrl));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${note.title}.${note.fileUrl.split('.').pop()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Update download count on server
      await axios.put(`/api/notes/${note._id}/download`);
      
      // Update local state for immediate feedback
      setNotes(prev => prev.map(n => n._id === note._id ? {...n, downloads: (n.downloads || 0) + 1} : n));
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handlePreview = (note: Note) => {
    setSelectedNote(note);
    setIsPreviewOpen(true);
    // Increment view count locally (it happens on backend too when fetching by ID, but Explore uses bulk fetch)
    // Actually, our backend increments views only in getNoteById. 
    // To be accurate, we should hit the backend when previewing.
    axios.get(`/api/notes/${note._id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-secondary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header and Search Area */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles className="h-3 w-3" />
                Community Hub
              </div>
              <h1 className="text-5xl font-black tracking-tight mb-2">Explore Community</h1>
              <p className="text-muted-foreground text-lg">Discover the best study materials shared by top students.</p>
            </div>
            
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search titles, subjects, tags..." 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full h-14 bg-card border border-border rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
              </div>
              <div className="relative">
                <select 
                   value={sort}
                   onChange={(e) => setSort(e.target.value)}
                   className="h-14 bg-card border border-border rounded-2xl px-10 text-sm font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                </select>
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {['Computer Science', 'Engineering', 'Mathematics', 'Medicine', 'Business', 'History'].map(tag => (
               <button key={tag} onClick={() => setKeyword(tag)} className="px-4 py-2 rounded-full bg-card border border-border text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                 {tag}
               </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-[2.5rem] h-[400px] animate-pulse"></div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {notes.map((note, i) => (
                <motion.div 
                  key={note._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="premium-card group rounded-[2.5rem] overflow-hidden flex flex-col h-full bg-card cursor-pointer"
                  onClick={() => handlePreview(note)}
                >
                  <div className="h-48 relative overflow-hidden flex items-center justify-center bg-linear-to-br from-primary/10 to-secondary p-8">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                     <BookOpen className="h-20 w-20 text-primary/20 group-hover:scale-125 transition-transform duration-500 group-hover:rotate-6" />
                     <div className="absolute bottom-4 left-4 right-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white border border-white/10">
                           {note.subject}
                        </span>
                     </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                       {note.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">#{tag}</span>
                       ))}
                    </div>
                    
                    <h3 className="text-xl font-black mb-3 line-clamp-1 group-hover:text-primary transition-colors">{note.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                      {note.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                      <div className="flex items-center gap-3">
                         <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center text-xs font-black text-primary border border-primary/10">
                            {note.uploader?.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-black truncate max-w-[80px]">{note.uploader?.name}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Author</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                           <span className="text-xs font-black flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {note.views || 0}
                           </span>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase">Views</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(note);
                          }}
                          className="h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && notes.length === 0 && (
          <div className="text-center py-40">
            <div className="h-32 w-32 bg-card border border-border rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
               <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-black mb-4">No results found</h2>
            <p className="text-muted-foreground mb-8">We couldn't find any public notes matching your search criteria.</p>
            <button onClick={() => setKeyword('')} className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold">
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        note={selectedNote} 
        onDownload={handleDownload}
      />
    </div>
  );
};
