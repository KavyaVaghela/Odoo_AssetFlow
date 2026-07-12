import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Check, X, Eye, ShieldCheck, ClipboardCheck, Info } from 'lucide-react';

export default function AllocationApprovals() {
  const { allocationApprovals, approveAllocation, rejectAllocation } = useStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleApprove = (id, assetName) => {
    approveAllocation(id);
    setToastMessage(`Request for ${assetName} was approved successfully.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleReject = (id, assetName) => {
    rejectAllocation(id);
    setToastMessage(`Request for ${assetName} was rejected.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenDetails = (req) => {
    setSelectedRequest(req);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6 relative">
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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Allocation Approvals</h1>
        <p className="text-muted-foreground">Sign off or decline hardware allocation requests submitted by department faculty and scholars.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allocationApprovals.length === 0 ? (
          <Card className="col-span-full border-dashed border-2 py-16 text-center glass flex flex-col items-center justify-center">
            <ClipboardCheck className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">All allocation approvals are processed.</p>
            <p className="text-xs text-muted-foreground/70">No pending requests are in the catalog queue.</p>
          </Card>
        ) : (
          allocationApprovals.map((req, index) => (
            <motion.div
              key={req.id}
              layoutId={req.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-shadow rounded-2xl glass">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-muted-foreground font-bold">{req.id}</span>
                    <h3 className="font-bold text-sm text-foreground">{req.employeeName}</h3>
                  </div>
                  <Badge 
                    className={`rounded-full text-[8px] font-bold py-0.5 px-2 uppercase border ${
                      req.priority === 'High' 
                        ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                        : req.priority === 'Medium'
                        ? 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                        : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                    }`}
                  >
                    {req.priority} Priority
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3.5 text-xs">
                  <div>
                    <span className="text-muted-foreground">Requested Resource</span>
                    <p className="font-bold text-foreground truncate mt-0.5">{req.requestedAsset}</p>
                    <span className="text-[10px] text-muted-foreground block mt-1">Submitted on: {req.date}</span>
                  </div>

                  <p className="text-muted-foreground bg-muted/40 p-2.5 rounded-xl line-clamp-2 italic">
                    "{req.justification}"
                  </p>

                  <div className="flex gap-2 pt-1.5 border-t border-border/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenDetails(req)}
                      className="rounded-xl flex-1 text-xs cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 mr-1" />
                      Details
                    </Button>
                    <Button 
                      onClick={() => handleReject(req.id, req.requestedAsset)}
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl px-2.5 border-red-500/20 text-red-500 hover:bg-red-500/5 cursor-pointer"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleApprove(req.id, req.requestedAsset)}
                      size="sm" 
                      className="rounded-xl px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="text-primary w-5 h-5" />
              Allocation Request Audit Log
            </DialogTitle>
            <DialogDescription>Full description and profile metadata of the resource request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-3 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Request ID</span>
                <span className="font-mono font-bold">{selectedRequest.id}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Requesting Staff</span>
                <span className="font-semibold">{selectedRequest.employeeName}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Requested Asset</span>
                <span className="font-semibold text-primary">{selectedRequest.requestedAsset}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Request Date</span>
                <span>{selectedRequest.date}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Urgency Level</span>
                <Badge 
                  className={`rounded-full text-[9px] uppercase border ${
                    selectedRequest.priority === 'High' 
                      ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                      : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                  }`}
                >
                  {selectedRequest.priority} Priority
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground">Business Justification Statement</span>
                <p className="italic bg-muted/40 p-3 rounded-xl text-xs leading-relaxed text-foreground">
                  "{selectedRequest.justification}"
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-xl cursor-pointer"
              onClick={() => {
                if (selectedRequest) handleReject(selectedRequest.id, selectedRequest.requestedAsset);
                setIsDetailsOpen(false);
              }}
            >
              Reject Request
            </Button>
            <Button 
              type="button" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
              onClick={() => {
                if (selectedRequest) handleApprove(selectedRequest.id, selectedRequest.requestedAsset);
                setIsDetailsOpen(false);
              }}
            >
              Approve Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
