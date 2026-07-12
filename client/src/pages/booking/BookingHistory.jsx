import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, SlidersHorizontal, Trash2, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function BookingHistory() {
  const { bookings, cancelBooking } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-semibold">{status}</Badge>;
      case "Pending": return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs font-semibold">{status}</Badge>;
      default: return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-xs font-semibold">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking History</h1>
        <p className="text-muted-foreground">Comprehensive tracking of your resource bookings, schedules, and past usage.</p>
      </div>

      {/* Filters Bar */}
      <Card className="glass border-border/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resource name or purpose..."
              className="pl-9 h-9 border-border bg-background/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
            <Button
              variant={statusFilter === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("All")}
              className="h-9 rounded-lg text-xs font-semibold"
            >
              All Bookings
            </Button>
            <Button
              variant={statusFilter === "Approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Approved")}
              className="h-9 rounded-lg text-xs font-semibold"
            >
              Approved
            </Button>
            <Button
              variant={statusFilter === "Pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Pending")}
              className="h-9 rounded-lg text-xs font-semibold"
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "Canceled" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Canceled")}
              className="h-9 rounded-lg text-xs font-semibold"
            >
              Canceled
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table view */}
      <Card className="glass border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Reserved Date</TableHead>
              <TableHead>Time Slot</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs leading-relaxed">
                  No resource reservations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-muted-foreground">{b.id}</TableCell>
                  <TableCell className="font-semibold text-foreground text-sm">{b.resourceName}</TableCell>
                  <TableCell className="text-xs">{b.resourceCategory}</TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-muted-foreground" />
                      <span>{b.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock size={13} className="text-muted-foreground" />
                      <span>{b.timeStart} - {b.timeEnd}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs truncate max-w-[180px] font-medium">{b.reason}</TableCell>
                  <TableCell>{getStatusBadge(b.status)}</TableCell>
                  <TableCell className="text-right">
                    {b.status !== "Canceled" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                        title="Cancel reservation"
                        onClick={() => cancelBooking(b.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic mr-2">Inactive</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

    </div>
  );
}
