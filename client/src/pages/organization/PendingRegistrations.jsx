import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, ShieldAlert } from 'lucide-react';
import api from '@/services/api';

export default function PendingRegistrations() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/pending-users');
      if (res.data.success) {
        setPendingUsers(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await api.put(`/api/admin/approve/${id}`);
      if (res.data.success) {
        setPendingUsers(prev => prev.filter(user => user.id !== id));
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this registration?')) {
      try {
        const res = await api.put(`/api/admin/reject/${id}`);
        if (res.data.success) {
          setPendingUsers(prev => prev.filter(user => user.id !== id));
        }
      } catch (error) {
        console.error('Error rejecting user:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Registrations</h1>
        <p className="text-muted-foreground mt-1">Review and approve new user accounts.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : pendingUsers.length === 0 ? (
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">All Caught Up!</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              There are no pending registrations waiting for your approval at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pendingUsers.map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
                <div className="h-2 bg-orange-400 w-full" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold text-lg">
                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{user.first_name} {user.last_name}</h3>
                        <p className="text-sm text-muted-foreground">{user.employee_code}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400">
                      Pending
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="text-sm">
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider">Email</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider">Phone</span>
                      <span className="font-medium">{user.phone || 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider">Registered On</span>
                      <span className="font-medium">{new Date(user.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                      onClick={() => handleApprove(user.id)}
                    >
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 gap-2"
                      onClick={() => handleReject(user.id)}
                    >
                      <X className="h-4 w-4" /> Reject
                    </Button>
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
