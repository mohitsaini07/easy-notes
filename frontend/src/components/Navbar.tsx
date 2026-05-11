import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, Compass, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/70">
            EasyNotes
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/explore" 
            className={`text-sm font-medium transition-all hover:text-primary flex items-center gap-1.5 ${isActive('/explore') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Compass className="h-4 w-4" />
            Explore
          </Link>
          {user && (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-all hover:text-primary flex items-center gap-1.5 ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                to="/upload" 
                className={`text-sm font-medium transition-all hover:text-primary flex items-center gap-1.5 ${isActive('/upload') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <PlusCircle className="h-4 w-4" />
                Upload
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-border/50">
              <div className="flex flex-col items-end hidden lg:flex">
                <span className="text-xs font-semibold">{user.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
              </div>
              <div className="h-9 w-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary font-bold uppercase cursor-pointer hover:bg-primary/20 transition-colors">
                {user.name.charAt(0)}
              </div>
              <button 
                onClick={handleLogout} 
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
