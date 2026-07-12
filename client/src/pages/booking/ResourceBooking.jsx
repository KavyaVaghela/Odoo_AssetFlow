import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Users, CheckCircle, Clock, Video, Car, Layers, Compass, HelpCircle } from 'lucide-react';

const mockResources = [
  { id: 'res-1', name: 'Meeting Room A', category: 'Rooms', capacity: '8 People', icon: Users, status: 'Available', specs: '55" TV, Whiteboard, Jabra Speaker' },
  { id: 'res-2', name: 'Boardroom Prime', category: 'Rooms', capacity: '18 People', icon: Video, status: 'Occupied', specs: 'Polycom Video System, Dual 75" screens' },
  { id: 'res-3', name: 'Projector 2', category: 'Equipment', capacity: 'N/A', icon: Compass, status: 'Available', specs: 'Epson 4K Ultra-Short Throw' },
  { id: 'res-4', name: 'Honda Civic (Vehicle)', category: 'Vehicles', capacity: '5 Seats', icon: Car, status: 'Available', specs: 'Fuel card, Toll pass' },
  { id: 'res-5', name: 'Tesla Model 3', category: 'Vehicles', capacity: '5 Seats', icon: Car, status: 'Occupied', specs: 'Auto-pilot, Supercharger card' },
  { id: 'res-6', name: 'IoT Research Lab', category: 'Laboratories', capacity: '12 Slots', icon: Layers, status: 'Available', specs: 'Oscilloscopes, Soldering stations, RF Shield' },
];

export default function ResourceBooking() {
  const { bookings, addBooking } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 - 11:00');
  const [purpose, setPurpose] = useState('');

  const filterCategories = ['All', 'Rooms', 'Vehicles', 'Equipment', 'Laboratories'];

  const filteredResources = selectedCategory === 'All'
    ? mockResources
    : mockResources.filter(r => r.category === selectedCategory);

  const handleOpenBook = (resource) => {
    setSelectedResource(resource);
    setIsBookModalOpen(true);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setBookingTime('10:00 - 11:00');
    setPurpose('');
    setIsSuccess(false);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate || !purpose.trim()) return;

    addBooking({
      resource: selectedResource.name,
      date: bookingDate,
      time: bookingTime,
      purpose: purpose,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsBookModalOpen(false);
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Resource Booking</h1>
          <p className="text-muted-foreground">Reserve meeting rooms, vehicles, lab space, or technical equipment instantly.</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {filterCategories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className="rounded-full px-5 py-1.5 h-auto text-xs font-semibold cursor-pointer"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Resources Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredResources.map((res) => {
              const ResIcon = res.icon || HelpCircle;
              return (
                <Card key={res.id} className="overflow-hidden border border-border/50 rounded-2xl glass hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                        <ResIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{res.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">{res.category} • {res.capacity}</p>
                      </div>
                    </div>
                    <Badge 
                      className={`rounded-full text-[9px] font-bold ${
                        res.status === 'Available' 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      {res.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-1 italic">{res.specs}</p>
                    <Button 
                      onClick={() => handleOpenBook(res)}
                      disabled={res.status === 'Occupied'}
                      className="w-full text-xs rounded-xl h-8.5 bg-primary hover:bg-blue-700 text-white cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Simple Visual Mock Calendar Grid */}
          <Card className="rounded-2xl border-border/50 glass">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Resource Scheduler View
              </CardTitle>
              <CardDescription className="text-xs">Quick schedule map showing occupancy levels for this week.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="font-bold text-muted-foreground py-1">{day}</div>
                ))}
                {Array.from({ length: 14 }).map((_, idx) => {
                  const dayNum = idx + 10;
                  const isToday = dayNum === 12;
                  const hasBooking = dayNum === 12 || dayNum === 15 || dayNum === 20;
                  return (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border flex flex-col items-center justify-between aspect-square relative ${
                        isToday ? 'bg-primary text-white border-primary shadow-sm' : 'bg-muted/10 border-border/30'
                      }`}
                    >
                      <span className="font-semibold">{dayNum}</span>
                      {hasBooking && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-primary'} animate-pulse`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Upcoming Bookings Widget */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/50 glass">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                My Upcoming Bookings
              </CardTitle>
              <CardDescription className="text-xs">Your schedules active or pending confirmation.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No active bookings found.
                  </div>
                ) : (
                  bookings.map((b) => (
                    <div key={b.id} className="p-3 bg-muted/30 border border-border/55 rounded-xl text-xs space-y-2 hover:bg-muted/40 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">{b.resource}</span>
                        <Badge 
                          className={`text-[8px] font-bold py-0 rounded-full px-1.5 border ${
                            b.status === 'Confirmed' 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}
                        >
                          {b.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground space-y-0.5">
                        <p>🗓️ {b.date}</p>
                        <p>⏰ {b.time}</p>
                        <p className="line-clamp-1 italic mt-1 text-[11px] font-medium text-foreground">"{b.purpose}"</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Book Now Dialog */}
      <Dialog open={isBookModalOpen} onOpenChange={setIsBookModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <CalendarIcon className="w-5 h-5" />
              Book Resource Assignment
            </DialogTitle>
            <DialogDescription>
              Submit dates and details below to reserve resource access.
            </DialogDescription>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                onSubmit={handleBookingSubmit} 
                className="space-y-4"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {selectedResource && (
                  <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between text-xs font-semibold border">
                    <div>
                      <span className="text-muted-foreground">Resource: </span>
                      <span>{selectedResource.name}</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary text-[9px] uppercase border-primary/20">
                      {selectedResource.category}
                    </Badge>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Select Reservation Date</label>
                  <Input
                    required
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Time Slot / Duration</label>
                  <Input
                    required
                    placeholder="e.g. 14:00 - 15:00, Full Day (09:00 - 17:00)"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Booking Purpose</label>
                  <textarea
                    required
                    placeholder="e.g. Sprint Planning, Project Review with Client, Field Survey Work"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-blue-700 text-white rounded-xl">Reserve Resource</Button>
                </DialogFooter>
              </motion.form>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-8 space-y-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 border border-emerald-500/20">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-foreground text-center">Reservation Request Submitted</h3>
                <p className="text-xs text-muted-foreground text-center max-w-xs">Your booking has been added to state and is marked as 'Pending' verification.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
