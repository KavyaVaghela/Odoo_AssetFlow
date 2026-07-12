import React, { useState } from 'react';
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
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
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
          >
            {cat}
          </Button>
        ))}
      </div>

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

    </div>
  );
}
