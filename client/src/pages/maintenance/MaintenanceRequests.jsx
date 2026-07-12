import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, ShieldAlert, AlertTriangle, Clock, Calendar, CheckCircle2, ListFilter, ClipboardPlus, PlusCircle } from 'lucide-react';

export default function MaintenanceRequests() {
  const { maintenanceRequests, employeeAssets, addMaintenanceRequest } = useStore();
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // New Request Form state
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [issueSummary, setIssueSummary] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [priority, setPriority] = useState('Medium');

  const tabs = ['All', 'Pending', 'In Progress', 'Completed'];

  const filteredRequests = selectedStatusTab === 'All'
    ? maintenanceRequests
    : maintenanceRequests.filter(r => r.status === selectedStatusTab);

  const handleOpenNewRequest = () => {
    if (employeeAssets.length > 0) {
      setSelectedAssetId(employeeAssets[0].id);
    }
    setIssueSummary('');
    setIssueDesc('');
    setPriority('Medium');
    setIsSuccess(false);
    setIsNewRequestOpen(true);
  };

  const handleNewRequestSubmit = (e) => {
    e.preventDefault();
    if (!issueSummary.trim() || !issueDesc.trim()) return;

    const assetObj = employeeAssets.find(a => a.id === selectedAssetId) || { name: 'Other Asset', code: 'N/A' };

    addMaintenanceRequest({
      assetName: assetObj.name,
      assetCode: assetObj.code,
      issue: issueSummary,
      description: issueDesc,
      priority: priority,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsNewRequestOpen(false);
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Maintenance Requests</h1>
          <p className="text-muted-foreground">Submit repair tickets and track the real-time resolution timeline of your hardware assets.</p>
        </div>
        <Button 
          onClick={handleOpenNewRequest}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl gap-1.5 shadow-md cursor-pointer text-xs h-10"
        >
          <PlusCircle className="w-4 h-4" />
          Raise Maintenance
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedStatusTab(tab)}
            variant={selectedStatusTab === tab ? 'default' : 'outline'}
            className="rounded-full px-5 py-1.5 h-auto text-xs font-semibold cursor-pointer"
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: list of requests */}
        <div className="lg:col-span-2 space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="rounded-2xl border-dashed border-2 p-8 text-center glass flex flex-col items-center justify-center">
              <Wrench className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm font-semibold text-muted-foreground">No maintenance tickets found.</p>
              <Button size="sm" variant="link" className="mt-2 text-orange-600 font-bold" onClick={handleOpenNewRequest}>
                Raise your first maintenance ticket
              </Button>
            </Card>
          ) : (
            filteredRequests.map((req, idx) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card 
                  onClick={() => setSelectedRequest(req)}
                  className={`overflow-hidden border rounded-2xl cursor-pointer hover:border-orange-500/50 transition-all glass ${
                    selectedRequest?.id === req.id ? 'border-orange-500/60 ring-2 ring-orange-500/10' : 'border-border/50'
                  }`}
                >
                  <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground font-bold">{req.id}</span>
                        <Badge 
                          className={`rounded-full text-[9px] uppercase border font-semibold ${
                            req.priority === 'High' 
                              ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                              : req.priority === 'Medium'
                              ? 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                              : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          }`}
                        >
                          {req.priority} Priority
                        </Badge>
                      </div>
                      <h3 className="font-bold text-sm text-foreground">{req.issue}</h3>
                      <p className="text-xs text-muted-foreground">{req.assetName} • <span className="font-mono text-[10px]">{req.assetCode}</span></p>
                    </div>
                    <Badge 
                      className={`rounded-full text-[9px] font-bold py-0.5 px-2 uppercase border ${
                        req.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : req.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}
                    >
                      {req.status}
                    </Badge>
                  </CardHeader>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Right column: Timeline Progression View */}
        <div className="space-y-4">
          <Card className="rounded-2xl border-border/50 glass overflow-hidden sticky top-20">
            <CardHeader className="p-4 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                Ticket Status Timeline
              </CardTitle>
              <CardDescription className="text-xs">Select a maintenance request from the left list to view its audit timeline.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {selectedRequest ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-xs text-foreground uppercase tracking-wider mb-1">Ticket Summary</h3>
                    <p className="text-xs font-semibold text-primary">{selectedRequest.issue}</p>
                    <p className="text-xs text-muted-foreground mt-2 bg-muted/40 p-2.5 rounded-lg italic">
                      "{selectedRequest.description}"
                    </p>
                  </div>

                  <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-2 space-y-5">
                    {/* Timeline Event 1 */}
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-emerald-500 text-white rounded-full p-0.5 border-4 border-background">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">Ticket Raised</p>
                        <p className="text-[10px] text-muted-foreground">Submitted by John Smith on {selectedRequest.date}</p>
                      </div>
                    </div>

                    {/* Timeline Event 2 */}
                    {selectedRequest.status !== 'Pending' && (
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 bg-blue-500 text-white rounded-full p-0.5 border-4 border-background">
                          <Clock className="w-2.5 h-2.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-foreground">Assigned to IT Technician</p>
                          <p className="text-[10px] text-muted-foreground">Assigned to Tech Support queue</p>
                        </div>
                      </div>
                    )}

                    {/* Timeline Event 3 */}
                    {selectedRequest.status === 'Completed' && (
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 bg-emerald-500 text-white rounded-full p-0.5 border-4 border-background">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-foreground">Resolved & Confirmed</p>
                          <p className="text-[10px] text-muted-foreground">Issue resolved and checked off</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-muted-foreground">
                  Select a ticket to audit its process trail.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Maintenance Dialog */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <ClipboardPlus className="w-5 h-5" />
              Submit Repair Ticket
            </DialogTitle>
            <DialogDescription>Fill out this form to request technical diagnostics or replacement.</DialogDescription>
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
                  <label className="text-xs font-semibold">Select Faulty Asset</label>
                  <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                    <SelectTrigger className="rounded-xl focus-visible:ring-primary">
                      <SelectValue placeholder="Choose assigned asset" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {employeeAssets.map(a => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name} ({a.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Summary of Fault / Bug</label>
                  <Input
                    required
                    placeholder="Short description of the fault"
                    value={issueSummary}
                    onChange={(e) => setIssueSummary(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Description / Reproduction Steps</label>
                  <textarea
                    required
                    placeholder="Provide details about the issue so our engineering team can fix it quickly."
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Urgency Level</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="rounded-xl focus-visible:ring-primary">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Low">Low - Normal usage is possible</SelectItem>
                      <SelectItem value="Medium">Medium - Disturbs workflows</SelectItem>
                      <SelectItem value="High">High - Critical blocker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsNewRequestOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">Submit Request</Button>
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
                <h3 className="font-bold text-lg text-foreground text-center">Ticket Logged Successfully</h3>
                <p className="text-xs text-muted-foreground text-center max-w-xs">Your request was assigned a ticket and is pending technician assignment.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
