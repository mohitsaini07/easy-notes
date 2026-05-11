import { useEffect, useState } from 'react';
import { FileText, Eye, Star, Download, Upload, Plus, ChevronRight, Search, Filter, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { PreviewModal } from '../components/PreviewModal';

interface Stats {
  totalUploads: number;
  totalDownloads: number;
  totalLikes: number;
  totalViews: number;
  recentNotes: any[];
}

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  // Preview Modal State
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user?.token}` }
        };
        const { data } = await axios.get('http://localhost:5000/api/notes/stats', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  const handleDownload = async (note: any) => {
    try {
      const response = await fetch(`http://localhost:5000${note.fileUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${note.title}.${note.fileUrl.split('.').pop()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Update download count on server
      await axios.put(`http://localhost:5000/api/notes/${note._id}/download`);
      
      // Refresh stats to show updated count
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/notes/stats', config);
      setStats(data);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handlePreview = (note: any) => {
    setSelectedNote(note);
    setIsPreviewOpen(true);
    // Increment view count locally via API
    axios.get(`http://localhost:5000/api/notes/${note._id}`);
  };

  const filteredNotes = stats?.recentNotes?.filter(n => 
    n.title.toLowerCase().includes(filter.toLowerCase()) || 
    n.subject.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight mb-2">Workspace</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              {user?.name}, you've uploaded {stats?.totalUploads || 0} notes so far.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link to="/upload" className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95">
              <Plus className="h-5 w-5" />
              New Upload
            </Link>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Uploads', value: stats?.totalUploads || 0, icon: <FileText />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Downloads', value: stats?.totalDownloads || 0, icon: <Download />, color: 'text-green-500', bg: 'bg-green-500/10' },
                { label: 'Likes', value: stats?.totalLikes || 0, icon: <Star />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                { label: 'Total Views', value: stats?.totalViews || 0, icon: <Eye />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card p-6 rounded-3xl"
                >
                  <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Content List */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h3 className="text-2xl font-black">Your Content</h3>
                <div className="flex w-full md:w-auto items-center gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search your notes..." 
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredNotes && filteredNotes.length > 0 ? (
                    filteredNotes.map((note, i) => (
                      <motion.div 
                        key={note._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="group flex items-center justify-between p-5 rounded-2xl hover:bg-secondary/50 transition-all border border-transparent hover:border-border cursor-pointer"
                        onClick={() => handlePreview(note)}
                      >
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FileText className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{note.title}</h4>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight flex items-center gap-2">
                              {note.subject} 
                              <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
                              {note.visibility}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden md:flex flex-col items-end text-muted-foreground">
                            <span className="text-sm font-black flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {note.views || 0}
                            </span>
                            <span className="text-[10px] font-bold uppercase">Views</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(note);
                            }}
                            className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-90"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                      <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                         <Upload className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">No notes found</h4>
                      <p className="text-muted-foreground mb-8">Start your journey by uploading your first study material.</p>
                      <Link to="/upload" className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold">
                        Upload Now
                      </Link>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="premium-card p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
               <div className="relative z-10">
                 <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl font-black mb-6 border border-white/20">
                   {user?.name.charAt(0).toUpperCase()}
                 </div>
                 <h2 className="text-2xl font-black mb-1">{user?.name}</h2>
                 <p className="text-primary-foreground/70 font-medium mb-6">{user?.email}</p>
                 <div className="flex gap-2">
                   <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">{user?.role}</span>
                   <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">Level 12</span>
                 </div>
               </div>
            </div>

            {/* Quick Actions/Info */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-xl font-black mb-6">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: 'Invite Friends', icon: <Users className="h-4 w-4" />, color: 'bg-orange-500/10 text-orange-500' },
                  { label: 'Settings', icon: <Plus className="h-4 w-4" />, color: 'bg-blue-500/10 text-blue-500' },
                  { label: 'Contact Support', icon: <Star className="h-4 w-4" />, color: 'bg-green-500/10 text-green-500' },
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/50 transition-all group border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${action.color}`}>{action.icon}</div>
                      <span className="text-sm font-bold">{action.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        note={selectedNote} 
        onDownload={handleDownload}
      />
    </div>
  );
};
