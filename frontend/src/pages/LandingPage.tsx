import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, UploadCloud, Users, Sparkles, Shield, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const features = [
  {
    icon: <UploadCloud className="h-6 w-6 text-blue-500" />,
    title: "Seamless Uploads",
    description: "Upload PDFs, PPTs, or handwritten notes instantly with lightning-fast processing.",
    color: "bg-blue-500/10"
  },
  {
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    title: "AI Insights",
    description: "Get instant AI-generated summaries and key concepts from your study materials.",
    color: "bg-purple-500/10"
  },
  {
    icon: <Users className="h-6 w-6 text-pink-500" />,
    title: "Global Community",
    description: "Connect with thousands of students worldwide and exchange high-quality resources.",
    color: "bg-pink-500/10"
  },
  {
    icon: <Shield className="h-6 w-6 text-green-500" />,
    title: "Private Storage",
    description: "Keep your notes private or share them with specific groups securely.",
    color: "bg-green-500/10"
  },
  {
    icon: <Zap className="h-6 w-6 text-orange-500" />,
    title: "Instant Search",
    description: "Find exactly what you need with our ultra-fast, intelligent search engine.",
    color: "bg-orange-500/10"
  },
  {
    icon: <Heart className="h-6 w-6 text-red-500" />,
    title: "Always Free",
    description: "Built by students, for students. We believe knowledge should be accessible to all.",
    color: "bg-red-500/10"
  }
];

export const LandingPage = () => {
  const user = useAuthStore((state) => state.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-8 animate-pulse">
              <Sparkles className="h-4 w-4" />
              Revolutionizing Study for 50,000+ Students
            </span>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] lg:leading-none">
              Knowledge Sharing <br />
              <span className="gradient-text">Redefined.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              The world's most premium platform for student collaboration. 
              Upload, discover, and master any subject with the power of community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 group">
                {user ? "Go to Dashboard" : "Get Started Now"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/explore" className="w-full sm:w-auto px-10 py-5 bg-secondary border border-border rounded-2xl font-bold hover:bg-secondary/80 transition-all flex items-center justify-center gap-3">
                Browse Community
                <BookOpen className="h-5 w-5" />
              </Link>
            </div>

            {/* Dashboard Mockup/Teaser */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-20 relative max-w-5xl mx-auto"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-primary/5 to-primary/20 rounded-3xl blur-2xl -z-10"></div>
              <div className="bg-card border border-border p-4 rounded-3xl shadow-2xl overflow-hidden aspect-video flex items-center justify-center bg-[url('https://img.magnific.com/free-photo/single-fake-purple-flower-inside-closed-notebook-stained-background_23-2147925563.jpg?t=st=1778477452~exp=1778481052~hmac=66f50d11a222efdbf4b43e01053c67a926ffe5b1eab6027dfbdcfe3046a6d58f&w=1480')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                   <div className="bg-white/10 backdrop-blur-md p-8 rounded-full border border-white/20">
                      <Zap className="h-12 w-12 text-white fill-white" />
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Students", value: "50K+" },
              { label: "Study Materials", value: "1.2M+" },
              { label: "Daily Downloads", value: "25K+" },
              { label: "AI Summaries", value: "100K+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Built for Excellence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our features are designed to help you organize, collaborate, and excel in your academic journey.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="premium-card p-8 rounded-4xl group"
              >
                <div className={`h-16 w-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="bg-primary p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
            <h2 className="text-4xl md:text-6xl font-black text-primary-foreground mb-8 leading-tight">
              Ready to elevate your <br /> study game?
            </h2>
            <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-background text-foreground rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl active:scale-95">
              Join for free
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">EasyNotes</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              © 2026 EasyNotes. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
