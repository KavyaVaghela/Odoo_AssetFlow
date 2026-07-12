import React, { useState } from 'react';
<<<<<<< HEAD
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
=======
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, PlusCircle, Calendar, CheckCircle2, User, HelpCircle, HardDrive, Cpu, ShieldAlert, Award } from 'lucide-react';

export default function MyRequests() {
  const { myRequests, addAssetRequest } = useStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [requestType, setRequestType] = useState('New Asset');
  const [itemName, setItemName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [justification, setJustification] = useState('');

  const handleOpenDetails = (req) => {
    setSelectedRequest(req);
    setIsDetailsOpen(true);
  };

  const handleOpenNewRequest = () => {
    setRequestType('New Asset');
    setItemName('');
    setPriority('Medium');
    setJustification('');
    setIsSuccess(false);
    setIsNewRequestOpen(true);
  };

  const handleNewRequestSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !justification.trim()) return;

    addAssetRequest({
      requestType: requestType,
      item: itemName,
      priority: priority,
      justification: justification,
      assignedTo: requestType === 'Software License' ? 'IT Support Team' : 'Operations Dept'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsNewRequestOpen(false);
      setIsSuccess(false);
    }, 1500);
  };

  const getRequestIcon = (type) => {
    switch (type) {
      case 'Software License':
        return Award;
      case 'New Asset':
        return Cpu;
      default:
        return HardDrive;
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">My Requests</h1>
          <p className="text-muted-foreground">Request software licenses, temporary hardware resources, or new office equipment.</p>
        </div>
        <Button 
          onClick={handleOpenNewRequest}
          className="bg-primary hover:bg-blue-700 text-white rounded-xl gap-1.5 shadow-md cursor-pointer text-xs h-10"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Request Resource
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myRequests.map((req, index) => {
          const ReqIcon = getRequestIcon(req.requestType);
          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-shadow rounded-2xl glass">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/5 text-primary rounded-xl shrink-0">
                      <ReqIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <Badge className="bg-muted/60 text-muted-foreground hover:bg-muted text-[8px] uppercase tracking-wider py-0 rounded-full font-bold">
                        {req.requestType}
                      </Badge>
                      <h3 className="font-bold text-sm text-foreground truncate max-w-[150px] mt-0.5">{req.item}</h3>
                    </div>
                  </div>
                  <Badge 
                    className={`rounded-full text-[9px] font-bold py-0.5 px-2 uppercase border ${
                      req.status === 'Approved' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}
                  >
                    {req.status}
                  </Badge>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="text-[11px] text-muted-foreground space-y-1 py-2 border-y border-border/50">
                    <div className="flex justify-between">
                      <span>Submitted Date</span>
                      <span className="font-semibold text-foreground">{req.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assigned Department</span>
                      <span className="font-semibold text-foreground">{req.assignedTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgency Priority</span>
                      <span className={`font-semibold ${
                        req.priority === 'High' ? 'text-red-500 font-bold' : 'text-foreground'
                      }`}>{req.priority}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenDetails(req)}
                      className="w-full text-xs rounded-xl cursor-pointer"
                    >
                      View Full Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Request Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="text-primary w-5 h-5" />
              Resource Request Specifications
            </DialogTitle>
            <DialogDescription>Full summary audit logs of the resource ticket request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-3 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Request ID</span>
                <span className="font-mono font-bold">{selectedRequest.id}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Requested Resource</span>
                <span className="font-semibold">{selectedRequest.item}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Type Category</span>
                <span className="font-semibold">{selectedRequest.requestType}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Priority Rating</span>
                <span className="font-semibold">{selectedRequest.priority}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Assigned Team</span>
                <span className="font-semibold">{selectedRequest.assignedTo}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Submitted Date</span>
                <span>{selectedRequest.date}</span>
              </div>
              {selectedRequest.justification && (
                <div className="flex flex-col gap-1 border-b pb-2">
                  <span className="text-muted-foreground">Stated Business Justification</span>
                  <span className="italic bg-muted/40 p-2.5 rounded-lg text-xs">"{selectedRequest.justification}"</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ticket Status</span>
                <Badge 
                  className={`rounded-full text-[9px] uppercase border ${
                    selectedRequest.status === 'Approved' 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  }`}
                >
                  {selectedRequest.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="rounded-xl w-full" onClick={() => setIsDetailsOpen(false)}>Close Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Asset Request Dialog */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <PlusCircle className="w-5 h-5" />
              Request Hardware / License
            </DialogTitle>
            <DialogDescription>Submit requests for new equipment or workspace tools required for your assignments.</DialogDescription>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                onSubmit={handleNewRequestSubmit} 
                className="space-y-4"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Request Category</label>
                  <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger className="rounded-xl focus-visible:ring-primary">
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="New Asset">Hardware Equipment (Monitor, mouse, keys, etc.)</SelectItem>
                      <SelectItem value="Software License">Software License (WebStorm, Adobe Suite, Jira, etc.)</SelectItem>
                      <SelectItem value="Office Supplies">Workspace Ergonomics / Office Supplies</SelectItem>
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
                    </SelectContent>
                  </Select>
                </div>

<<<<<<< HEAD
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

=======
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Item / License Name</label>
                  <Input
                    required
                    placeholder="e.g. Noise-Cancelling Headphones, Figma Professional License"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Business Justification</label>
                  <textarea
                    required
                    placeholder="State clearly why you require this resource for your daily projects."
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Priority Urgency</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="rounded-xl focus-visible:ring-primary">
                      <SelectValue placeholder="Select urgency priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Low">Low - Needed for future convenience</SelectItem>
                      <SelectItem value="Medium">Medium - Disturbs performance level</SelectItem>
                      <SelectItem value="High">High - Blocker for assignment completion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsNewRequestOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-blue-700 text-white rounded-xl">Submit Request</Button>
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
                <h3 className="font-bold text-lg text-foreground text-center">Resource Request Logged</h3>
                <p className="text-xs text-muted-foreground text-center max-w-xs">Your request was logged successfully. It has been routed to your department head for budget verification.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
    </div>
  );
}
