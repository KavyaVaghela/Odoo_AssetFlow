import React, { useState } from 'react';
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
    }
  };

  return (
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
                    </SelectContent>
                  </Select>
                </div>

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
    </div>
  );
}
