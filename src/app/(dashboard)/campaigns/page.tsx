
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Campaign } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useCampaigns } from './campaigns-context';

const initialCampaignState: Campaign = {
    id: '',
    name: '',
    targetSegment: [],
    title: '',
    message: '',
    status: 'Draft',
    scheduleDate: null,
    sentCount: 0,
    openRate: 0,
    ctr: 0,
    onClickAction: { type: 'None' }
};

export default function CampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useCampaigns();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      updateCampaign(editingCampaign);
    } else {
      // Add
      addCampaign(editingCampaign);
    }
    
    setIsDialogOpen(false);
    setEditingCampaign(null);
  };

  const handleDelete = (campaignId: string) => {
      deleteCampaign(campaignId);
  }

  const handleFieldChange = (field: keyof Campaign, value: any) => {
    if (editingCampaign) {
      setEditingCampaign({ ...editingCampaign, [field]: value });
    }
  };
  
    const handleActionFieldChange = (field: keyof Campaign['onClickAction'], value: any) => {
    if (editingCampaign) {
      const newAction = { ...editingCampaign.onClickAction, [field]: value };
      setEditingCampaign({ ...editingCampaign, onClickAction: newAction });
    }
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'Completed':
        return <Badge>{status}</Badge>;
      case 'Scheduled':
        return <Badge variant="secondary">{status}</Badge>;
      case 'Sending':
        return <Badge className="bg-blue-500 text-white">{status}</Badge>;
      case 'Canceled':
        return <Badge variant="destructive">{status}</Badge>;
      case 'Draft':
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Notification Campaigns</CardTitle>
            <CardDescription>Create, schedule, and send targeted push notification campaigns.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Target Segment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled/Sent</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Open Rate</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                     <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                        {campaign.name}
                     </Link>
                  </TableCell>
                  <TableCell>{campaign.targetSegment.join(', ')}</TableCell>
                  <TableCell>
                    {getStatusBadge(campaign.status)}
                  </TableCell>
                  <TableCell>{isClient && campaign.scheduleDate ? new Date(campaign.scheduleDate).toLocaleString() : 'Not scheduled'}</TableCell>
                  <TableCell className="text-right">{campaign.sentCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(campaign.openRate * 100).toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{(campaign.ctr * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/campaigns/${campaign.id}`} passHref><DropdownMenuItem>View Details</DropdownMenuItem></Link>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingCampaign?.id && campaigns.some(c => c.id === editingCampaign.id) ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
            <DialogDescription>
              Fill in the details for your notification campaign.
            </DialogDescription>
          </DialogHeader>
          {editingCampaign && (
            <ScrollArea className="max-h-[70vh] pr-6">
              <div className="grid gap-6 py-4">
                <div className="space-y-4 border-b pb-6">
                  <h3 className="text-lg font-medium font-headline">1. General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-left md:text-right">Name</Label>
                      <Input id="name" value={editingCampaign.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="col-span-1 md:col-span-3" placeholder="e.g. Q4 Marketing Push" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-left md:text-right pt-2">Description</Label>
                      <Textarea id="description" value={editingCampaign.description} onChange={(e) => handleFieldChange('description', e.target.value)} className="col-span-1 md:col-span-3" placeholder="Internal description for this campaign" />
                  </div>
                </div>
                
                <div className="space-y-4 border-b pb-6">
                  <h3 className="text-lg font-medium font-headline">2. Audience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="targetSegment" className="text-left md:text-right">Target</Label>
                      <Select value={editingCampaign.targetSegment[0]} onValueChange={(value) => handleFieldChange('targetSegment', [value])}>
                          <SelectTrigger className="col-span-1 md:col-span-3">
                              <SelectValue placeholder="Select segment" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="All Customers">All Customers</SelectItem>
                              <SelectItem value="High Spenders">High Spenders</SelectItem>
                              <SelectItem value="Recent Visitors">Recent Visitors</SelectItem>
                              <SelectItem value="Lapsed Customers">Lapsed Customers</SelectItem>
                              <SelectItem value="New Customers">New Customers</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                </div>

                <div className="space-y-4 border-b pb-6">
                  <h3 className="text-lg font-medium font-headline">3. Content</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-left md:text-right">Title</Label>
                      <Input id="title" value={editingCampaign.title} onChange={(e) => handleFieldChange('title', e.target.value)} className="col-span-1 md:col-span-3" placeholder="e.g. We've missed you!" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <Label htmlFor="message" className="text-left md:text-right pt-2">Message</Label>
                      <Textarea id="message" value={editingCampaign.message} onChange={(e) => handleFieldChange('message', e.target.value)} className="col-span-1 md:col-span-3" rows={4} placeholder="Use {customerName} for personalization." />
                  </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="onClickAction" className="text-left md:text-right">On Click Action</Label>
                      <Select value={editingCampaign.onClickAction.type} onValueChange={(value: Campaign['onClickAction']['type']) => handleActionFieldChange('type', value)}>
                          <SelectTrigger className="col-span-1 md:col-span-3">
                              <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="Link to Product">Link to Product</SelectItem>
                              <SelectItem value="Link to Voucher">Link to Voucher</SelectItem>
                              <SelectItem value="Custom Web Link">Custom Web Link</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                    {editingCampaign.onClickAction.type !== 'None' && (
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                          <Label htmlFor="actionValue" className="text-left md:text-right">Action Value</Label>                          <Input id="actionValue" value={editingCampaign.onClickAction.value} onChange={(e) => handleActionFieldChange('value', e.target.value)} className="col-span-1 md:col-span-3" placeholder="Product ID, Voucher Code, or URL" />
                      </div>
                    )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium font-headline">4. Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-left md:text-right">Status</Label>
                      <Select value={editingCampaign.status} onValueChange={(value: Campaign['status']) => handleFieldChange('status', value)}>
                          <SelectTrigger className="col-span-1 md:col-span-2">
                              <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  {editingCampaign.status === 'Scheduled' && (
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                          <Label htmlFor="scheduleDate" className="text-left md:text-right">Schedule Date</Label>
                          <Input 
                              id="scheduleDate" 
                              type="datetime-local" 
                              value={editingCampaign.scheduleDate ? editingCampaign.scheduleDate.substring(0,16) : ''}
                              onChange={(e) => handleFieldChange('scheduleDate', e.target.value ? new Date(e.target.value).toISOString() : null)} 
                              className="col-span-1 md:col-span-2" />
                      </div>
                  )}
                </div>
              </div>
            </ScrollArea>
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
