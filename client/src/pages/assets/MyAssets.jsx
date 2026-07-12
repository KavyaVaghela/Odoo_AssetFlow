import React, { useState } from 'react';
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
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
                    </SelectContent>
                  </Select>
                </div>

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
    </div>
  );
}
