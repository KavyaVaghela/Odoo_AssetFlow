import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Navbar } from '@/components/navbar/Navbar';
<<<<<<< HEAD
import { AIAssistant } from '@/components/ai/AIAssistant';
=======
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
<<<<<<< HEAD
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
=======
    <div className="flex h-screen overflow-hidden bg-background">
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar toggleTheme={toggleTheme} isDark={isDark} />
        
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
<<<<<<< HEAD
        
        {/* Floating AI Assistant for all employee pages */}
        <AIAssistant />
=======
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
      </div>
    </div>
  );
}
