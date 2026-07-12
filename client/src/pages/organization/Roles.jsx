import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';
import { Shield, ShieldAlert, ShieldCheck, UserPlus, Info } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

export default function Roles() {
  const { roles, employees, promoteEmployee } = useStore();
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const handlePromoteClick = (emp) => {
    setSelectedEmployee(emp);
    setSelectedRole('');
    setPromoteModalOpen(true);
  };

  const handleConfirmPromotion = () => {
    if (selectedEmployee && selectedRole) {
      promoteEmployee(selectedEmployee.id, selectedRole);
      setPromoteModalOpen(false);
    }
  };

  const roleIcons = {
    'Admin': <ShieldAlert className="h-6 w-6 text-destructive" />,
    'Employee': <Shield className="h-6 w-6 text-primary" />,
    'Asset Manager': <ShieldCheck className="h-6 w-6 text-warning" />,
    'Department Head': <ShieldCheck className="h-6 w-6 text-green-500" />,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
        <p className="text-muted-foreground">Manage system roles, permissions, and employee promotions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Card key={role.id} className="glass">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-background/50 rounded-lg shrink-0">
                  {roleIcons[role.name] || <Shield className="h-6 w-6" />}
                </div>
                <Badge variant="secondary">{role.users} Users</Badge>
              </div>
              <CardTitle className="mt-4">{role.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">{role.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs">View Permissions</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Promote Employees</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {employees.map((emp) => (
            <Card key={emp.id} className="flex flex-col">
              <CardHeader className="flex flex-row gap-4 items-start pb-2">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarImage src={emp.avatar} />
                  <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base">{emp.name}</CardTitle>
                  <CardDescription className="text-xs">{emp.department}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase">Current Role</p>
                  <Badge variant={emp.role.includes('Admin') ? 'destructive' : 'default'} className="w-fit">
                    {emp.role}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t mt-auto">
                <Button 
                  variant="ghost" 
                  className="w-full text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => handlePromoteClick(emp)}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Promote
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Promotion Modal */}
      <Dialog open={promoteModalOpen} onOpenChange={setPromoteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote Employee</DialogTitle>
            <DialogDescription>
              Assign additional roles and permissions to {selectedEmployee?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted/50 p-4 rounded-md border flex gap-3 items-start my-4">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> Promoted users always keep their base <em>Employee</em> role. Promoting them adds additional permissions without removing their basic access.
            </p>
          </div>

          <div className="grid gap-4 py-2">
            <h4 className="text-sm font-medium">Select Additional Role:</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Asset Manager', 'Department Head', 'Admin'].map(r => (
                <div 
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedRole === r ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50 hover:bg-accent'}`}
                >
                  <p className="font-medium text-sm">{r}</p>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmPromotion} disabled={!selectedRole}>Confirm Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
