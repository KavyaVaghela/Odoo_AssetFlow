import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, Users, Calendar, CheckCircle2, Clock, Car, Layers, Compass, PlusCircle, HelpCircle } from 'lucide-react';

const mockDepartmentResources = [
  { id: 'dep-res-1', name: 'Seminar Hall CE', category: 'Rooms', capacity: '120 People', icon: Users, status: 'Available', specs: 'Pro Audio System, Dual Projectors' },
  { id: 'dep-res-2', name: 'Meeting Room A', category: 'Rooms', capacity: '8 People', icon: Users, status: 'Occupied', currentHolder: 'Priya Patel (14:00 - 15:00)', specs: 'Interactive smart screen' },
  { id: 'dep-res-3', name: 'IoT Research Lab', category: 'Laboratories', capacity: '12 slots', icon: Layers, status: 'Available', specs: 'Raspberry Pi / Arduino kits' },
  { id: 'dep-res-4', name: 'Cisco Networking Lab', category: 'Laboratories', capacity: '20 slots', icon: Layers, status: 'Occupied', currentHolder: 'Rohan Mehta (10:00 - 13:00)', specs: 'Catalyst switches & routers' },
  { id: 'dep-res-5', name: 'Epson 4K Projector', category: 'Equipment', capacity: 'N/A', icon: Compass, status: 'Available', specs: 'High-lumen portable unit' },
  { id: 'dep-res-6', name: 'Toyota Camry (Vehicle)', category: 'Vehicles', capacity: '5 seats', icon: Car, status: 'Occupied', currentHolder: 'Amit Sharma (Full Day)', specs: 'Auto transmission, fuel card' },
];

export default function DepartmentResources() {
  const { departmentEmployees } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Quick Book Form state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 - 11:00');
  const [purpose, setPurpose] = useState('');

  const filterCategories = ['All', 'Rooms', 'Vehicles', 'Equipment', 'Laboratories'];

  const filteredResources = selectedCategory === 'All'
    ? mockDepartmentResources
    : mockDepartmentResources.filter(r => r.category === selectedCategory);

  const handleOpenBook = (resource) => {
    setSelectedResource(resource);
    setIsBookModalOpen(true);
    if (departmentEmployees.length > 0) {
      setSelectedEmployeeId(departmentEmployees[0].id);
    }
    setBookingDate(new Date().toISOString().split('T')[0]);
    setBookingTime('10:00 - 11:00');
    setPurpose('');
    setIsSuccess(false);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate || !purpose.trim()) return;

    // Simulate booking addition
    setIsSuccess(true);
    setTimeout(() => {
      setIsBookModalOpen(false);
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((res) => {
          const ResIcon = res.icon || HelpCircle;
          return (
            <Card key={res.id} className="overflow-hidden border border-border/50 rounded-2xl glass hover:shadow-md transition-shadow">
              <CardHeader className="p-4.5 flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 text-primary rounded-xl shrink-0">
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
              <CardContent className="p-4.5 pt-0 space-y-4">
                <div className="text-xs space-y-1.5 bg-muted/40 p-2.5 rounded-xl border">
                  {res.status === 'Occupied' ? (
                    <div>
                      <span className="text-muted-foreground">Reserved By: </span>
                      <span className="font-semibold text-foreground">{res.currentHolder}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-muted-foreground">Scheduled Status: </span>
                      <span className="font-semibold text-emerald-600">No active bookings</span>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground italic truncate border-t pt-1 mt-1">Specs: {res.specs}</p>
                </div>

                <Button 
                  onClick={() => handleOpenBook(res)}
                  disabled={res.status === 'Occupied'}
                  className="w-full text-xs rounded-xl h-8.5 bg-primary hover:bg-blue-700 text-white cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                >
                  Quick Book
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Book Dialog */}
      <Dialog open={isBookModalOpen} onOpenChange={setIsBookModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Calendar className="w-5 h-5" />
              Quick Book Resource
            </DialogTitle>
            <DialogDescription>
              Reserve a resource slot immediately on behalf of your department staff.
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
                      <span className="text-muted-foreground">Selected Item: </span>
                      <span>{selectedResource.name}</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary text-[9px] uppercase border-primary/20">
                      {selectedResource.category}
                    </Badge>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Allocate To Employee</label>
                  <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                    <SelectTrigger className="rounded-xl focus-visible:ring-primary h-9.5 text-xs">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs">
                      {departmentEmployees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} ({emp.designation})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Allocation Date</label>
                  <Input
                    required
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Time / Duration Slot</label>
                  <Input
                    required
                    placeholder="e.g. 10:00 - 11:00, Full Day"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Stated Allocation Reason</label>
                  <textarea
                    required
                    placeholder="Provide details about the meeting session, lab course, or lab class requirements."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-xs border bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-blue-700 text-white rounded-xl">Book Resource</Button>
                </DialogFooter>
              </motion.form>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-8 space-y-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-foreground text-center">Resource Allocated Successfully</h3>
                <p className="text-xs text-muted-foreground text-center max-w-xs">The booking has been locked and a notification alert was sent to the assignee employee.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
