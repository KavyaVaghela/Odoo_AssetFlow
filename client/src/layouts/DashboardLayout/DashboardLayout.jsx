import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Navbar } from '@/components/navbar/Navbar';
import { AIAssistant } from '@/components/ai/AIAssistant';

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className={`flex h-screen w-full bg-background text-foreground ${isDark ? 'dark' : ''} overflow-hidden font-sans`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar toggleTheme={toggleTheme} isDark={isDark} />
        
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
        
        {/* Floating AI Assistant for all employee pages */}
        <AIAssistant />
      </div>
    </div>
  );
}
