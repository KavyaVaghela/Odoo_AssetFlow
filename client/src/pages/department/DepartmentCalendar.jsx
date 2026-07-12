import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Users, Wrench, Megaphone, Video, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function DepartmentCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default to current date for the calendar visual
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [filterType, setFilterType] = useState('All');
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await api.get('/api/hod/calendar');
        if (response.data.success) {
          const fetchedEvents = response.data.data;
          setEvents(fetchedEvents);
          
          // Set initial selected day events
          const todayStr = new Date().toISOString().split('T')[0];
          setSelectedDayEvents(fetchedEvents.filter(e => e.date.startsWith(todayStr)));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  // Compute calendar grid variables
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Calculate offset for the first day of the month (0 = Sun, 1 = Mon, etc.)
  // Adjust so Monday is 0
  let startDayOffset = new Date(year, month, 1).getDay() - 1;
  if (startDayOffset === -1) startDayOffset = 6; // Sunday becomes 6

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const filteredEvents = filterType === 'All'
    ? events
    : events.filter(e => e.type === filterType);

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDayEvents(events.filter(e => e.date.startsWith(dateStr)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'Booking': return Users;
      case 'Meeting': return Video;
      case 'Maintenance': return Wrench;
      default: return Megaphone;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'Booking': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Meeting': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Maintenance': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Department Calendar</h1>
          <p className="text-muted-foreground">Monitor meetings, asset maintenance slots, and room bookings scheduled across the department.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Booking', 'Maintenance'].map((filter) => (
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

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col h-64 items-center justify-center text-red-500">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Visual Calendar Grid */}
          <Card className="lg:col-span-8 rounded-2xl border-border/50 glass">
            <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  {monthName} {year} Scheduler
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-lg cursor-pointer"><ChevronLeft size={16} /></Button>
                <span className="text-xs font-bold px-2">{monthName} {year}</span>
                <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-lg cursor-pointer"><ChevronRight size={16} /></Button>
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
                  const day = idx + 1;
                  const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  const dayEvents = filteredEvents.filter(e => e.date.startsWith(dateStr));
                  const isSelected = selectedDay === day;
                  
                  return (
                    <div
                      key={day}
                      onClick={() => handleSelectDay(day)}
                      className={`
                        p-2 min-h-24 rounded-xl border flex flex-col gap-1 transition-all cursor-pointer
                        ${isSelected ? 'bg-primary/10 border-primary shadow-sm' : 'bg-background hover:border-primary/50'}
                      `}
                    >
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isSelected ? 'bg-primary text-white' : 'text-foreground'}`}>
                        {day}
                      </span>
                      <div className="flex-1 space-y-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev, i) => (
                          <div key={i} className={`text-[9px] font-semibold p-1 truncate rounded ${getEventColor(ev.type)} border-l-2`}>
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-muted-foreground font-semibold pl-1">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right: Selected Day Events List */}
          <Card className="lg:col-span-4 rounded-2xl border-border/50 glass overflow-hidden flex flex-col">
            <CardHeader className="p-4 bg-muted/30 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                Events on {monthName} {selectedDay}, {year}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
              {selectedDayEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-3 py-10">
                  <CalendarIcon className="w-10 h-10 text-muted-foreground/30" />
                  <p className="text-sm font-semibold">No schedules for this day.</p>
                </div>
              ) : (
                selectedDayEvents.map((ev, index) => {
                  const Icon = getEventIcon(ev.type);
                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-background border rounded-xl flex gap-3 hover:shadow-sm transition-shadow group"
                    >
                      <div className="flex flex-col items-center justify-center w-12 shrink-0 border-r pr-3">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{ev.time.split(' - ')[0] || 'TBD'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-foreground truncate" title={ev.title}>{ev.title}</h4>
                        <div className="flex items-center justify-between mt-1.5">
                           <Badge variant="outline" className={`text-[8px] font-bold py-0 uppercase border ${getEventColor(ev.type)}`}>
                             {ev.type}
                           </Badge>
                           <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
