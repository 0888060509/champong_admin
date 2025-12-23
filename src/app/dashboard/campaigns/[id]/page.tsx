


'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Campaign } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useCampaigns } from '../campaigns-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCollections } from '@/lib/mock-data';


export default function CampaignDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;
    const { getCampaignById, updateCampaign } = useCampaigns();
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!campaignId) return;
        const foundCampaign = getCampaignById(campaignId);
        if (foundCampaign) {
            setCampaign(foundCampaign);
        } else {
            console.log("Campaign not found!");
        }
    }, [campaignId, getCampaignById]);

    const handleOpenDialog = () => {
        if (!campaign) return;
        setEditingCampaign({ ...campaign });
        setIsDialogOpen(true);
    };

    const handleSaveChanges = () => {
        if (!editingCampaign) return;
        updateCampaign(editingCampaign);
        setCampaign(editingCampaign); // Update local state immediately
        setIsDialogOpen(false);
        setEditingCampaign(null);
    };

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
    
    const handleStatusChange = (newStatus: Campaign['status']) => {
        if (campaign) {
            const updated = {...campaign, status: newStatus};
            updateCampaign(updated);
            setCampaign(updated);
            toast({ title: 'Status Updated', description: `Campaign status set to ${newStatus}`});
        }
    }


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

    if (!campaign) {
        return <div>Loading campaign details...</div>;
    }

    return (
        <>
            <div className="grid gap-6">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <CardTitle className="font-headline">{campaign.name}</CardTitle>
                        <CardDescription>{campaign.description || 'No description available.'}</CardDescription>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={handleOpenDialog}>Edit</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">More actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {(campaign.status === 'Scheduled' || campaign.status === 'Sending') && (
                                    <DropdownMenuItem onClick={() => handleStatusChange('Draft')}>Pause (Set to Draft)</DropdownMenuItem>
                                )}
                                {campaign.status === 'Scheduled' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange('Canceled')} className="text-destructive">Cancel</DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                {getStatusBadge(campaign.status)}
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Sent</p>
                                <p className="text-2xl font-bold">{campaign.sentCount.toLocaleString()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Open Rate</p>
                                    <p className="text-2xl font-bold">{(campaign.openRate * 100).toFixed(1)}%</p>
                                </div>
                                 <div>
                                    <p className="text-sm text-muted-foreground">CTR</p>
                                    <p className="text-2xl font-bold">{(campaign.ctr * 100).toFixed(1)}%</p>
                                </div>
                            </div>
                             {campaign.redemptionRate !== undefined && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Redemption Rate</p>
                                    <p className="text-2xl font-bold">{(campaign.redemptionRate * 100).toFixed(1)}%</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold">Target Segment</p>
                                <p className="text-sm text-muted-foreground">{campaign.targetSegment.join(', ')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Schedule</p>
                                <p className="text-sm text-muted-foreground">
                                    {campaign.scheduleDate ? new Date(campaign.scheduleDate).toLocaleString() : 'Not scheduled'}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-semibold">Notification Title</p>
                                <p className="text-sm text-muted-foreground">{campaign.title}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Notification Message</p>
                                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{campaign.message}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">On Click Action</p>
                                <p className="text-sm text-muted-foreground">
                                    {campaign.onClickAction.type}
                                    {campaign.onClickAction.value && ` -> ${campaign.onClickAction.value}`}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {campaign.performanceData && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Performance Over Time (First 24h)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={campaign.performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" label={{ value: 'Hour after sending', position: 'insideBottom', offset: -5 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="opens" stroke="hsl(var(--primary))" name="Opens" />
                                    <Line type="monotone" dataKey="clicks" stroke="hsl(var(--accent))" name="Clicks" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-headline">Edit Campaign</DialogTitle>
                    <DialogDescription>
                    Make changes to your notification campaign.
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
                                    <SelectItem value="Link to Collection">Link to Collection</SelectItem>
                                    <SelectItem value="Custom Web Link">Custom Web Link</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                            {editingCampaign.onClickAction.type === 'Link to Collection' ? (
                                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                    <Label htmlFor="actionValue" className="text-left md:text-right">Collection</Label>
                                    <Select value={editingCampaign.onClickAction.value} onValueChange={(value) => handleActionFieldChange('value', value)}>
                                        <SelectTrigger className="col-span-1 md:col-span-3">
                                            <SelectValue placeholder="Select a collection" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockCollections.map(collection => (
                                                <SelectItem key={collection.id} value={collection.id}>{collection.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : editingCampaign.onClickAction.type !== 'None' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                <Label htmlFor="actionValue" className="text-left md:text-right">Action Value</Label>
                                <Input id="actionValue" value={editingCampaign.onClickAction.value} onChange={(e) => handleActionFieldChange('value', e.target.value)} className="col-span-1 md:col-span-3" placeholder="Product ID, Voucher Code, or URL" />
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
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

    