
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { mockBanners } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Banner } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialBannerState: Banner = {
    id: '',
    title: '',
    imageUrl: '',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    linkType: 'url',
    link: ''
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (banner: Banner | null = null) => {
    setEditingBanner(banner ? { ...banner } : { ...initialBannerState, id: `BNR${Date.now()}` });
    setIsDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingBanner) return;

    if (editingBanner && !editingBanner.title) {
        toast({ title: 'Error', description: 'Banner title is required.', variant: 'destructive' });
        return;
    }

    if (editingBanner.id && banners.some(b => b.id === editingBanner.id)) {
      // Edit
      setBanners(banners.map(b => b.id === editingBanner.id ? editingBanner : b));
      toast({ title: 'Success', description: 'Banner updated successfully.' });
    } else {
      // Add
      setBanners([...banners, editingBanner]);
      toast({ title: 'Success', description: 'Banner added successfully.' });
    }
    
    setIsDialogOpen(false);
    setEditingBanner(null);
  };
  
  const handleDelete = (bannerId: string) => {
      setBanners(banners.filter(b => b.id !== bannerId));
      toast({ title: 'Success', description: 'Banner deleted successfully.' });
  }

  const handleFieldChange = (field: keyof Banner, value: any) => {
    if (editingBanner) {
      setEditingBanner({ ...editingBanner, [field]: value });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Advertising Banners</CardTitle>
            <CardDescription>Manage advertisement banners for the user-facing app.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Banner
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent className="p-4 flex flex-col md:flex-row items-start gap-4">
                <Image 
                  src={banner.imageUrl || `https://picsum.photos/seed/${banner.id}/300/120`}
                  alt={banner.title} 
                  width={300} 
                  height={120} 
                  className="rounded-md object-cover aspect-[2.5/1]"
                  data-ai-hint="advertisement banner"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold font-headline">{banner.title}</h3>
                      <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Visible from {banner.startDate} to {banner.endDate}
                  </p>
                   <p className="text-sm text-muted-foreground truncate">
                    Link: {banner.link} ({banner.linkType})
                  </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(banner)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(banner.id)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingBanner?.id && banners.some(b => b.id === editingBanner.id) ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            <DialogDescription>
              Fill in the details for the advertising banner.
            </DialogDescription>
          </DialogHeader>
          {editingBanner && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={editingBanner.title} onChange={(e) => handleFieldChange('title', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                <Input id="imageUrl" value={editingBanner.imageUrl} onChange={(e) => handleFieldChange('imageUrl', e.target.value)} className="col-span-3" placeholder="https://picsum.photos/seed/..."/>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkType" className="text-right">Link Type</Label>
                <Select value={editingBanner.linkType} onValueChange={(value) => handleFieldChange('linkType', value)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="url">External URL</SelectItem>
                        <SelectItem value="deeplink">Deeplink</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link" className="text-right">Link</Label>
                <Input id="link" value={editingBanner.link} onChange={(e) => handleFieldChange('link', e.target.value)} className="col-span-3" placeholder={editingBanner.linkType === 'url' ? 'https://example.com' : 'app://screen/123'} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Input id="startDate" type="date" value={editingBanner.startDate} onChange={(e) => handleFieldChange('startDate', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                <Input id="endDate" type="date" value={editingBanner.endDate} onChange={(e) => handleFieldChange('endDate', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">Active</Label>
                <div className="col-span-3 flex items-center">
                    <Switch id="isActive" checked={editingBanner.isActive} onCheckedChange={(checked) => handleFieldChange('isActive', checked)} />
                </div>
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
