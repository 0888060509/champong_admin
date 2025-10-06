
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockCampaigns } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Campaign } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialCampaignState: Campaign = {
    id: '',
    name: '',
    targetSegment: 'All Customers',
    message: '',
    status: 'Draft',
    sendDate: ''
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (campaign: Campaign | null = null) => {
    setEditingCampaign(campaign ? { ...campaign } : { ...initialCampaignState, id: `CMP${Date.now()}` });
    setIsDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingCampaign || !editingCampaign.name) {
        toast({ title: 'Error', description: 'Campaign name is required.', variant: 'destructive' });
        return;
    }

    if (campaigns.some(c => c.id === editingCampaign.id)) {
      // Edit
      setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? editingCampaign : c));
      toast({ title: 'Success', description: 'Campaign updated successfully.' });
    } else {
      // Add
      setCampaigns([...campaigns, editingCampaign]);
      toast({ title: 'Success', description: 'Campaign created successfully.' });
    }
    
    setIsDialogOpen(false);
    setEditingCampaign(null);
  };

  const handleDelete = (campaignId: string) => {
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      toast({ title: 'Success', description: 'Campaign deleted successfully.' });
  }

  const handleFieldChange = (field: keyof Campaign, value: any) => {
    if (editingCampaign) {
      setEditingCampaign({ ...editingCampaign, [field]: value });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Notification Campaigns</CardTitle>
            <CardDescription>Configure and manage notification campaigns.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Target Segment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.targetSegment}</TableCell>
                  <TableCell>
                      <Badge variant={campaign.status === 'Sent' ? 'default' : campaign.status === 'Active' ? 'secondary' : 'outline'}>
                          {campaign.status}
                      </Badge>
                  </TableCell>
                  <TableCell>{campaign.sendDate || 'N/A'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(campaign)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(campaign.id)} className="text-destructive">Delete</DropdownMenuItem>
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
            <DialogTitle className="font-headline">{editingCampaign?.id && campaigns.some(c => c.id === editingCampaign.id) ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
            <DialogDescription>
              Fill in the details for your notification campaign.
            </DialogDescription>
          </DialogHeader>
          {editingCampaign && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={editingCampaign.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetSegment" className="text-right">Target</Label>
                <Select value={editingCampaign.targetSegment} onValueChange={(value) => handleFieldChange('targetSegment', value)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select segment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Customers">All Customers</SelectItem>
                        <SelectItem value="High Spenders">High Spenders</SelectItem>
                        <SelectItem value="Recent Visitors">Recent Visitors</SelectItem>
                         <SelectItem value="Lapsed Customers">Lapsed Customers</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="message" className="text-right pt-2">Message</Label>
                <Textarea id="message" value={editingCampaign.message} onChange={(e) => handleFieldChange('message', e.target.value)} className="col-span-3" rows={5} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                 <Select value={editingCampaign.status} onValueChange={(value: Campaign['status']) => handleFieldChange('status', value)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
