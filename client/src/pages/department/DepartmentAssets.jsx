import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Search, Eye, HardDrive, MapPin, Tag, ShieldCheck, User } from 'lucide-react';

export default function DepartmentAssets() {
  const { departmentAssets } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredAssets = departmentAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.holder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || asset.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenDetails = (asset) => {
    setSelectedAsset(asset);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Department Assets</h1>
        <p className="text-muted-foreground">Monitor physical computer units, networking routers, and license items allocated to your department.</p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by name, code, holder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9.5 rounded-xl border bg-background/50 focus-visible:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Allocated', 'Under Maintenance'].map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? 'default' : 'outline'}
              onClick={() => setStatusFilter(filter)}
              className="rounded-xl h-9.5 text-xs font-semibold px-4 cursor-pointer"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-shadow rounded-2xl glass">
              <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
                <Badge 
                  className={`absolute top-3 right-3 rounded-full uppercase text-[9px] font-bold px-2 py-0.5 ${
                    asset.condition === 'Excellent' 
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}
                >
                  {asset.condition}
                </Badge>
              </div>

              <CardContent className="p-4.5 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{asset.category}</span>
                  <h3 className="text-base font-bold text-foreground truncate mt-0.5">{asset.name}</h3>
                  <p className="font-mono text-muted-foreground mt-0.5">{asset.code}</p>
                </div>

                <div className="space-y-1.5 py-2 border-y border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-muted-foreground" /> Current Holder
                    </span>
                    <span className="font-semibold text-foreground">{asset.holder}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location Office
                    </span>
                    <span className="font-semibold text-foreground">{asset.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" /> Current Status
                    </span>
                    <Badge 
                      className={`text-[8px] font-bold py-0 uppercase border ${
                        asset.status === 'Allocated' 
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}
                    >
                      {asset.status}
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => handleOpenDetails(asset)}
                  className="w-full h-8.5 rounded-xl text-xs bg-primary hover:bg-blue-700 text-white gap-1.5 shadow-sm hover:shadow cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Spec Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Specification Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Hardware Specifications</DialogTitle>
            <DialogDescription>Full audit records for the selected corporate resource.</DialogDescription>
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
                <span className="text-muted-foreground">Allocation Category</span>
                <span className="font-semibold">{selectedAsset.category}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Assigned User Holder</span>
                <span className="font-semibold">{selectedAsset.holder}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Office Placement Room</span>
                <span className="font-semibold">{selectedAsset.location}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Condition Rating</span>
                <span className="font-semibold">{selectedAsset.condition}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status Log</span>
                <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20">{selectedAsset.status}</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="rounded-xl w-full" onClick={() => setIsDetailsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
