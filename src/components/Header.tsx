import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-card via-card to-primary/5 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-primary/40 group-hover:scale-105">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Recruit-AI
            </span>
            <span className="text-xs text-muted-foreground -mt-0.5">Smart Hiring Assistant</span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
