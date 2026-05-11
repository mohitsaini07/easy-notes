import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login({ ...data, token: data.token });
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 relative overflow-hidden p-4">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
             <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <BookOpen className="h-8 w-8 text-white" />
             </div>
             <span className="text-2xl font-black tracking-tighter">EasyNotes</span>
          </Link>
          <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Log in to access your premium workspace.</p>
        </div>

        <div className="bg-card border border-border p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-secondary/50 border border-border rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full bg-secondary/50 border border-border rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all" 
                />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              New to EasyNotes? <Link to="/register" className="text-primary font-black hover:underline ml-1">Create an account</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
