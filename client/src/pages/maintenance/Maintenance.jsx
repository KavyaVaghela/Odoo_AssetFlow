import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, Plus, CheckCircle2, Clock, PlayCircle, ShieldCheck, 
  X, AlertTriangle, Calendar, ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Maintenance() {
  const { maintenance, myAssets, addMaintenanceRequest } = useStore();

  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "completed"
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [targetAssetIndex, setTargetAssetIndex] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [requestPriority, setRequestPriority] = useState("Medium");
  const [toastMessage, setToastMessage] = useState("");

  const filteredRequests = maintenance.filter((req) => {
    if (activeTab === "active") return req.status !== "Completed";
    if (activeTab === "completed") return req.status === "Completed";
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
      case "In Progress": return <PlayCircle size={16} className="text-blue-500 shrink-0" />;
      case "Approved": return <Clock size={16} className="text-indigo-500 shrink-0" />;
      default: return <Clock size={16} className="text-amber-500 shrink-0" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/25 text-xs font-semibold">{status}</Badge>;
      case "In Progress": return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/25 text-xs font-semibold">{status}</Badge>;
      case "Approved": return <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/25 text-xs font-semibold">{status}</Badge>;
      default: return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/25 text-xs font-semibold">{status}</Badge>;
    }
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (targetAssetIndex === "" || !problemDescription.trim()) return;

    const asset = myAssets[parseInt(targetAssetIndex)];

    addMaintenanceRequest({
      assetName: asset.name,
      assetCode: asset.code,
      problem: problemDescription,
      priority: requestPriority
    });

    setNewRequestOpen(false);
    setTargetAssetIndex("");
    setProblemDescription("");
    setRequestPriority("Medium");

    setToastMessage("Maintenance request raised successfully!");
    setTimeout(() => setToastMessage(""), 4000);
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
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Tickets</h1>
          <p className="text-muted-foreground">Raise and track repair or hardware diagnostic issues with IT Support.</p>
        </div>
        <Button onClick={() => setNewRequestOpen(true)} className="h-9 gap-1.5 font-semibold text-sm">
          <Plus size={16} />
          New Request
        </Button>
      </div>

      {/* Grid Layout: Left: Tickets list, Right: Selected Ticket Timeline */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Tickets Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center bg-card p-2 rounded-xl border border-border/50">
            <div className="flex gap-1.5">
              <Button
                variant={activeTab === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("all")}
                className="h-8 text-xs rounded-lg font-semibold"
              >
                All
              </Button>
              <Button
                variant={activeTab === "active" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("active")}
                className="h-8 text-xs rounded-lg font-semibold"
              >
                Active
              </Button>
              <Button
                variant={activeTab === "completed" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("completed")}
                className="h-8 text-xs rounded-lg font-semibold"
              >
                Completed
              </Button>
            </div>
            <span className="text-xs text-muted-foreground font-semibold px-2">Total: {filteredRequests.length}</span>
          </div>

          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card className="glass border-border/50 p-8 text-center">
                <ClipboardList size={32} className="mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground leading-relaxed">No maintenance tickets found.</p>
              </Card>
            ) : (
              filteredRequests.map((req) => (
                <Card 
                  key={req.id} 
                  onClick={() => setSelectedRequest(req)}
                  className={`glass border-border/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    selectedRequest?.id === req.id ? 'border-primary/50 ring-1 ring-primary/20' : ''
                  }`}
                >
                  <CardHeader className="p-4 flex flex-row items-start justify-between pb-2">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1">{req.assetName}</h3>
                      <span className="font-mono text-[10px] text-muted-foreground mt-0.5">{req.assetCode}</span>
                    </div>
                    {getStatusBadge(req.status)}
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{req.problem}</p>
                    <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground pt-1 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        <span>Raised on: {req.submittedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant={req.priority === "High" ? "destructive" : "secondary"} className="text-[9px] px-1.5 py-0 font-bold uppercase">
                          {req.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Selected Request details (Timeline) */}
        <div className="lg:col-span-5">
          {selectedRequest ? (
            <Card className="glass border-border/50 sticky top-20 overflow-hidden">
              <div className="bg-primary/5 p-4 border-b flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">Ticket {selectedRequest.id}</CardTitle>
                  <CardDescription className="text-[10px] font-mono mt-0.5">{selectedRequest.assetCode}</CardDescription>
                </div>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <CardContent className="p-5 space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Issue Details</label>
                  <p className="text-xs text-foreground leading-relaxed p-3 bg-muted/40 rounded-lg border">
                    {selectedRequest.problem}
                  </p>
                </div>

                {/* Vertical Timeline */}
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">Diagnostics History</label>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {selectedRequest.timeline.map((step, i) => (
                      <div key={i} className="relative flex gap-4 items-start">
                        <div className="absolute -left-[20px] mt-1.5 w-3 h-3 rounded-full bg-background border-2 border-primary shrink-0 z-10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-foreground">{step.status}</span>
                            <span className="text-[9px] text-muted-foreground font-medium">{step.date}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{step.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass border-border/50 p-8 text-center h-48 flex flex-col justify-center items-center">
              <Wrench size={24} className="text-muted-foreground/50 mb-2" />
              <p className="text-xs text-muted-foreground leading-relaxed">Select a maintenance ticket from the list to view diagnostic logs and timeline history.</p>
            </Card>
          )}
        </div>

      </div>

      {/* New Request Modal */}
      {newRequestOpen && (
        <Dialog open={newRequestOpen} onOpenChange={() => setNewRequestOpen(false)}>
          <DialogContent className="sm:max-w-[460px] rounded-2xl glass border border-border/80 p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">Raise Maintenance Ticket</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">Submit repair ticket to IT services</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setNewRequestOpen(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleCreateRequest}>
              <div className="p-6 space-y-4">
                {/* Select Asset */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Select Device</label>
                  <Select value={targetAssetIndex} onValueChange={setTargetAssetIndex} required>
                    <SelectTrigger className="w-full rounded-lg border-border">
                      <SelectValue placeholder="Choose a device" />
                    </SelectTrigger>
                    <SelectContent>
                      {myAssets.map((asset, i) => (
                        <SelectItem key={asset.id} value={i.toString()}>
                          {asset.name} ({asset.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Priority Level</label>
                  <Select value={requestPriority} onValueChange={setRequestPriority}>
                    <SelectTrigger className="w-full rounded-lg border-border">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low (General deterioration, no blockage)</SelectItem>
                      <SelectItem value="Medium">Medium (Performance hits, workarounds exist)</SelectItem>
                      <SelectItem value="High">High (Immediate blocker, device unusable)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Issue Description</label>
                  <Textarea
                    required
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Provide details of the bug, physical damage, or battery malfunction..."
                    className="min-h-[100px] rounded-lg border-border focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded-xl flex gap-2.5 items-start text-xs leading-relaxed">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Warning: Do not attempt to repair company-owned electronics. It voids warranties and violates company asset usage terms.
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t flex justify-end gap-2 shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={() => setNewRequestOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">Submit Request</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
