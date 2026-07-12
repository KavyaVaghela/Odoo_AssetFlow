import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';
import { Search, Plus, MoreHorizontal, Filter, Shield } from 'lucide-react';

function ActionMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(!open)}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-8 w-40 rounded-md border bg-popover p-1 shadow-md z-50">
          <div className="px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer">View Profile</div>
          <div className="px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer text-primary font-medium">Promote</div>
          <div className="px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer">Edit</div>
          <div className="px-2 py-1.5 text-sm text-destructive hover:bg-accent rounded-sm cursor-pointer">Deactivate</div>
        </div>
      )}
    </div>
  )
}

export default function Employees() {
  const { employees } = useStore();
  const [search, setSearch] = useState('');

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeVariant = (role) => {
    if (role.includes('Admin')) return 'destructive';
    if (role.includes('Department Head')) return 'default';
    if (role.includes('Asset Manager')) return 'warning';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground">Manage organization users and their access roles.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Employee</Button>
      </div>

      <div className="glass rounded-xl border p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 h-9 bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 bg-background/50">
              <Shield className="mr-2 h-4 w-4" /> Roles
            </Button>
            <Button variant="outline" size="sm" className="h-9 bg-background/50">
              <Filter className="mr-2 h-4 w-4" /> Departments
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={emp.avatar} />
                      <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm leading-none">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">{emp.email}</p>
                    <p className="text-xs text-muted-foreground">{emp.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(emp.role)} className="whitespace-nowrap">
                    {emp.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={emp.status === 'Active' ? 'success' : 'secondary'}>
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionMenu />
                </TableCell>
              </TableRow>
            ))}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
