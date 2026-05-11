import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, X, Globe, Lock, FileText, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { motion, AnimatePresence } from 'framer-motion';

export const UploadNote = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('subject', subject);
    formData.append('tags', tags);
    formData.append('file', file);
    formData.append('visibility', visibility);

    try {
      setLoading(true);
      setError('');
      const config = { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        } 
      };
      await axios.post('http://localhost:5000/api/notes', formData, config);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12 bg-card border border-border rounded-[3rem] shadow-2xl max-w-md w-full"
        >
          <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-black mb-4">Upload Successful!</h2>
          <p className="text-muted-foreground mb-8">Your note is now live and being processed by our AI systems.</p>
          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               transition={{ duration: 1.5 }}
               className="h-full bg-primary"
             />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <h1 className="text-4xl font-black tracking-tight mb-2">Publish Material</h1>
             <p className="text-muted-foreground font-medium">Share your knowledge with the community or save it for yourself.</p>
           </motion.div>
           <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Extraction
           </div>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-2xl mb-8 flex items-center gap-3 font-medium"
          >
            <X className="h-5 w-5" />
            {error}
          </motion.div>
        )}

        <form onSubmit={submitHandler} className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-sm">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                 <FileText className="h-6 w-6 text-primary" />
                 Note Details
              </h3>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Note Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Advanced Data Structures & Algorithms"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all text-lg" 
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Subject / Course</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Computer Science"
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)} 
                      required 
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Tags (Comma Separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. algorithms, dsa, java"
                      value={tags} 
                      onChange={(e) => setTags(e.target.value)} 
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Description</label>
                  <textarea 
                    placeholder="Provide a brief summary of what this note covers..."
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    rows={6} 
                    className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all resize-none text-base"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* File Upload Area */}
            <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-sm">
               <h3 className="text-2xl font-black mb-8">File & Privacy</h3>
               
               <div className="space-y-8">
                 <div>
                   <input 
                     type="file" 
                     id="file" 
                     className="hidden" 
                     onChange={(e) => setFile(e.target.files?.[0] || null)}
                     accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                   />
                   <label 
                     htmlFor="file" 
                     className={`cursor-pointer group flex flex-col items-center justify-center gap-6 border-2 border-dashed rounded-[2.5rem] p-12 transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50 hover:border-primary/50'}`}
                   >
                     <div className={`h-20 w-20 rounded-[1.5rem] flex items-center justify-center transition-all ${file ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        {file ? <CheckCircle2 className="h-10 w-10" /> : <Upload className="h-10 w-10" />}
                     </div>
                     <div className="text-center">
                        <span className="block font-black text-base mb-2">{file ? 'File Attached' : 'Drop File Here'}</span>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-secondary px-3 py-1 rounded-full">PDF, JPG or PNG</span>
                     </div>
                   </label>
                   
                   {file && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-secondary/80 backdrop-blur-sm rounded-2xl flex items-center justify-between border border-border"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                           <FileText className="h-5 w-5 text-primary shrink-0" />
                           <span className="text-xs font-bold truncate">{file.name}</span>
                        </div>
                        <button type="button" onClick={() => setFile(null)} className="h-8 w-8 bg-destructive/10 text-destructive rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-all shrink-0">
                           <X className="h-4 w-4" />
                        </button>
                     </motion.div>
                   )}
                 </div>

                 <div className="pt-4">
                   <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-1">Visibility Settings</label>
                   <div className="grid grid-cols-2 gap-4">
                     <button 
                       type="button" 
                       onClick={() => setVisibility('public')}
                       className={`flex items-center justify-center gap-3 py-5 rounded-2xl border-2 font-black text-xs transition-all ${visibility === 'public' ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/50 border-transparent text-muted-foreground hover:border-border'}`}
                     >
                       <Globe className="h-5 w-5" />
                       Public
                     </button>
                     <button 
                       type="button" 
                       onClick={() => setVisibility('private')}
                       className={`flex items-center justify-center gap-3 py-5 rounded-2xl border-2 font-black text-xs transition-all ${visibility === 'private' ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/50 border-transparent text-muted-foreground hover:border-border'}`}
                     >
                       <Lock className="h-5 w-5" />
                       Private
                     </button>
                   </div>
                   <p className="mt-4 text-[10px] text-center text-muted-foreground font-medium px-4">
                     {visibility === 'public' ? 'Everyone can see and download this note.' : 'Only you can access this note in your dashboard.'}
                   </p>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading} 
                   className="w-full bg-primary text-primary-foreground py-6 rounded-[2rem] font-black text-xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                 >
                   <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   {loading ? (
                     <div className="flex items-center justify-center gap-3">
                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                       Publishing...
                     </div>
                   ) : (
                     <span className="flex items-center justify-center gap-3">
                       Publish Note
                       <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                     </span>
                   )}
                 </button>
               </div>
            </div>

            {/* Note Tips */}
            <div className="bg-muted/50 border border-border p-10 rounded-[2.5rem]">
               <h4 className="font-black text-sm mb-6 flex items-center gap-2">
                 <Sparkles className="h-4 w-4 text-primary" />
                 Pro Tips
               </h4>
               <ul className="space-y-4 text-xs text-muted-foreground font-bold">
                  <li className="flex gap-3 leading-relaxed">
                     <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                       <CheckCircle2 className="h-3 w-3 text-primary" />
                     </div>
                     Detailed descriptions increase search visibility by 40%.
                  </li>
                  <li className="flex gap-3 leading-relaxed">
                     <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                       <CheckCircle2 className="h-3 w-3 text-primary" />
                     </div>
                     Use clear, high-quality scans for handwritten notes.
                  </li>
               </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
