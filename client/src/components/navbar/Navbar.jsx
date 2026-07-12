import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, ChevronRight, PlusCircle, Wrench, FilePlus, Calendar } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';

export function Navbar({ toggleTheme, isDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, kpi } = useStore();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const pathnames = location.pathname.split('/').filter((x) => x);

  const handleQuickAction = (route) => {
    setQuickActionsOpen(false);
    navigate(route);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      {/* Left section: Breadcrumbs */}
      <div className="flex items-center gap-4 w-1/3">
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
                  <span className="text-foreground font-semibold">{label}</span>
                ) : (
                  <Link to={to} className="hover:text-foreground transition-colors">{label}</Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right section: Search, Actions, Theme, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:flex w-64 lg:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets, bookings..."
            className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1 focus:bg-background transition-all duration-200"
          />
        </div>

        {/* Quick Actions Dropdown */}
        <div className="relative">
          <Button 
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="h-9 gap-1.5 hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            size="sm"
          >
            <PlusCircle size={16} />
            Quick Action
          </Button>
          {quickActionsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setQuickActionsOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border bg-card text-card-foreground shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Create New</div>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => handleQuickAction('/booking')}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent text-left transition-colors"
                >
                  <Calendar size={14} className="text-primary" />
                  <span>Book Resource</span>
                </button>
                <button
                  onClick={() => handleQuickAction('/maintenance')}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent text-left transition-colors"
                >
                  <Wrench size={14} className="text-yellow-600" />
                  <span>Raise Maintenance</span>
                </button>
                <button
                  onClick={() => handleQuickAction('/my-requests')}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent text-left transition-colors"
                >
                  <FilePlus size={14} className="text-green-600" />
                  <span>Request New Asset</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notification Bell */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 rounded-xl hover:bg-accent"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-5 w-5" />
          {kpi.unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white border-2 border-background animate-pulse">
              {kpi.unreadNotifications}
            </span>
          )}
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-accent" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Profile Avatar Dropdown */}
        <div className="pl-2 border-l relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)} 
            className="flex items-center gap-2 outline-none group"
          >
            <Avatar className="h-9 w-9 border-2 border-muted group-hover:border-primary transition-all duration-200 cursor-pointer">
              <AvatarImage src={profile.photo} />
              <AvatarFallback>{profile.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
            </Avatar>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border bg-card text-card-foreground shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 flex items-center gap-3 border-b">
                  <Avatar className="h-10 w-10 border border-muted">
                    <AvatarImage src={profile.photo} />
                    <AvatarFallback>{profile.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <div className="font-semibold text-sm truncate">{profile.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{profile.email}</div>
                  </div>
                </div>
                <div className="p-1.5">
                  <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{profile.role} • {profile.department}</div>
                  <div className="h-px bg-border my-1" />
                  <Link 
                    to="/profile" 
                    onClick={() => setProfileOpen(false)}
                    className="block px-2.5 py-2 text-sm hover:bg-accent rounded-lg transition-colors cursor-pointer"
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setProfileOpen(false)}
                    className="block px-2.5 py-2 text-sm hover:bg-accent rounded-lg transition-colors cursor-pointer"
                  >
                    System Settings
                  </Link>
                  <div className="h-px bg-border my-1" />
                  <div 
                    onClick={() => { setProfileOpen(false); alert("Signing out... (Mock)"); }}
                    className="block px-2.5 py-2 text-sm hover:bg-destructive/10 text-destructive rounded-lg transition-colors cursor-pointer"
                  >
                    Log out
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
