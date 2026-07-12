import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Plus, MoreHorizontal, Eye, Edit, ArrowRightLeft, Undo2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

export default function AssetInventory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for assets
  const assets = [
    { id: 1, name: "MacBook Pro M2", code: "LAP-001", category: "Laptop", department: "Engineering", holder: "Alice Johnson", status: "Allocated", condition: "Good", location: "HQ-Floor 3", purchaseDate: "2023-01-15" },
    { id: 2, name: "Dell XPS 15", code: "LAP-002", category: "Laptop", department: "Design", holder: "Bob Smith", status: "Allocated", condition: "Fair", location: "HQ-Floor 2", purchaseDate: "2022-11-20" },
    { id: 3, name: "Logitech MX Master 3", code: "ACC-001", category: "Accessory", department: "Engineering", holder: "Alice Johnson", status: "Allocated", condition: "Good", location: "HQ-Floor 3", purchaseDate: "2023-05-10" },
    { id: 4, name: "Herman Miller Aeron", code: "FURN-001", category: "Furniture", department: "Operations", holder: null, status: "Available", condition: "Good", location: "Storage A", purchaseDate: "2021-08-05" },
    { id: 5, name: "iPhone 14 Pro", code: "MOB-001", category: "Mobile", department: "Sales", holder: "Charlie Davis", status: "Maintenance", condition: "Damaged", location: "IT Repair", purchaseDate: "2023-09-01" },
  ];

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (asset.holder && asset.holder.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Inventory</h1>
          <p className="text-muted-foreground text-sm">Manage and track all organizational assets.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export CSV
          </Button>
          <Button onClick={() => navigate('/register')} className="gap-2">
            <Plus size={16} />
            Register Asset
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, code, category or holder..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="gap-2 w-full md:w-auto">
                <Filter size={16} />
                Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Asset Details</th>
                  <th className="px-6 py-4 font-medium">Category / Dept</th>
                  <th className="px-6 py-4 font-medium">Holder</th>
                  <th className="px-6 py-4 font-medium">Status / Condition</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={asset.id} 
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{asset.name}</div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">{asset.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{asset.category}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{asset.department}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {asset.holder || <span className="text-muted-foreground italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <Badge 
                          variant={
                            asset.status === 'Allocated' ? 'default' : 
                            asset.status === 'Available' ? 'secondary' : 
                            'destructive'
                          } 
                          className="text-[10px]"
                        >
                          {asset.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          • {asset.condition}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {asset.location}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye size={14} /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit size={14} /> Edit Asset
                          </DropdownMenuItem>
                          {asset.status === 'Allocated' && (
                            <>
                              <DropdownMenuItem onClick={() => navigate('/transfer')} className="gap-2 cursor-pointer">
                                <ArrowRightLeft size={14} /> Transfer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate('/return')} className="gap-2 cursor-pointer text-amber-600 focus:text-amber-600">
                                <Undo2 size={14} /> Return
                              </DropdownMenuItem>
                            </>
                          )}
                          {asset.status === 'Available' && (
                            <DropdownMenuItem onClick={() => navigate('/allocate')} className="gap-2 cursor-pointer text-emerald-600 focus:text-emerald-600">
                              <Plus size={14} /> Allocate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 size={14} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
                {filteredAssets.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      No assets found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder */}
          <div className="p-4 border-t flex justify-between items-center text-sm text-muted-foreground">
            <div>Showing 1 to {filteredAssets.length} of {assets.length} results</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
