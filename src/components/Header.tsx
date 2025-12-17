import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">Recruit-AI</span>
        </Link>
        <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
          Demo Prototype
        </div>
      </div>
    </header>
  );
};

export default Header;
