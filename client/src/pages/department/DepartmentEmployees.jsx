import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Mail, Phone, Shield, User, HardDrive, ListFilter } from 'lucide-react';

export default function DepartmentEmployees() {
  const { departmentEmployees } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredEmployees = departmentEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenDetails = (emp) => {
    setSelectedEmp(emp);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Department Employees</h1>
        <p className="text-muted-foreground">Manage reporting staff directory and verify their assigned resource quantities.</p>
      </div>

      <Card className="rounded-2xl border-border/50 glass overflow-hidden">
        <CardHeader className="p-5 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary" />
                Staff Directory Index
              </CardTitle>
              <CardDescription className="text-xs">Index of staff members and active asset ratios.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff name, role, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9.5 rounded-xl border bg-background/50 focus-visible:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Active', 'On Leave'].map((filter) => (
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

          {/* Table */}
          <div className="rounded-xl border overflow-hidden bg-background/30 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold text-xs py-3 w-16">Profile</TableHead>
                  <TableHead className="font-semibold text-xs">Name</TableHead>
                  <TableHead className="font-semibold text-xs w-28">Employee ID</TableHead>
                  <TableHead className="font-semibold text-xs">Designation</TableHead>
                  <TableHead className="font-semibold text-xs w-36">Allocated Assets</TableHead>
                  <TableHead className="font-semibold text-xs w-28">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-right w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                      No staff records found in this category.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp, index) => (
                    <TableRow key={emp.id} className="hover:bg-muted/10">
                      <TableCell className="py-2.5">
                        <div className="w-9 h-9 rounded-full overflow-hidden border">
                          <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{emp.name}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{emp.id}</TableCell>
                      <TableCell className="text-xs font-medium">{emp.designation}</TableCell>
                      <TableCell className="text-xs">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                          <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                          {emp.allocatedAssets} Items
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`rounded-full text-[8px] font-bold py-0.5 px-2 uppercase border ${
                            emp.status === 'Active' 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}
                        >
                          {emp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-lg cursor-pointer"
                          onClick={() => handleOpenDetails(emp)}
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="text-primary w-5 h-5" />
              Staff Profile Details
            </DialogTitle>
            <DialogDescription>Full record details for the selected staff member.</DialogDescription>
          </DialogHeader>
          {selectedEmp && (
            <div className="space-y-4 py-3 text-sm">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border">
                  <img src={selectedEmp.avatar} alt={selectedEmp.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{selectedEmp.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedEmp.designation}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-mono font-semibold">{selectedEmp.id}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Corporate Email</span>
                <span className="font-semibold text-primary break-all">{selectedEmp.email}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Phone Extension</span>
                <span className="font-semibold">{selectedEmp.phone}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Assigned Asset Count</span>
                <span className="font-bold text-primary">{selectedEmp.allocatedAssets} hardware items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Status</span>
                <Badge 
                  className={`rounded-full text-[9px] uppercase border ${
                    selectedEmp.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  }`}
                >
                  {selectedEmp.status}
                </Badge>
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
