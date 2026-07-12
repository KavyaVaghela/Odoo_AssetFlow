import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Plus, CheckCircle2, Clock, XCircle, Info, X, 
  AlertCircle, Send, ClipboardCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MyRequests() {
  const { requests, addAssetRequest } = useStore();

  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const [requestType, setRequestType] = useState("Asset Allocation Request");
  const [requestDetail, setRequestDetail] = useState("");
  const [requestJustification, setRequestJustification] = useState("");
  const [requestPriority, setRequestPriority] = useState("Medium");
  const [toastMessage, setToastMessage] = useState("");

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!requestDetail.trim() || !requestJustification.trim()) return;

    addAssetRequest({
      requestType,
      detail: requestDetail,
      justification: requestJustification,
      priority: requestPriority
    });

    setNewRequestOpen(false);
    setRequestDetail("");
    setRequestJustification("");
    setRequestPriority("Medium");

    setToastMessage("Asset request submitted successfully!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/25 text-xs font-semibold">{status}</Badge>;
      case "Rejected": return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/25 text-xs font-semibold">{status}</Badge>;
      default: return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/25 text-xs font-semibold">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      
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
          <h1 className="text-3xl font-bold tracking-tight">My Allocation Requests</h1>
          <p className="text-muted-foreground">Request new corporate assets, devices, workspace tools, or software licenses.</p>
        </div>
        <Button onClick={() => setNewRequestOpen(true)} className="h-9 gap-1.5 font-semibold text-sm">
          <Plus size={16} />
          Request Asset
        </Button>
      </div>

      {/* Requests Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {requests.map((req, index) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[210px]">
              <CardHeader className="p-4 flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <FileText size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1">{req.detail}</h3>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">{req.requestType}</span>
                  </div>
                </div>
                {getStatusBadge(req.status)}
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{req.justification}</p>
                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground pt-1.5 border-t">
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>Submitted: {req.submittedDate}</span>
                  </div>
                  <Badge variant={req.priority === "High" ? "destructive" : "outline"} className="text-[9px] px-1.5 py-0 font-bold uppercase">
                    {req.priority}
                  </Badge>
                </div>
              </CardContent>
              <div className="px-4 pb-4 shrink-0 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs font-semibold gap-1.5 rounded-lg border-border"
                  onClick={() => setSelectedRequest(req)}
                >
                  <Info size={12} />
                  View Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dialog 1: Request Details */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-[460px] rounded-2xl glass border border-border/80 p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">Request Details</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">Reference ID: {selectedRequest.id}</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setSelectedRequest(null)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Request Type</span>
                  <span className="font-semibold text-foreground">{selectedRequest.requestType}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Item Requested</span>
                  <span className="font-semibold text-foreground">{selectedRequest.detail}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Submitted Date</span>
                  <span className="font-semibold text-foreground">{selectedRequest.submittedDate}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Priority</span>
                  <Badge variant={selectedRequest.priority === "High" ? "destructive" : "secondary"} className="text-[9px] px-1.5 py-0 font-bold uppercase">
                    {selectedRequest.priority}
                  </Badge>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Current Status</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Business Justification</label>
                <p className="text-xs text-foreground leading-relaxed p-3 bg-muted/40 rounded-lg border">
                  {selectedRequest.justification}
                </p>
              </div>

              {selectedRequest.status === "Pending Approval" && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl flex gap-2 items-start text-xs leading-relaxed">
                  <Clock size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Your request is in the approval queue. Review will be completed by your Department Head (John Doe) and Asset Managers shortly.
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-muted/30 border-t flex justify-end shrink-0">
              <Button size="sm" onClick={() => setSelectedRequest(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog 2: New Request Form */}
      {newRequestOpen && (
        <Dialog open={newRequestOpen} onOpenChange={() => setNewRequestOpen(false)}>
          <DialogContent className="sm:max-w-[460px] rounded-2xl glass border border-border/80 p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">Request Corporate Asset</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">Submit allocation ticket for reviews</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setNewRequestOpen(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleCreateRequest}>
              <div className="p-6 space-y-4">
                {/* Select Request Type */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Request Type</label>
                  <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger className="w-full rounded-lg border-border">
                      <SelectValue placeholder="Choose request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asset Allocation Request">Asset Allocation Request (Hardware)</SelectItem>
                      <SelectItem value="Software License Allocation">Software License Allocation (Digital/Keys)</SelectItem>
                      <SelectItem value="Workspace Equipment request">Workspace Equipment Request (Furniture/Other)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Item Details */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Item Requested</label>
                  <Input 
                    required 
                    placeholder="e.g. Sony WH-1000XM4 Headphones or WebStorm License" 
                    value={requestDetail}
                    onChange={(e) => setRequestDetail(e.target.value)}
                    className="rounded-lg border-border"
                  />
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Priority Level</label>
                  <Select value={requestPriority} onValueChange={setRequestPriority}>
                    <SelectTrigger className="w-full rounded-lg border-border">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low (Upgrade or nice-to-have items)</SelectItem>
                      <SelectItem value="Medium">Medium (General developer tools, slight bottleneck)</SelectItem>
                      <SelectItem value="High">High (Immediate work-blocker, replacement required)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Justification Description */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Business Justification</label>
                  <Textarea
                    required
                    value={requestJustification}
                    onChange={(e) => setRequestJustification(e.target.value)}
                    placeholder="Provide description of how this asset will assist your work..."
                    className="min-h-[100px] rounded-lg border-border focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl flex gap-2.5 items-start text-xs leading-relaxed">
                  <ClipboardCheck size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Guidelines: High-priority requests require managers to verify bottlenecks before asset dispatch.
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t flex justify-end gap-2 shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={() => setNewRequestOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold gap-1">
                  <Send size={12} />
                  Submit Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
