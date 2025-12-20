import { Link } from 'react-router-dom';
import logo from '@/assets/recruit-ai-logo.png';

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={logo} 
            alt="Recruit-AI Logo" 
            className="w-10 h-10 rounded-xl transition-transform group-hover:scale-105"
          />
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
