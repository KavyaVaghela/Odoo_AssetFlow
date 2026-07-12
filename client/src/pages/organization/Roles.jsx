import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, ShieldCheck, Users, Trash2, Edit } from 'lucide-react';
import api from '@/services/api';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/roles');
      if (res.data.success) {
        setRoles(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const res = await api.delete(`/api/admin/roles/${id}`);
        if (res.data.success) fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        alert(error.response?.data?.message || 'Failed to delete role.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground mt-1">Configure system roles and permission sets.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" /> Assign Roles
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4" /> Create Role
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mb-2">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="bg-slate-50">
                      ID: {role.id}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{role.role_name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {role.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Created: {new Date(role.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(role.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
