import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, ChevronRight, PlusCircle, Wrench, CalendarPlus, FilePlus2, LogOut, User, Settings } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';

function QuickActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        variant="outline" 
        className="flex items-center gap-1.5 h-9 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary rounded-xl cursor-pointer"
      >
        <PlusCircle className="h-4 w-4" />
        <span className="hidden sm:inline text-xs font-semibold">Quick Actions</span>
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-card border shadow-lg focus:outline-none z-50 overflow-hidden">
            <div className="p-1">
              <button 
                onClick={() => { setIsOpen(false); navigate('/booking'); }} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg cursor-pointer text-left"
              >
                <CalendarPlus className="w-4 h-4 text-blue-500" />
                <span>Book Resource</span>
              </button>
              <button 
                onClick={() => { setIsOpen(false); navigate('/maintenance'); }} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg cursor-pointer text-left"
              >
                <Wrench className="w-4 h-4 text-orange-500" />
                <span>Raise Maintenance</span>
              </button>
              <button 
                onClick={() => { setIsOpen(false); navigate('/requests'); }} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg cursor-pointer text-left"
              >
                <FilePlus2 className="w-4 h-4 text-green-500" />
                <span>Request Asset</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProfileDropdown({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2.5 outline-none cursor-pointer group"
      >
        <div className="text-right hidden md:block">
          <p className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">{profile.name}</p>
          <p className="text-[10px] text-muted-foreground">{profile.designation}</p>
        </div>
        <Avatar className="h-9 w-9 border-2 border-primary/10 group-hover:border-primary/30 transition-all">
          <AvatarImage src={profile.avatar} />
          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-card border shadow-lg focus:outline-none z-50 overflow-hidden">
            <div className="p-3 border-b bg-muted/30">
              <p className="text-sm font-semibold text-foreground">{profile.name}</p>
              <p className="text-xs text-muted-foreground text-ellipsis overflow-hidden">{profile.email}</p>
              <div className="mt-1.5 inline-block text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                {profile.role}
              </div>
            </div>
            <div className="p-1">
              <button 
                onClick={() => { setIsOpen(false); navigate('/profile'); }} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span>My Profile</span>
              </button>
              <button 
                onClick={() => { setIsOpen(false); navigate('/settings'); }} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg cursor-pointer text-left"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
              </button>
              <div className="h-px bg-border my-1" />
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive rounded-lg cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Navbar({ toggleTheme, isDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const { notificationsList } = useStore();
  const authUser = JSON.parse(localStorage.getItem('user') || 'null');
  const storeProfile = useStore(state => state.profile);
  const profile = authUser ? {
    name: `${authUser.first_name} ${authUser.last_name}`,
    email: authUser.email,
    role: (authUser.roles && authUser.roles[0]) || 'Employee',
    designation: authUser.designation_name || 'Staff',
    avatar: authUser.profile_image || ''
  } : storeProfile;

  const unreadCount = notificationsList.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 w-1/3">
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

      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden md:flex w-48 lg:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets, bookings..."
            className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1 rounded-xl"
          />
        </div>

        {/* Quick Actions Dropdown */}
        <QuickActionsDropdown />

        {/* Notification Bell */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 cursor-pointer hover:bg-accent rounded-xl"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white border-2 border-background animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Dark Mode Toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer hover:bg-accent rounded-xl" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="pl-2 border-l">
          <ProfileDropdown profile={profile} />
        </div>
      </div>
    </header>
  );
}
