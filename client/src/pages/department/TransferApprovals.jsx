import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Check, X, ShieldCheck, UserMinus, UserPlus, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function TransferApprovals() {
  const { transferApprovals, approveTransfer, rejectTransfer } = useStore();
  const [toastMessage, setToastMessage] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleApprove = (id, assetName, nextHolder) => {
    approveTransfer(id);
    setToastMessage(`Transfer request for ${assetName} was approved. Owner updated to ${nextHolder}.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleReject = (id, assetName) => {
    rejectTransfer(id);
    setToastMessage(`Transfer request for ${assetName} was rejected.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenDetails = (transfer) => {
    setSelectedTransfer(transfer);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6 relative">
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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Transfer Approvals</h1>
        <p className="text-muted-foreground">Approve or reject inventory ownership handovers between department staff members.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {transferApprovals.length === 0 ? (
          <Card className="col-span-full border-dashed border-2 py-16 text-center glass flex flex-col items-center justify-center">
            <RefreshCw className="w-10 h-10 text-muted-foreground mb-3 animate-spin" style={{ animationDuration: '3s' }} />
            <p className="text-sm font-semibold text-muted-foreground">All ownership transfer requests have been processed.</p>
            <p className="text-xs text-muted-foreground/70">No pending handovers in queue.</p>
          </Card>
        ) : (
          transferApprovals.map((req, index) => (
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
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground font-bold">{req.id}</span>
                    <h3 className="font-bold text-sm text-foreground truncate max-w-[180px]">{req.asset.split('(')[0]}</h3>
                    <span className="font-mono text-[9px] text-muted-foreground font-semibold">
                      {req.asset.includes('(') ? req.asset.match(/\(([^)]+)\)/)[1] : ''}
                    </span>
                  </div>
                  <Badge className="bg-primary/5 text-primary text-[9px] hover:bg-primary/5 font-semibold py-0.5 border-primary/10">
                    Transfer
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-4 text-xs">
                  {/* Handoff path details */}
                  <div className="grid grid-cols-7 gap-1 items-center p-2.5 bg-muted/40 rounded-xl border text-[11px] font-medium text-center">
                    <div className="col-span-3">
                      <span className="text-[9px] text-muted-foreground block font-normal">Sender</span>
                      <span className="truncate text-foreground font-semibold block">{req.currentHolder}</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-center text-primary font-bold">
                      ➔
                    </div>
                    <div className="col-span-3">
                      <span className="text-[9px] text-muted-foreground block font-normal">Recipient</span>
                      <span className="truncate text-foreground font-semibold block">{req.requestedHolder}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold">Reason for Handover</span>
                    <p className="text-muted-foreground bg-muted/40 p-2.5 rounded-xl italic mt-1 leading-relaxed">
                      "{req.reason}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-border/50">
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
                      onClick={() => handleReject(req.id, req.asset)}
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl px-2.5 border-red-500/20 text-red-500 hover:bg-red-500/5 cursor-pointer"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleApprove(req.id, req.asset.split('(')[0].trim(), req.requestedHolder)}
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
              <RefreshCw className="text-primary w-5 h-5" />
              Ownership Transfer Audit Details
            </DialogTitle>
            <DialogDescription>Verify justification details for the hardware resource transfer.</DialogDescription>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-4 py-3 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Transfer ID</span>
                <span className="font-mono font-bold">{selectedTransfer.id}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Target Asset</span>
                <span className="font-semibold text-primary">{selectedTransfer.asset}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Current Owner (Sender)</span>
                <span className="font-semibold">{selectedTransfer.currentHolder}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Requested Owner (Recipient)</span>
                <span className="font-semibold">{selectedTransfer.requestedHolder}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Request Date</span>
                <span>{selectedTransfer.date}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground">Transfer Justification</span>
                <p className="italic bg-muted/40 p-3 rounded-xl text-xs leading-relaxed text-foreground">
                  "{selectedTransfer.reason}"
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
                if (selectedTransfer) handleReject(selectedTransfer.id, selectedTransfer.asset);
                setIsDetailsOpen(false);
              }}
            >
              Reject Transfer
            </Button>
            <Button 
              type="button" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
              onClick={() => {
                if (selectedTransfer) handleApprove(selectedTransfer.id, selectedTransfer.asset.split('(')[0].trim(), selectedTransfer.requestedHolder);
                setIsDetailsOpen(false);
              }}
            >
              Approve Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
