import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Inbox, Package, Calendar, Wrench, Megaphone, Trash2 } from 'lucide-react';

export default function NotificationsCenter() {
  const { notificationsList, markNotificationsRead } = useStore();
  const [filterTab, setFilterTab] = useState('All');

  const filteredNotifications = notificationsList.filter(n => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Unread') return !n.read;
    if (filterTab === 'Read') return n.read;
    if (filterTab === 'Announcements') return n.type === 'Announcement';
    if (filterTab === 'Updates') return n.type.includes('Update');
    return true;
  });

  const getNotificationIcon = (category) => {
    switch (category) {
      case 'asset':
        return Package;
      case 'booking':
        return Calendar;
      case 'maintenance':
        return Wrench;
      case 'announcement':
        return Megaphone;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (category) => {
    switch (category) {
      case 'asset':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'booking':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'maintenance':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'announcement':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Notification Center</h1>
          <p className="text-muted-foreground">Keep track of your asset dues, bookings approvals, maintenance reports, and system notices.</p>
        </div>
        <Button
          onClick={markNotificationsRead}
          variant="outline"
          size="sm"
          className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary gap-1.5 cursor-pointer text-xs h-9"
        >
          <Check className="w-4 h-4" />
          Mark All as Read
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Unread', 'Read', 'Announcements', 'Updates'].map((tab) => (
          <Button
            key={tab}
            onClick={() => setFilterTab(tab)}
            variant={filterTab === tab ? 'default' : 'outline'}
            className="rounded-full px-5 py-1.5 h-auto text-xs font-semibold cursor-pointer"
          >
            {tab}
          </Button>
        ))}
      </div>

      <Card className="rounded-2xl border-border/50 glass overflow-hidden">
        <CardContent className="p-0 divide-y divide-border/60">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
              <div className="p-4 bg-muted/40 rounded-full text-muted-foreground">
                <Inbox className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">No notifications in this folder.</p>
              <p className="text-xs text-muted-foreground/70">You are all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((n, idx) => {
              const NotifIcon = getNotificationIcon(n.category);
              const notifColors = getNotificationColor(n.category);
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  className={`p-4 flex gap-4 items-start hover:bg-muted/10 transition-colors relative ${
                    !n.read ? 'bg-primary/5 dark:bg-primary/5' : ''
                  }`}
                >
                  {/* Unread indicator */}
                  {!n.read && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}

                  <div className={`p-2.5 rounded-xl border shrink-0 ${notifColors}`}>
                    <NotifIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1 pr-6">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <h3 className={`text-sm ${!n.read ? 'font-bold' : 'font-semibold'} text-foreground`}>
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-medium">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pr-2">{n.message}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      <Badge className="bg-muted/65 text-muted-foreground border-none hover:bg-muted/65 text-[8px] py-0 rounded-full">
                        {n.type}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
