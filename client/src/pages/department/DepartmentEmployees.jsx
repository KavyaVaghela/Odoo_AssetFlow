import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Mail, Phone, Shield, User, HardDrive, ListFilter, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function DepartmentEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/api/hod/employees');
        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load department employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const name = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    const designation = (emp.designation_name || '').toLowerCase();
    const empCode = (emp.employee_code || '').toLowerCase();
    
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                          designation.includes(searchTerm.toLowerCase()) ||
                          empCode.includes(searchTerm.toLowerCase());
                          
    const matchesFilter = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenDetails = (emp) => {
    setSelectedEmp(emp);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
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
              {['All', 'Active', 'Inactive', 'Suspended'].map((filter) => (
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
            {loading ? (
              <div className="flex py-12 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-xs text-red-500 flex flex-col items-center">
                <AlertCircle className="h-6 w-6 mb-2" />
                {error}
              </div>
            ) : (
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
                    filteredEmployees.map((emp) => (
                      <TableRow key={emp.id} className="hover:bg-muted/30 transition-colors cursor-pointer group">
                        <TableCell>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {emp.profile_image ? (
                              <img src={`http://localhost:5000/${emp.profile_image}`} alt={emp.first_name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              emp.first_name.charAt(0) + emp.last_name.charAt(0)
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-[13px]">{emp.first_name} {emp.last_name}</div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {emp.email}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{emp.employee_code || `EMP-${emp.id}`}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Shield className="w-3.5 h-3.5" />
                            {emp.designation_name || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[10px] bg-background">
                            <HardDrive className="w-3 h-3 mr-1" /> {emp.allocated_assets_count} items
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-[10px] font-semibold ${
                            emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 
                            emp.status === 'Suspended' ? 'bg-red-500/10 text-red-600' : 'bg-gray-500/10 text-gray-600'
                          }`}>
                            {emp.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDetails(emp)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employee Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border-border/50">
          <DialogHeader className="p-6 bg-muted/30 border-b">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shadow-inner">
                {selectedEmp ? (selectedEmp.profile_image ? (
                  <img src={`http://localhost:5000/${selectedEmp.profile_image}`} alt={selectedEmp.first_name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  selectedEmp.first_name.charAt(0) + selectedEmp.last_name.charAt(0)
                )) : ''}
              </div>
              <div>
                <h3 className="text-lg font-bold">{selectedEmp?.first_name} {selectedEmp?.last_name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {selectedEmp?.designation_name || 'N/A'}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Employee ID</span>
                <p className="text-sm font-mono">{selectedEmp?.employee_code || `EMP-${selectedEmp?.id}`}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Status</span>
                <div>
                  <Badge variant="secondary" className={`text-[10px] font-semibold ${
                    selectedEmp?.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-600'
                  }`}>
                    {selectedEmp?.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{selectedEmp?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{selectedEmp?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarClock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Joined {selectedEmp?.joining_date ? new Date(selectedEmp.joining_date).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-1 pt-2">
               <span className="text-[10px] uppercase text-muted-foreground font-semibold">Current Allocations</span>
               <div className="flex items-center justify-between p-3 bg-background border rounded-xl">
                 <div className="flex items-center gap-2 text-sm font-medium">
                   <HardDrive className="w-4 h-4 text-primary" />
                   Assigned Assets
                 </div>
                 <Badge variant="outline" className="font-mono">{selectedEmp?.allocated_assets_count}</Badge>
               </div>
            </div>
          </div>
          <DialogFooter className="p-4 border-t bg-muted/10">
            <Button onClick={() => setIsDetailsOpen(false)} className="w-full rounded-xl" variant="outline">Close Directory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
