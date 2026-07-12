import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Users, Wrench, Megaphone, Video, ChevronLeft, ChevronRight } from 'lucide-react';

const mockCalendarEvents = [
  { id: 'ev-1', title: 'IoT Research Lab Booking', date: '2026-07-12', time: '10:00 - 13:00', type: 'Booking', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  { id: 'ev-2', title: 'Department Faculty Meeting', date: '2026-07-12', time: '14:00 - 15:30', type: 'Meeting', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  { id: 'ev-3', title: 'Dell Workstation Maintenance', date: '2026-07-14', time: '09:00 - 12:00', type: 'Maintenance', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  { id: 'ev-4', title: 'HOD Council Meeting', date: '2026-07-15', time: '11:00 - 12:30', type: 'Meeting', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  { id: 'ev-5', title: 'Seminar Hall: Guest Lecture', date: '2026-07-18', time: '14:00 - 17:00', type: 'Event', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  { id: 'ev-6', title: 'Physical Asset Verification', date: '2026-07-20', time: 'Full Day', type: 'Event', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
];

export default function DepartmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 12)); // July 2026
  const [filterType, setFilterType] = useState('All');
  const [selectedDayEvents, setSelectedDayEvents] = useState(
    mockCalendarEvents.filter(e => e.date === '2026-07-12')
  );
  const [selectedDay, setSelectedDay] = useState(12);

  const daysInMonth = 31;
  const startDayOffset = 2; // July 2026 starts on Wednesday (offset 2)

  const filteredEvents = filterType === 'All'
    ? mockCalendarEvents
    : mockCalendarEvents.filter(e => e.type === filterType);

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    const dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
    setSelectedDayEvents(mockCalendarEvents.filter(e => e.date === dateStr));
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'Booking':
        return Users;
      case 'Meeting':
        return Video;
      case 'Maintenance':
        return Wrench;
      default:
        return Megaphone;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Department Calendar</h1>
          <p className="text-muted-foreground">Monitor meetings, asset maintenance slots, and room bookings scheduled across the department.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Booking', 'Meeting', 'Maintenance', 'Event'].map((filter) => (
          <Button
            key={filter}
            onClick={() => setFilterType(filter)}
            variant={filterType === filter ? 'default' : 'outline'}
            className="rounded-full px-5 py-1.5 h-auto text-xs font-semibold cursor-pointer"
          >
            {filter}s
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left: Visual Calendar Grid */}
        <Card className="lg:col-span-8 rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-primary" />
                July 2026 Scheduler
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg cursor-pointer"><ChevronLeft size={16} /></Button>
              <span className="text-xs font-bold px-2">July 2026</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg cursor-pointer"><ChevronRight size={16} /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-muted-foreground py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* Offset slots */}
              {Array.from({ length: startDayOffset }).map((_, idx) => (
                <div key={`offset-${idx}`} className="p-4 rounded-xl border border-transparent" />
              ))}
              
              {/* Day slots */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isSelected = selectedDay === dayNum;
                const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                const dayEvents = filteredEvents.filter(e => e.date === dateStr);
                return (
                  <button 
                    key={dayNum} 
                    onClick={() => handleSelectDay(dayNum)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-between aspect-square relative hover:bg-accent/40 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-primary text-white border-primary shadow-md' : 'bg-muted/10 border-border/30'
                    }`}
                  >
                    <span className="font-bold text-xs">{dayNum}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-2 justify-center w-full">
                        {dayEvents.map(e => (
                          <span key={e.id} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right: Selected Day Events detail list */}
        <Card className="lg:col-span-4 rounded-2xl border-border/50 glass overflow-hidden flex flex-col h-full">
          <CardHeader className="p-4 border-b bg-muted/20">
            <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider">
              Agenda: July {selectedDay}, 2026
            </CardTitle>
            <CardDescription className="text-[10px]">Active items scheduled for this date.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex-1 space-y-4 overflow-y-auto">
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-16 text-xs text-muted-foreground">
                No events scheduled for this day.
              </div>
            ) : (
              selectedDayEvents.map((ev) => {
                const EvIcon = getEventIcon(ev.type);
                return (
                  <div key={ev.id} className={`p-3 border rounded-xl text-xs space-y-2 relative border-l-4 ${ev.color}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{ev.title}</span>
                      <Badge className="bg-background hover:bg-background/80 text-[8px] tracking-wide uppercase px-2 py-0 border">
                        {ev.type}
                      </Badge>
                    </div>
                    <div className="text-[10px] space-y-0.5 font-medium flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ev.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
