import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Search, Plus, MoreHorizontal, Filter } from 'lucide-react';


// Stub for native dropdown without shadcn dependencies for action menus
function ActionMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(!open)}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-8 w-40 rounded-md border bg-popover p-1 shadow-md z-50">
          <div className="px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer">Edit</div>
          <div className="px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer">Deactivate</div>
          <div className="px-2 py-1.5 text-sm text-destructive hover:bg-accent rounded-sm cursor-pointer">Delete</div>
        </div>
      )}
    </div>
  )
}

export default function Departments() {
  const { departments } = useStore();
  const [search, setSearch] = useState('');

  const filteredDepts = departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Manage organizational structure and departments.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Create Department</Button>
      </div>

      <div className="glass rounded-xl border p-4 space-y-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department Head</TableHead>
              <TableHead className="text-right">Employees</TableHead>
              <TableHead className="text-right">Assets</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepts.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium">{dept.id}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.head}</TableCell>
                <TableCell className="text-right">{dept.employeeCount}</TableCell>
                <TableCell className="text-right">{dept.assetCount}</TableCell>
                <TableCell>
                  <Badge variant={dept.status === 'Active' ? 'success' : 'secondary'}>
                    {dept.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionMenu />
                </TableCell>
              </TableRow>
            ))}
            {filteredDepts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No departments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
