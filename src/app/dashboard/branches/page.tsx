

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockBranches } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Branch } from '@/lib/types';

const initialBranchState: Branch = {
  id: '',
  name: '',
  address: '',
  phone: '',
  hours: ''
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (branch: Branch | null = null) => {
    setEditingBranch(branch ? { ...branch } : { ...initialBranchState, id: `B${Date.now()}` });
    setIsDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingBranch || !editingBranch.name) {
        toast({ title: 'Error', description: 'Branch name is required.', variant: 'destructive' });
        return;
    }

    if (branches.some(b => b.id === editingBranch.id)) {
      // Edit
      setBranches(branches.map(b => b.id === editingBranch.id ? editingBranch : b));
      toast({ title: 'Success', description: 'Branch updated successfully.' });
    } else {
      // Add
      setBranches([editingBranch, ...branches]);
      toast({ title: 'Success', description: 'Branch added successfully.' });
    }
    
    setIsDialogOpen(false);
    setEditingBranch(null);
  };
  
  const handleDelete = (branchId: string) => {
      setBranches(branches.filter(b => b.id !== branchId));
      toast({ title: 'Success', description: 'Branch deleted successfully.', variant: 'destructive' });
  }

  const handleFieldChange = (field: keyof Branch, value: string) => {
    if (editingBranch) {
      setEditingBranch({ ...editingBranch, [field]: value });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Branch Management</CardTitle>
            <CardDescription>Add, edit, and manage your business branches.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Branch
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone}</TableCell>
                  <TableCell>{branch.hours}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(branch)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(branch.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingBranch?.id && branches.some(b => b.id === editingBranch.id) ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
            <DialogDescription>
              Fill in the details for your business branch.
            </DialogDescription>
          </DialogHeader>
          {editingBranch && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={editingBranch.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" value={editingBranch.address} onChange={(e) => handleFieldChange('address', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={editingBranch.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hours" className="text-right">Hours</Label>
                <Input id="hours" value={editingBranch.hours} onChange={(e) => handleFieldChange('hours', e.target.value)} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    