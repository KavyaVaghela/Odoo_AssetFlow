import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Search, Eye, HardDrive, MapPin, Tag, ShieldCheck, User, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function DepartmentAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/api/hod/assets');
        if (response.data.success) {
          setAssets(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load department assets');
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset => {
    const name = (asset.asset_name || '').toLowerCase();
    const code = (asset.asset_code || '').toLowerCase();
    const holderName = asset.first_name ? `${asset.first_name} ${asset.last_name}`.toLowerCase() : 'unassigned';
    
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                          code.includes(searchTerm.toLowerCase()) ||
                          holderName.includes(searchTerm.toLowerCase());
    
    // Determine simplified filter statuses
    let assetFilterStatus = asset.current_status; // "Active", "Available", "Under Maintenance", "Retired"
    if (assetFilterStatus === 'Active') assetFilterStatus = 'Allocated'; // UI terminology matching
    
    const matchesFilter = statusFilter === 'All' || assetFilterStatus === statusFilter || asset.current_status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenDetails = (asset) => {
    setSelectedAsset(asset);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
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
          {['All', 'Available', 'Allocated', 'Under Maintenance'].map((filter) => (
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

      {/* State Handlers */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex h-40 flex-col items-center justify-center text-red-500">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p>{error}</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          <p>No assets found matching your criteria.</p>
        </div>
      ) : (
        /* Assets Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-shadow rounded-2xl glass h-full flex flex-col">
                <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {asset.asset_image ? (
                    <img
                      src={`http://localhost:5000/${asset.asset_image}`}
                      alt={asset.asset_name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <HardDrive className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  )}
                  <Badge 
                    className={`absolute top-3 right-3 rounded-full uppercase text-[9px] font-bold px-2 py-0.5 ${
                      asset.condition === 'Excellent' || asset.condition === 'Good'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}
                  >
                    {asset.condition || 'N/A'}
                  </Badge>
                </div>

                <CardContent className="p-4.5 flex-1 flex flex-col">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{asset.category_name || 'Uncategorized'}</span>
                    <h3 className="text-sm font-bold text-foreground truncate mt-0.5" title={asset.asset_name}>{asset.asset_name}</h3>
                    <p className="font-mono text-muted-foreground mt-0.5 text-[11px]">{asset.asset_code}</p>
                  </div>

                  <div className="mt-auto pt-3 space-y-1.5 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Holder
                      </span>
                      <span className="font-semibold text-foreground truncate max-w-[120px]">
                        {asset.first_name ? `${asset.first_name} ${asset.last_name}` : 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Status
                      </span>
                      <Badge variant="outline" className={`text-[9px] h-4.5 bg-background ${
                        asset.current_status === 'Active' ? 'border-emerald-500 text-emerald-600' :
                        asset.current_status === 'Available' ? 'border-blue-500 text-blue-600' :
                        'border-orange-500 text-orange-600'
                      }`}>
                        {asset.current_status}
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3 text-xs rounded-xl h-8 bg-muted/40 hover:bg-primary hover:text-white"
                    onClick={() => handleOpenDetails(asset)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> View Specifications
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Asset Specification Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-6 bg-muted/30 border-b">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {selectedAsset?.asset_image ? (
                  <img src={`http://localhost:5000/${selectedAsset.asset_image}`} className="w-full h-full object-cover rounded-xl" alt="asset" />
                ) : (
                  <HardDrive className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">{selectedAsset?.asset_name}</h3>
                <p className="text-xs text-muted-foreground font-mono">{selectedAsset?.asset_code}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Category
                </span>
                <p className="font-semibold">{selectedAsset?.category_name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Location
                </span>
                <p className="font-semibold">{selectedAsset?.location || 'Unknown'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Condition
                </span>
                <p className="font-semibold">{selectedAsset?.condition}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1">
                  <User className="w-3 h-3" /> Assigned To
                </span>
                <p className="font-semibold text-primary">{selectedAsset?.first_name ? `${selectedAsset.first_name} ${selectedAsset.last_name}` : 'Unassigned'}</p>
              </div>
            </div>

            <div className="p-4 bg-muted/20 border border-border/50 rounded-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Hardware Specifications</h4>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                 <div className="flex flex-col"><span className="text-muted-foreground">Brand</span><span className="font-medium">{selectedAsset?.brand || 'N/A'}</span></div>
                 <div className="flex flex-col"><span className="text-muted-foreground">Model</span><span className="font-medium">{selectedAsset?.model || 'N/A'}</span></div>
                 <div className="flex flex-col"><span className="text-muted-foreground">Serial Number</span><span className="font-mono font-medium">{selectedAsset?.serial_number || 'N/A'}</span></div>
                 <div className="flex flex-col"><span className="text-muted-foreground">Purchase Cost</span><span className="font-medium">${selectedAsset?.purchase_cost || 'N/A'}</span></div>
                 <div className="flex flex-col col-span-2"><span className="text-muted-foreground">Warranty Expiry</span><span className="font-medium">{selectedAsset?.warranty_expiry_date ? new Date(selectedAsset.warranty_expiry_date).toLocaleDateString() : 'No Warranty'}</span></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
