import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CheckCheck, Trash2, MailOpen, Mail, Search, Wrench, 
  Calendar, ShieldAlert, Package, Inbox
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';

export default function NotificationCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useStore();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Maintenance", "Booking", "Asset", "Audit"];

  const filteredNotifications = notifications.filter((n) => {
    const matchesCategory = activeCategory === "All" || n.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "maintenance": return <Wrench size={14} className="text-amber-500" />;
      case "booking": return <Calendar size={14} className="text-rose-500" />;
      case "audit": return <ShieldAlert size={14} className="text-cyan-500" />;
      default: return <Package size={14} className="text-blue-500" />;
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">Keep track of asset allocation reviews, maintenance logs, and scheduling triggers.</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button 
              onClick={markAllNotificationsRead} 
              variant="outline" 
              size="sm" 
              className="h-9 gap-1.5 text-xs font-semibold border-border"
            >
              <CheckCheck size={14} />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters Card */}
      <Card className="glass border-border/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="h-8 rounded-full text-xs font-semibold px-4 shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="pl-9 h-9 border-border bg-background/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="glass border-border/50 p-2 overflow-hidden">
        <div className="divide-y divide-border/60">
          <AnimatePresence initial={false}>
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <Inbox size={32} className="text-muted-foreground/45 mb-2" />
                <p className="text-xs text-muted-foreground leading-relaxed">No new system notifications found.</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 flex gap-4 items-start hover:bg-muted/30 transition-colors relative group ${
                    !n.read ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  {/* Icon */}
                  <div className="p-2 rounded-xl bg-background border shrink-0">
                    {getCategoryIcon(n.category)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0" onClick={() => !n.read && markNotificationRead(n.id)}>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`text-sm leading-snug cursor-pointer ${
                        !n.read ? 'font-bold text-foreground' : 'font-semibold text-muted-foreground'
                      }`}>
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-medium shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{n.message}</p>
                    <div className="flex gap-2 items-center mt-2.5">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0">
                        {n.category}
                      </Badge>
                      {!n.read && (
                        <span className="text-[9px] font-bold text-primary flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block animate-pulse" />
                          Unread
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Single Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 self-center">
                    {!n.read ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg"
                        title="Mark as read"
                        onClick={() => markNotificationRead(n.id)}
                      >
                        <MailOpen size={14} />
                      </Button>
                    ) : (
                      <div className="h-8 w-8 flex items-center justify-center text-muted-foreground">
                        <Mail size={14} className="opacity-50" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                      title="Delete notification"
                      onClick={() => deleteNotification(n.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>

    </div>
  );
}
