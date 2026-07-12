import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Calendar, ShieldCheck, QrCode, Info, Wrench, Download, 
  X, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MyAssets() {
  const { myAssets, addMaintenanceRequest } = useStore();
  
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [maintenanceAsset, setMaintenanceAsset] = useState(null);
  const [maintenanceProblem, setMaintenanceProblem] = useState("");
  const [maintenancePriority, setMaintenancePriority] = useState("Medium");
  const [toastMessage, setToastMessage] = useState("");

  const handleRaiseMaintenance = (e) => {
    e.preventDefault();
    if (!maintenanceProblem.trim()) return;

    addMaintenanceRequest({
      assetName: maintenanceAsset.name,
      assetCode: maintenanceAsset.code,
      problem: maintenanceProblem,
      priority: maintenancePriority
    });

    setMaintenanceAsset(null);
    setMaintenanceProblem("");
    setMaintenancePriority("Medium");
    
    // Show toast
    setToastMessage("Maintenance request raised successfully!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  const getConditionColor = (cond) => {
    switch (cond.toLowerCase()) {
      case 'excellent': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25';
      case 'good': return 'bg-amber-500/10 text-amber-500 border-amber-500/25';
      default: return 'bg-rose-500/10 text-rose-500 border-rose-500/25';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500 animate-in slide-in-from-bottom-6 duration-300">
          <CheckCircle2 size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assigned Assets</h1>
          <p className="text-muted-foreground">List of corporate hardware, tools, and electronics assigned to you.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => alert("Downloading CSV details... (Mock)")}>
            <Download size={14} />
            Download Details
          </Button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myAssets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 glass flex flex-col h-[420px] group border-border/50">
              
              {/* Asset Image & badges */}
              <div className="relative h-44 bg-muted overflow-hidden shrink-0">
                <img 
                  src={asset.image} 
                  alt={asset.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-primary/90 backdrop-blur-md text-white border-none font-semibold text-[10px]">
                    {asset.category}
                  </Badge>
                  <Badge variant="outline" className={`backdrop-blur-md font-semibold text-[10px] ${getConditionColor(asset.condition)}`}>
                    {asset.condition} Condition
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">{asset.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Asset Code</span>
                      <span className="font-mono font-bold mt-0.5 text-foreground">{asset.code}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Serial Number</span>
                      <span className="font-mono mt-0.5 text-foreground">{asset.serial}</span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-muted-foreground">Allocated On</span>
                      <span className="font-medium mt-0.5 text-foreground">{asset.allocationDate}</span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-muted-foreground">Return Due</span>
                      <span className="font-medium mt-0.5 text-foreground">{asset.expectedReturnDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-9 rounded-lg gap-1 border-border"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <Info size={14} />
                    Details
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 h-9 rounded-lg gap-1 hover:bg-yellow-500/10 hover:text-yellow-600 border border-transparent hover:border-yellow-500/20 text-muted-foreground"
                    onClick={() => setMaintenanceAsset(asset)}
                  >
                    <Wrench size={14} />
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dialog 1: Asset Details & QR */}
      {selectedAsset && (
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent className="sm:max-w-[480px] rounded-2xl glass border border-border/80 p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">{selectedAsset.name}</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">{selectedAsset.category}</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setSelectedAsset(null)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Image & Details */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* QR Code Mock Box */}
                <div className="flex flex-col items-center bg-card p-4 rounded-xl border border-border/80 shadow-md shrink-0">
                  <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center border">
                    {/* Generates a nice styled mock QR code using SVG */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-foreground">
                      <rect width="100" height="100" fill="white" />
                      {/* Quiet squares */}
                      <rect x="0" y="0" width="25" height="25" fill="black" />
                      <rect x="3" y="3" width="19" height="19" fill="white" />
                      <rect x="7" y="7" width="11" height="11" fill="black" />

                      <rect x="75" y="0" width="25" height="25" fill="black" />
                      <rect x="78" y="3" width="19" height="19" fill="white" />
                      <rect x="82" y="7" width="11" height="11" fill="black" />

                      <rect x="0" y="75" width="25" height="25" fill="black" />
                      <rect x="3" y="78" width="19" height="19" fill="white" />
                      <rect x="7" y="82" width="11" height="11" fill="black" />

                      {/* Random noise boxes representing QR pixels */}
                      <rect x="35" y="5" width="10" height="5" fill="black" />
                      <rect x="45" y="15" width="5" height="15" fill="black" />
                      <rect x="60" y="5" width="10" height="10" fill="black" />
                      <rect x="15" y="35" width="15" height="5" fill="black" />
                      <rect x="35" y="35" width="30" height="10" fill="black" />
                      <rect x="80" y="35" width="15" height="10" fill="black" />
                      <rect x="5" y="50" width="10" height="10" fill="black" />
                      <rect x="25" y="55" width="20" height="5" fill="black" />
                      <rect x="55" y="50" width="10" height="20" fill="black" />
                      <rect x="75" y="55" width="15" height="5" fill="black" />
                      <rect x="35" y="70" width="10" height="15" fill="black" />
                      <rect x="70" y="70" width="20" height="20" fill="black" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono mt-2 uppercase tracking-wider">{selectedAsset.code}</span>
                </div>

                {/* Metadata list */}
                <div className="flex-1 space-y-3 text-sm w-full">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Serial Number</span>
                    <span className="font-semibold text-foreground font-mono">{selectedAsset.serial}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-semibold text-foreground">{selectedAsset.condition}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Allocation Date</span>
                    <span className="font-semibold text-foreground">{selectedAsset.allocationDate}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Expected Return</span>
                    <span className="font-semibold text-foreground">{selectedAsset.expectedReturnDate}</span>
                  </div>
                </div>
              </div>

              {/* Usage Policy Note */}
              <div className="p-3 bg-muted/50 border rounded-xl flex gap-2.5 items-start text-xs text-muted-foreground leading-relaxed">
                <ShieldCheck size={16} className="text-primary mt-0.5 shrink-0" />
                <span>
                  This device is marked as corporate property of AssetFlow Inc. Usage is governed by the Employee IT Hardware Policy. For configuration updates, software licenses, or upgrades, please contact IT Helpdesk.
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 border-t flex justify-end gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => alert("Downloading specifications PDF... (Mock)")}>
                <Download size={14} className="mr-1.5" /> Spec PDF
              </Button>
              <Button size="sm" onClick={() => setSelectedAsset(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog 2: Raise Maintenance Request */}
      {maintenanceAsset && (
        <Dialog open={!!maintenanceAsset} onOpenChange={() => setMaintenanceAsset(null)}>
          <DialogContent className="sm:max-w-[480px] rounded-2xl glass border border-border/80 p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">Raise Maintenance Request</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">Submit repair/diagnostic ticket for your device</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setMaintenanceAsset(null)}>
                <X size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleRaiseMaintenance}>
              <div className="p-6 space-y-4">
                {/* Asset Label */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Asset Selected</label>
                  <div className="p-3 rounded-lg border bg-muted/30 flex items-center gap-3">
                    <Package size={16} className="text-primary" />
                    <div>
                      <div className="font-semibold text-sm text-foreground">{maintenanceAsset.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{maintenanceAsset.code}</div>
                    </div>
                  </div>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Priority Level</label>
                  <Select value={maintenancePriority} onValueChange={setMaintenancePriority}>
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
                    value={maintenanceProblem}
                    onChange={(e) => setMaintenanceProblem(e.target.value)}
                    placeholder="Provide details of the bug, physical damage, or battery malfunction..."
                    className="min-h-[100px] rounded-lg border-border focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded-xl flex gap-2.5 items-start text-xs leading-relaxed">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Critical: Do not open the device shell yourself. Self-repair attempts violate manufacturer warranty policy.
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t flex justify-end gap-2 shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={() => setMaintenanceAsset(null)}>Cancel</Button>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">Submit Request</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
