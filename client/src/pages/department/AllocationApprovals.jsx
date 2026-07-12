import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Check, X, Eye, ShieldCheck, ClipboardCheck, Info, Loader2, AlertCircle, Calendar, Clock } from 'lucide-react';
import api from '../../services/api';

export default function AllocationApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchBookingRequests = async () => {
    try {
      const response = await api.get('/api/hod/booking-requests');
      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const handleApprove = async (id, resourceName) => {
    try {
      await api.put(`/api/hod/booking/${id}/approve`);
      setRequests(requests.filter(req => req.id !== id));
      setToastMessage(`Booking for ${resourceName} was approved successfully.`);
      setTimeout(() => setToastMessage(''), 3000);
      setIsDetailsOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id, resourceName) => {
    try {
      await api.put(`/api/hod/booking/${id}/reject`);
      setRequests(requests.filter(req => req.id !== id));
      setToastMessage(`Booking for ${resourceName} was rejected.`);
      setTimeout(() => setToastMessage(''), 3000);
      setIsDetailsOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  const handleOpenDetails = (req) => {
    setSelectedRequest(req);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6 relative animate-in fade-in zoom-in duration-500">
      {/* Dynamic inline Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#0F172A] text-white border border-slate-800 p-4 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Booking Approvals</h1>
        <p className="text-muted-foreground">Sign off or decline resource booking requests submitted by department staff.</p>
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
          {requests.length === 0 ? (
            <Card className="col-span-full border-dashed border-2 py-16 text-center glass flex flex-col items-center justify-center">
              <ClipboardCheck className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">All booking approvals are processed.</p>
              <p className="text-xs text-muted-foreground/70">No pending requests are in the queue.</p>
            </Card>
          ) : (
            requests.map((req, index) => (
              <motion.div
                key={req.id}
                layoutId={req.id.toString()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-shadow rounded-2xl glass h-full flex flex-col">
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] text-muted-foreground font-bold">REQ-{req.id}</span>
                      <h3 className="font-bold text-sm text-foreground">{req.first_name} {req.last_name}</h3>
                    </div>
                    <Badge 
                      className="rounded-full text-[8px] font-bold py-0.5 px-2 uppercase border bg-blue-500/10 text-blue-600 border-blue-500/20"
                    >
                      Pending
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-3.5 text-xs flex-1 flex flex-col">
                    <div>
                      <span className="text-muted-foreground">Requested Resource</span>
                      <p className="font-bold text-foreground truncate mt-0.5" title={req.resource_name}>{req.resource_name}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {req.booking_date ? new Date(req.booking_date).toLocaleDateString() : 'N/A'}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {req.start_time} - {req.end_time}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground bg-muted/40 p-2.5 rounded-xl line-clamp-2 italic">
                      "{req.purpose || req.booking_title}"
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 mt-auto">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDetails(req)} className="rounded-lg h-8 text-[10px] font-semibold w-1/3">
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Button>
                      <div className="flex gap-2 flex-1">
                        <Button variant="ghost" size="sm" onClick={() => handleReject(req.id, req.resource_name)} className="rounded-lg h-8 text-[10px] font-semibold flex-1 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                          <X className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(req.id, req.resource_name)} className="rounded-lg h-8 text-[10px] font-semibold flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                          <Check className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-6 bg-muted/30 border-b">
            <DialogTitle className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Booking Request</span>
              <span className="text-lg">REQ-{selectedRequest?.id}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submitted by <span className="font-semibold text-foreground">{selectedRequest?.first_name} {selectedRequest?.last_name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 bg-background p-3 rounded-xl border border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Resource</span>
                <p className="font-semibold">{selectedRequest?.resource_name}</p>
              </div>
              <div className="space-y-1 bg-background p-3 rounded-xl border border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Title</span>
                <p className="font-semibold">{selectedRequest?.booking_title}</p>
              </div>
              <div className="space-y-1 bg-background p-3 rounded-xl border border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Date</span>
                <p className="font-semibold">{selectedRequest?.booking_date ? new Date(selectedRequest.booking_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="space-y-1 bg-background p-3 rounded-xl border border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Time</span>
                <p className="font-semibold">{selectedRequest?.start_time} - {selectedRequest?.end_time}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Info className="w-3 h-3" /> Purpose
              </span>
              <div className="bg-muted/30 p-3 rounded-xl text-xs leading-relaxed border border-border/50">
                {selectedRequest?.purpose || 'No purpose specified.'}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-muted/10 gap-2 flex-col sm:flex-row">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="rounded-xl flex-1">
              Close
            </Button>
            <div className="flex gap-2 w-full sm:w-auto flex-1">
              <Button 
                variant="destructive" 
                onClick={() => handleReject(selectedRequest?.id, selectedRequest?.resource_name)} 
                className="rounded-xl flex-1 bg-red-500 hover:bg-red-600"
              >
                Reject Request
              </Button>
              <Button 
                onClick={() => handleApprove(selectedRequest?.id, selectedRequest?.resource_name)} 
                className="rounded-xl flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Approve Request
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
