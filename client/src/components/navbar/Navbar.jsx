import React from 'react';
import { Search, Bell, Moon, Sun, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


// Standard implementation for DropdownMenu to use natively if shadcn cli wasn't used
// We will stub a simplified Dropdown for the profile for now using basic state, or just a simple button if preferred.
// Since we didn't implement DropdownMenu primitive fully, let's use a simplified native implementation or stub it.
// I'll implement a simple one using state for the profile menu to keep it dependency-light.

function SimpleProfileDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 outline-none"
      >
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-popover text-popover-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-2">
            <div className="px-2 py-1.5 text-sm font-semibold">My Account</div>
            <div className="h-px bg-border my-1" />
            <Link to="/profile" className="block px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer">Profile</Link>
            <Link to="/settings" className="block px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer">Settings</Link>
            <div className="h-px bg-border my-1" />
            <div className="block px-2 py-1.5 text-sm hover:bg-accent text-destructive rounded-sm cursor-pointer">Log out</div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Navbar({ toggleTheme, isDark }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 w-1/2">
        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Home</Link>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const label = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

            return (
              <React.Fragment key={to}>
                <ChevronRight className="h-4 w-4 mx-1" />
                {last ? (
                  <span className="text-foreground">{label}</span>
                ) : (
                  <Link to={to} className="hover:text-foreground transition-colors">{label}</Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:flex w-64 lg:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets, employees..."
            className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="pl-2 border-l">
          <SimpleProfileDropdown />
        </div>
      </div>
    </header>
  );
}
