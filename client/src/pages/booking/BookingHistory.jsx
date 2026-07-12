import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Filter, CalendarCheck2, Download, ClipboardList } from 'lucide-react';

export default function BookingHistory() {
  const { bookings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.resource.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Booking ID,Resource,Date,Time,Purpose,Status"].join(",") + "\n"
      + bookings.map(b => `"${b.id}","${b.resource}","${b.date}","${b.time}","${b.purpose}","${b.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_booking_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Booking History</h1>
        <p className="text-muted-foreground">Review log files and schedules of your current, past, and pending resource bookings.</p>
      </div>

      <Card className="rounded-2xl border-border/50 glass overflow-hidden">
        <CardHeader className="p-5 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-primary" />
                Resource Reservation Directory
              </CardTitle>
              <CardDescription className="text-xs">Database audit log of your reservation records.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
                className="rounded-xl h-9 text-xs gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export Ledger
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources, purposes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9.5 rounded-xl border bg-background/50 focus-visible:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Confirmed', 'Pending'].map((filter) => (
                <Button
                  key={filter}
                  variant={statusFilter === filter ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(filter)}
                  className="rounded-xl h-9.5 text-xs font-semibold px-4 cursor-pointer"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border overflow-hidden bg-background/30 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold text-xs py-3 w-28">Booking ID</TableHead>
                  <TableHead className="font-semibold text-xs">Reserved Resource</TableHead>
                  <TableHead className="font-semibold text-xs w-32">Scheduled Date</TableHead>
                  <TableHead className="font-semibold text-xs w-36">Duration</TableHead>
                  <TableHead className="font-semibold text-xs hidden lg:table-cell">Purpose</TableHead>
                  <TableHead className="font-semibold text-xs w-28">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-right w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                      No matching reservation records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((b, index) => (
                    <TableRow key={b.id} className="hover:bg-muted/10">
                      <TableCell className="font-mono text-xs font-semibold">{b.id}</TableCell>
                      <TableCell className="font-semibold text-xs text-foreground">{b.resource}</TableCell>
                      <TableCell className="text-xs">{b.date}</TableCell>
                      <TableCell className="text-xs">{b.time}</TableCell>
                      <TableCell className="text-xs max-w-xs truncate hidden lg:table-cell italic">"{b.purpose}"</TableCell>
                      <TableCell>
                        <Badge 
                          className={`rounded-full text-[9px] font-bold py-0.5 px-2 uppercase border ${
                            b.status === 'Confirmed' 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}
                        >
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-lg cursor-pointer"
                          onClick={() => handleOpenDetails(b)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck2 className="text-primary w-5 h-5" />
              Reservation Record Receipt
            </DialogTitle>
            <DialogDescription>Full summary of the resource allocation request.</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-3 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-bold">{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Resource Assigned</span>
                <span className="font-semibold">{selectedBooking.resource}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Reservation Date</span>
                <span>{selectedBooking.date}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Allocated Hours</span>
                <span>{selectedBooking.time}</span>
              </div>
              <div className="flex flex-col gap-1 border-b pb-2">
                <span className="text-muted-foreground">Stated Purpose</span>
                <span className="italic bg-muted/40 p-2.5 rounded-lg text-xs">"{selectedBooking.purpose}"</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Audit Status</span>
                <Badge 
                  className={`rounded-full text-[9px] uppercase border ${
                    selectedBooking.status === 'Confirmed' 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  }`}
                >
                  {selectedBooking.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="rounded-xl w-full" onClick={() => setIsDetailsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
