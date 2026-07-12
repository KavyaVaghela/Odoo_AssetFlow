import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, Users, Calendar, CheckCircle2, Clock, Car, Layers, Compass, PlusCircle, HelpCircle, Loader2, AlertCircle, Shield } from 'lucide-react';
import api from '../../services/api';

export default function DepartmentResources() {
  const [resources, setResources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Quick Book Form state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTitle, setBookingTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResponse, empResponse] = await Promise.all([
          api.get('/api/hod/resources'),
          api.get('/api/hod/employees')
        ]);
        
        if (resResponse.data.success) {
          setResources(resResponse.data.data);
        }
        
        if (empResponse.data.success) {
          setEmployees(empResponse.data.data);
          if (empResponse.data.data.length > 0) {
            setSelectedEmployeeId(empResponse.data.data[0].id.toString());
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterCategories = ['All', 'Meeting Room', 'Conference Room', 'Vehicle', 'Projector', 'Laboratory', 'Equipment'];

  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => r.resource_type === selectedCategory);

  const handleOpenBook = (resource) => {
    setSelectedResource(resource);
    setIsBookModalOpen(true);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setStartTime('10:00');
    setEndTime('11:00');
    setBookingTitle('');
    setPurpose('');
    setIsSuccess(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTitle.trim()) return;

    try {
      // Create a calendar event or resource booking directly via HOD API
      // We will assume POST /api/hod/calendar handles this for HOD booking on behalf of employee
      await api.post('/api/hod/calendar', {
        resource_id: selectedResource.id,
        booking_title: bookingTitle,
        purpose: purpose,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsBookModalOpen(false);
        setIsSuccess(false);
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Meeting Room':
      case 'Conference Room': return Users;
      case 'Vehicle': return Car;
      case 'Laboratory': return Layers;
      case 'Projector':
      case 'Equipment': return Compass;
      default: return Grid;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Department Resources</h1>
          <p className="text-muted-foreground">Monitor availability lists, check active bookings, or book resources on behalf of staff members.</p>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 border border-dashed rounded-xl">
              No resources found for the selected category.
            </div>
          ) : (
            filteredResources.map((res) => {
              const ResIcon = getIconForType(res.resource_type);
              return (
                <Card key={res.id} className="overflow-hidden border border-border/50 rounded-2xl glass hover:shadow-md transition-shadow">
                  <CardHeader className="p-4.5 flex flex-row items-start justify-between space-y-0 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/5 text-primary rounded-xl shrink-0">
                        <ResIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground" title={res.resource_name}>{res.resource_name}</h3>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">{res.resource_type} {res.capacity ? `• ${res.capacity} slots` : ''}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[9px] uppercase font-bold py-0.5 border ${
                      res.status === 'Available' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                      'bg-orange-500/10 text-orange-600 border-orange-500/20'
                    }`}>
                      {res.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4.5 pt-0">
                    <div className="mb-4 bg-background/50 rounded-lg p-3 border border-border/50 text-xs">
                      <div className="flex items-start gap-2 text-muted-foreground mb-1">
                        <span className="font-semibold text-foreground">Location:</span> {res.location || 'N/A'}
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <span className="font-semibold text-foreground">Description:</span> {res.description || 'No description available'}
                      </div>
                    </div>

                    <Button 
                      className="w-full h-8 text-[10px] font-bold rounded-lg cursor-pointer"
                      onClick={() => handleOpenBook(res)}
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Book on behalf
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Book on Behalf Modal */}
      <Dialog open={isBookModalOpen} onOpenChange={(open) => !isSuccess && setIsBookModalOpen(open)}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl">
          <AnimatePresence>
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="p-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Booking Confirmed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedResource?.resource_name} has been booked.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogHeader className="p-6 bg-muted/30 border-b">
                  <DialogTitle>Book Resource (Admin Override)</DialogTitle>
                  <DialogDescription className="text-xs">
                    Create an immediate booking for <strong className="text-foreground">{selectedResource?.resource_name}</strong>.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Assign To (Staff Member)</label>
                    <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                      <SelectTrigger className="h-9.5 text-xs rounded-xl bg-background border-border/50">
                        <SelectValue placeholder="Select Staff Member" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.first_name} {emp.last_name} ({emp.employee_code || `EMP-${emp.id}`})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Booking Title</label>
                    <Input 
                      required
                      placeholder="e.g. Department Meeting"
                      value={bookingTitle}
                      onChange={(e) => setBookingTitle(e.target.value)}
                      className="h-9.5 text-xs rounded-xl border-border/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Date</label>
                      <Input 
                        type="date" 
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="h-9.5 text-xs rounded-xl border-border/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-between">
                        Start Time
                      </label>
                      <Input
                        type="time"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="h-9.5 text-xs rounded-xl border-border/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-start-2 space-y-1">
                       <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-between">
                        End Time
                      </label>
                      <Input
                        type="time"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="h-9.5 text-xs rounded-xl border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Purpose (Optional)</label>
                    <Input 
                      placeholder="Brief description for the log"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="h-9.5 text-xs rounded-xl border-border/50"
                    />
                  </div>

                  <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsBookModalOpen(false)} className="rounded-xl text-xs h-9.5">
                      Cancel
                    </Button>
                    <Button type="submit" className="rounded-xl text-xs font-bold h-9.5">
                      Confirm Booking
                    </Button>
                  </DialogFooter>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
