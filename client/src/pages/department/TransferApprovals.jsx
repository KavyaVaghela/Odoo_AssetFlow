import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Check, X, ShieldCheck, Wrench, AlertTriangle, Info, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import api from '../../services/api';

export default function TransferApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchMaintenanceRequests = async () => {
    try {
      const response = await api.get('/api/hod/maintenance');
      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const handleApprove = async (id, assetName) => {
    try {
      await api.put(`/api/hod/maintenance/${id}/approve`);
      setRequests(requests.filter(req => req.id !== id));
      setToastMessage(`Maintenance request for ${assetName} was approved.`);
      setTimeout(() => setToastMessage(''), 3500);
      setIsDetailsOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id, assetName) => {
    try {
      await api.put(`/api/hod/maintenance/${id}/reject`);
      setRequests(requests.filter(req => req.id !== id));
      setToastMessage(`Maintenance request for ${assetName} was rejected.`);
      setTimeout(() => setToastMessage(''), 3500);
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
      {/* Dynamic Inline Toast Notification */}
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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Maintenance Approvals</h1>
        <p className="text-muted-foreground">Approve or reject equipment maintenance requests reported by department staff members.</p>
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
              <RefreshCw className="w-10 h-10 text-muted-foreground mb-3 animate-spin" style={{ animationDuration: '3s' }} />
              <p className="text-sm font-semibold text-muted-foreground">All maintenance requests have been processed.</p>
              <p className="text-xs text-muted-foreground/70">No pending issues in queue.</p>
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
                    <div>
                      <span className="font-mono text-[10px] text-muted-foreground font-bold">MNT-{req.id}</span>
                      <h3 className="font-bold text-sm text-foreground truncate max-w-[180px]" title={req.asset_name}>{req.asset_name}</h3>
                      <span className="font-mono text-[9px] text-muted-foreground font-semibold">
                        Asset ID: {req.asset_id}
                      </span>
                    </div>
                    <Badge className={`text-[9px] font-semibold py-0.5 uppercase border ${
                      req.priority === 'High' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                      req.priority === 'Medium' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                      'bg-blue-500/10 text-blue-600 border-blue-500/20'
                    }`}>
                      {req.priority}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-1 flex flex-col space-y-4 text-xs">
                    {/* Reporter details */}
                    <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-xl border">
                      <Wrench className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[9px] text-muted-foreground block font-normal">Reported By</span>
                        <span className="truncate text-foreground font-semibold block">{req.first_name} {req.last_name}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground block mb-1 font-semibold">Issue: {req.issue_title}</span>
                      <p className="text-muted-foreground line-clamp-2 bg-background p-2 rounded-lg border border-border/50">
                        {req.issue_description || 'No description provided.'}
                      </p>
                      <span className="text-[10px] text-muted-foreground mt-2 block flex items-center gap-1">
                         <AlertTriangle className="w-3 h-3"/> Requested on {new Date(req.requested_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto pt-3">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDetails(req)} className="w-full text-[10px] font-bold h-8 rounded-lg">
                        Details
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(req.id, req.asset_name)} className="w-full text-[10px] font-bold h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-6 bg-muted/30 border-b">
            <DialogTitle className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Maintenance Request</span>
              <span className="text-lg">MNT-{selectedRequest?.id}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review issue details for <span className="font-semibold text-foreground">{selectedRequest?.asset_name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-5 text-sm">
             <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 bg-background p-3 rounded-xl border border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Reporter</span>
                <p className="font-semibold truncate">{selectedRequest?.first_name} {selectedRequest?.last_name}</p>
              </div>
              <div className="space-y-1 bg-background p-3 rounded-xl border border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Priority</span>
                <p className="font-semibold">{selectedRequest?.priority}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Info className="w-3 h-3" /> Issue Description
              </span>
              <div className="bg-muted/30 p-3 rounded-xl text-xs leading-relaxed border border-border/50">
                <p className="font-semibold mb-1">{selectedRequest?.issue_title}</p>
                {selectedRequest?.issue_description || 'No description provided.'}
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 border-t bg-muted/10 gap-2 flex-col sm:flex-row">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="rounded-xl flex-1">
              Cancel
            </Button>
            <div className="flex gap-2 w-full sm:w-auto flex-1">
              <Button 
                variant="destructive" 
                onClick={() => handleReject(selectedRequest?.id, selectedRequest?.asset_name)} 
                className="rounded-xl flex-1 bg-red-500 hover:bg-red-600"
              >
                Reject Request
              </Button>
              <Button 
                onClick={() => handleApprove(selectedRequest?.id, selectedRequest?.asset_name)} 
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
