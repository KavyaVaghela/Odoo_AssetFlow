import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Shield, CheckCircle, XCircle } from 'lucide-react';

import api from '@/services/api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/employees');
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus === 'Active' ? `/api/admin/deactivate/${id}` : `/api/admin/activate/${id}`;
      const res = await api.put(endpoint);
      if (res.data.success) {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const res = await api.delete(`/api/admin/employees/${id}`);
        if (res.data.success) {
          fetchEmployees();
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.first_name + ' ' + emp.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground mt-1">Manage users, their status, and details.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>All Employees</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8 bg-slate-50 dark:bg-slate-900 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Employee</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Code</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={emp.id} 
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold shrink-0">
                              {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                {emp.first_name} {emp.last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">Joined {new Date(emp.joining_date).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-900 dark:text-slate-100">{emp.email}</div>
                          <div className="text-xs text-muted-foreground">{emp.phone || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                          {emp.employee_code}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={
                              emp.status === 'Active' 
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                                : emp.status === 'Pending'
                                ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
                                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                            }
                          >
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {emp.status === 'Active' ? (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => handleStatusChange(emp.id, 'Active')} title="Deactivate">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleStatusChange(emp.id, emp.status)} title="Activate">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(emp.id)} title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                        No employees found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
