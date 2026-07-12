import React, { useState } from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Users, Building, Car, 
  Tv, FlaskConical, Camera, Plus, CheckCircle2, AlertCircle, X, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ResourceBooking() {
  const { resources, bookings, addBooking, cancelBooking } = useStore();

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const categories = ["All", "Meeting Rooms", "Conference Rooms", "Projectors", "Vehicles", "Laboratories", "Equipment"];

  const filteredResources = activeCategory === "All" 
    ? resources 
    : resources.filter(r => r.category === activeCategory);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Meeting Rooms": return <Building size={16} className="text-blue-500" />;
      case "Conference Rooms": return <Building size={16} className="text-emerald-500" />;
      case "Projectors": return <Tv size={16} className="text-amber-500" />;
      case "Vehicles": return <Car size={16} className="text-rose-500" />;
      case "Laboratories": return <FlaskConical size={16} className="text-indigo-500" />;
      default: return <Camera size={16} className="text-cyan-500" />;
    }
=======
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
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!bookingDate || !bookingStart || !bookingEnd || !bookingReason.trim()) return;

    addBooking({
      resourceName: selectedResource.name,
      resourceCategory: selectedResource.category,
      date: bookingDate,
      timeStart: bookingStart,
      timeEnd: bookingEnd,
      reason: bookingReason
    });

    setSelectedResource(null);
    setBookingDate("");
    setBookingStart("");
    setBookingEnd("");
    setBookingReason("");

    setToastMessage("Booking submitted and auto-approved!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  const activeEmployeeBookings = bookings.filter(b => b.status !== "Canceled");

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500 animate-in slide-in-from-bottom-6 duration-300">
          <CheckCircle2 size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Booking Center</h1>
          <p className="text-muted-foreground">Reserve meeting rooms, vehicles, lab equipment, or presenting devices.</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? "default" : "outline"}
            className="rounded-full px-4 h-9 font-semibold text-xs shrink-0"
=======
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
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
          >
            {cat}
          </Button>
        ))}
      </div>

<<<<<<< HEAD
      {/* Main Grid split */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Bookable Resources List */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Available Resources ({filteredResources.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredResources.map((res) => (
              <Card key={res.id} className="glass border-border/50 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <CardHeader className="p-4 flex flex-row items-start justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      {getCategoryIcon(res.category)}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold truncate max-w-[180px]">{res.name}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">{res.category}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-bold">
                    {res.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-1.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-muted-foreground shrink-0" />
                    <span>{res.location}</span>
                  </div>
                  {res.capacity > 1 && (
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-muted-foreground shrink-0" />
                      <span>Capacity: up to {res.capacity} Pax</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 shrink-0">
                  <Button 
                    className="w-full h-8 text-xs font-semibold gap-1.5 rounded-lg"
                    onClick={() => setSelectedResource(res)}
                  >
                    <Plus size={12} />
                    Reserve Slot
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Active Bookings */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Your Active Reservations</h2>
          <div className="space-y-4">
            {activeEmployeeBookings.length === 0 ? (
              <Card className="glass border-border/50 p-6 text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">No active bookings found.</p>
              </Card>
            ) : (
              activeEmployeeBookings.map((b) => (
                <Card key={b.id} className="glass border-border/50 overflow-hidden">
                  <div className="bg-primary/5 p-3.5 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-white border shrink-0">
                        {getCategoryIcon(b.resourceCategory)}
                      </div>
                      <span className="font-bold text-xs text-foreground truncate max-w-[150px]">{b.resourceName}</span>
                    </div>
                    <Badge variant={b.status === "Approved" ? "default" : "secondary"} className="text-[9px] px-1.5 py-0 font-bold uppercase tracking-wider">
                      {b.status}
                    </Badge>
                  </div>
                  <CardContent className="p-3.5 text-xs text-muted-foreground space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      <span className="font-medium text-foreground">{b.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} />
                      <span className="font-medium text-foreground">{b.timeStart} - {b.timeEnd}</span>
                    </div>
                    <div className="p-2 rounded bg-muted/40 font-medium text-[10px] leading-relaxed">
                      Reason: {b.reason}
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs text-destructive hover:bg-destructive/10 rounded-md gap-1"
                        onClick={() => cancelBooking(b.id)}
                      >
                        <Trash2 size={12} />
                        Cancel Slot
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Booking Form Dialog */}
      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="sm:max-w-[460px] rounded-2xl glass border border-border/80 p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">Book Resource</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">Submit slot request details</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setSelectedResource(null)}>
                <X size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="p-6 space-y-4">
                {/* Selected Resource info */}
                <div className="p-3 rounded-lg border bg-muted/40 flex items-center gap-3">
                  <div className="p-1.5 bg-background border rounded">
                    {getCategoryIcon(selectedResource.category)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{selectedResource.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{selectedResource.location}</div>
                  </div>
                </div>

                {/* Booking Date */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Date</label>
                  <Input 
                    type="date" 
                    required 
                    value={bookingDate} 
                    onChange={(e) => setBookingDate(e.target.value)} 
                    className="rounded-lg border-border"
                  />
                </div>

                {/* Date range grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Start Time</label>
                    <Input 
                      type="text" 
                      required 
                      placeholder="e.g. 10:00 AM" 
                      value={bookingStart} 
                      onChange={(e) => setBookingStart(e.target.value)} 
                      className="rounded-lg border-border"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">End Time</label>
                    <Input 
                      type="text" 
                      required 
                      placeholder="e.g. 11:30 AM" 
                      value={bookingEnd} 
                      onChange={(e) => setBookingEnd(e.target.value)} 
                      className="rounded-lg border-border"
                    />
                  </div>
                </div>

                {/* Booking Reason */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Purpose / Reason</label>
                  <Input 
                    type="text" 
                    required 
                    placeholder="e.g. Customer Demo or Sprint Sync" 
                    value={bookingReason} 
                    onChange={(e) => setBookingReason(e.target.value)} 
                    className="rounded-lg border-border"
                  />
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl flex gap-2 items-start text-xs leading-relaxed">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>
                    Note: Your reservation is automatically approved for availability in slots. Violating double booking overlaps will prompt alerts.
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t flex justify-end gap-2 shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedResource(null)}>Cancel</Button>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">Reserve Resource</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

=======
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
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
    </div>
  );
}
