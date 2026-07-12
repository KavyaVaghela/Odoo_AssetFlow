import React, { useState } from 'react';
<<<<<<< HEAD
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
=======
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, ShieldAlert, Download, QrCode, Calendar, Info, AlertTriangle, Eye, CheckCircle } from 'lucide-react';

export default function MyAssets() {
  const { employeeAssets, addMaintenanceRequest } = useStore();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  
  // Maintenance Form State
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenDetails = (asset) => {
    setSelectedAsset(asset);
    setIsDetailsOpen(true);
  };

  const handleOpenQr = (asset) => {
    setSelectedAsset(asset);
    setIsQrOpen(true);
  };

  const handleOpenMaintenance = (asset) => {
    setSelectedAsset(asset);
    setIsMaintenanceOpen(true);
    setIssueTitle('');
    setIssueDescription('');
    setPriority('Medium');
    setIsSuccess(false);
  };

  const handleRaiseMaintenanceSubmit = (e) => {
    e.preventDefault();
    if (!issueTitle.trim() || !issueDescription.trim()) return;

    addMaintenanceRequest({
      assetName: selectedAsset.name,
      assetCode: selectedAsset.code,
      issue: issueTitle,
      description: issueDescription,
      priority: priority,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsMaintenanceOpen(false);
      setIsSuccess(false);
    }, 1500);
  };

  const handleDownloadInfo = (asset) => {
    const content = `
=========================================
AssetFlow - Asset Allocation Certificate
=========================================
Asset Name     : ${asset.name}
Asset Code     : ${asset.code}
Category       : ${asset.category}
Serial Number  : ${asset.serialNumber}
Condition      : ${asset.condition}
Allocation Date: ${asset.allocationDate}
Return Date    : ${asset.returnDate}
Current Status : ${asset.status}

This document serves as proof of resource assignment. Keep this record secure.
Generated on   : ${new Date().toLocaleDateString()}
=========================================
`;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${asset.code}_info.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">My Assigned Assets</h1>
          <p className="text-muted-foreground">Manage and check details for the assets allocated to you by the organization.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {employeeAssets.map((asset, index) => (
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
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
=======
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border border-border/60 hover:shadow-lg transition-all duration-300 rounded-2xl glass">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
                <Badge 
                  className={`absolute top-3 right-3 rounded-full uppercase text-[10px] font-bold px-2 py-0.5 ${
                    asset.condition === 'Excellent' 
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}
                >
                  {asset.condition}
                </Badge>
              </div>

              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">{asset.category}</p>
                  <h3 className="text-lg font-bold truncate text-foreground">{asset.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{asset.code}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border/50">
                  <div>
                    <span className="text-muted-foreground block">Allocation Date</span>
                    <span className="font-semibold text-foreground">{asset.allocationDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Return Due Date</span>
                    <span className={`font-semibold ${
                      new Date(asset.returnDate) <= new Date(Date.now() + 86400000) 
                        ? 'text-red-500 font-bold' 
                        : 'text-foreground'
                    }`}>{asset.returnDate}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl gap-1 text-xs cursor-pointer"
                    onClick={() => handleOpenDetails(asset)}
                  >
                    <Info className="w-3.5 h-3.5" />
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl px-2.5 cursor-pointer"
                    onClick={() => handleOpenQr(asset)}
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl px-2.5 cursor-pointer"
                    onClick={() => handleDownloadInfo(asset)}
                    title="Download Asset Info"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                <Button 
                  onClick={() => handleOpenMaintenance(asset)}
                  className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1.5 shadow-sm hover:shadow cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Raise Maintenance Ticket
                </Button>
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

<<<<<<< HEAD
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
=======
      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Asset Technical Specifications</DialogTitle>
            <DialogDescription>Full specifications and assignment data for your hardware resource.</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4 py-3 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Asset Name</span>
                <span className="font-semibold">{selectedAsset.name}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Asset Code</span>
                <span className="font-mono font-semibold">{selectedAsset.code}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Serial Number</span>
                <span className="font-mono font-semibold">{selectedAsset.serialNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold">{selectedAsset.category}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Allocation Date</span>
                <span className="font-semibold">{selectedAsset.allocationDate}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Return Due Date</span>
                <span className="font-semibold">{selectedAsset.returnDate}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Condition Rating</span>
                <span className="font-semibold">{selectedAsset.condition}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Assignment Status</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">{selectedAsset.status}</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="rounded-xl w-full sm:w-auto" onClick={() => setIsDetailsOpen(false)}>Close Specifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Zoom Dialog */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center">
          <DialogHeader className="w-full">
            <DialogTitle className="text-center">Physical QR Inventory Code</DialogTitle>
            <DialogDescription className="text-center">Scan at the security desk or for verification checks.</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="my-6 p-4 bg-white rounded-2xl border-4 border-slate-50 shadow-sm flex items-center justify-center">
              <img
                src={selectedAsset.qrCode}
                alt={`${selectedAsset.code} QR Code`}
                className="w-40 h-40 object-contain"
              />
            </div>
          )}
          {selectedAsset && (
            <p className="text-xs font-mono font-bold text-muted-foreground uppercase">{selectedAsset.code}</p>
          )}
          <DialogFooter className="w-full mt-4">
            <Button className="rounded-xl w-full" onClick={() => setIsQrOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Raise Maintenance Ticket Dialog */}
      <Dialog open={isMaintenanceOpen} onOpenChange={setIsMaintenanceOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-orange-500 w-5 h-5" />
              Raise Maintenance Ticket
            </DialogTitle>
            <DialogDescription>
              Submit issues regarding your assigned asset directly to the IT Support Team.
            </DialogDescription>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                onSubmit={handleRaiseMaintenanceSubmit} 
                className="space-y-4"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {selectedAsset && (
                  <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between text-xs font-medium border">
                    <div>
                      <span className="text-muted-foreground">Asset: </span>
                      <span>{selectedAsset.name}</span>
                    </div>
                    <div className="font-mono text-muted-foreground">
                      {selectedAsset.code}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Issue Title / Short Summary</label>
                  <Input
                    required
                    placeholder="e.g. Battery draining too fast, Screen flickering"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Detailed Description</label>
                  <textarea
                    required
                    placeholder="Describe when the issue happens, what you did, and how long it has been occurring."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border bg-transparent rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Priority Level</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="rounded-xl focus-visible:ring-primary">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Low">Low - Normal usage possible</SelectItem>
                      <SelectItem value="Medium">Medium - Disturbs workflows</SelectItem>
                      <SelectItem value="High">High - Blocker / Cannot work</SelectItem>
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
                    </SelectContent>
                  </Select>
                </div>

<<<<<<< HEAD
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

=======
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsMaintenanceOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">Submit Ticket</Button>
                </DialogFooter>
              </motion.form>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-8 space-y-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 border border-emerald-500/20">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-foreground text-center">Ticket Submitted Successfully</h3>
                <p className="text-xs text-muted-foreground text-center max-w-xs">Your request was assigned ticket ID #M-{Math.floor(100+Math.random()*900)} and is pending approval.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
    </div>
  );
}
