
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gem, Stamp, Trophy, PlusCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Tier } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

const initialTiers: Tier[] = [
    {
        id: 'tier-bronze',
        name: 'Bronze',
        description: 'Entry-level tier',
        minSpend: 0,
        maxSpend: 499,
        benefits: ['5% off']
    },
    {
        id: 'tier-silver',
        name: 'Silver',
        description: 'Intermediate tier',
        minSpend: 500,
        maxSpend: 1999,
        benefits: ['10% off', 'Free Drink on Birthday']
    },
    {
        id: 'tier-gold',
        name: 'Gold',
        description: 'Top tier',
        minSpend: 2000,
        benefits: ['15% off', 'Free Meal on Birthday', 'Priority Booking']
    }
];

const initialTierState: Tier = {
    id: '',
    name: '',
    description: '',
    minSpend: 0,
    maxSpend: 0,
    benefits: []
};

export default function LoyaltyPage() {
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [newBenefit, setNewBenefit] = useState('');
  const { toast } = useToast();

  const handleOpenDialog = (tier: Tier | null = null) => {
    if (tier) {
        setEditingTier({ ...tier, benefits: [...tier.benefits] });
    } else {
        setEditingTier({ ...initialTierState, id: `tier-${Date.now()}`, benefits: [] });
    }
    setIsDialogOpen(true);
  };
  
  const handleDeleteTier = (tierId: string) => {
      setTiers(tiers.filter(t => t.id !== tierId));
      toast({ title: "Success", description: "Tier deleted successfully." });
  }

  const handleSaveChanges = () => {
    if (!editingTier || !editingTier.name) {
      toast({ title: "Error", description: "Tier name is required.", variant: 'destructive' });
      return;
    }
    
    if (tiers.some(t => t.id === editingTier.id)) {
      setTiers(tiers.map(t => t.id === editingTier.id ? editingTier : t));
      toast({ title: "Success", description: "Tier updated successfully." });
    } else {
      setTiers([...tiers, editingTier]);
      toast({ title: "Success", description: "Tier added successfully." });
    }

    setIsDialogOpen(false);
    setEditingTier(null);
  };

  const handleFieldChange = (field: keyof Tier, value: any) => {
    if (editingTier) {
      setEditingTier({ ...editingTier, [field]: value });
    }
  };
  
  const handleAddBenefit = () => {
    if (editingTier && newBenefit.trim()) {
        const updatedBenefits = [...(editingTier.benefits || []), newBenefit.trim()];
        setEditingTier({ ...editingTier, benefits: updatedBenefits });
        setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove: string) => {
    if (editingTier) {
        const updatedBenefits = editingTier.benefits.filter(b => b !== benefitToRemove);
        setEditingTier({ ...editingTier, benefits: updatedBenefits });
    }
  };

  return (
    <>
      <Tabs defaultValue="tiers">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="tiers">
              <Gem className="mr-2 h-4 w-4" />
              Member Tiers
            </TabsTrigger>
            <TabsTrigger value="stamps">
              <Stamp className="mr-2 h-4 w-4" />
              Stamps
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Trophy className="mr-2 h-4 w-4" />
              Rewards
            </TabsTrigger>
          </TabsList>
           <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Tier
            </Button>
        </div>

        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Loyalty and Member Tier Configuration</CardTitle>
              <CardDescription>Manage member tiers and their associated benefits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tiers.map((tier) => (
                <Card key={tier.id}>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="font-headline text-lg">{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleOpenDialog(tier)}>Edit</Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteTier(tier.id)}>
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            Spend <span className="font-bold">${tier.minSpend} - ${tier.maxSpend ?? '+'}</span> to be in this tier.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {tier.benefits.map((benefit, index) => (
                                <Badge key={index} variant="secondary">{benefit}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stamps">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Loyalty Stamp Configuration</CardTitle>
              <CardDescription>Configure how customers collect loyalty stamps.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Stamp configuration settings will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Loyalty Rewards Configuration</CardTitle>
              <CardDescription>Manage loyalty rewards that can be redeemed with points or stamps.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Rewards configuration settings will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingTier?.id && tiers.some(t => t.id === editingTier.id) ? 'Edit Tier' : 'Add New Tier'}</DialogTitle>
            <DialogDescription>
              Fill in the details for the loyalty tier.
            </DialogDescription>
          </DialogHeader>
          {editingTier && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={editingTier.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input id="description" value={editingTier.description} onChange={(e) => handleFieldChange('description', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minSpend" className="text-right">Min Spend</Label>
                <Input id="minSpend" type="number" value={editingTier.minSpend} onChange={(e) => handleFieldChange('minSpend', Number(e.target.value))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxSpend" className="text-right">Max Spend</Label>
                <Input id="maxSpend" type="number" placeholder="Leave blank for no upper limit" value={editingTier.maxSpend ?? ''} onChange={(e) => handleFieldChange('maxSpend', e.target.value === '' ? null : Number(e.target.value))} className="col-span-3" />
              </div>
              
               <div className="grid grid-cols-4 items-start gap-4">
                 <Label className="text-right pt-2">Benefits</Label>
                 <div className="col-span-3 space-y-2">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g., 10% off"
                            value={newBenefit}
                            onChange={(e) => setNewBenefit(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddBenefit()}
                        />
                        <Button type="button" onClick={handleAddBenefit}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {editingTier.benefits.map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {benefit}
                                <button onClick={() => handleRemoveBenefit(benefit)} className="ml-1 rounded-full hover:bg-destructive/20 text-destructive">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
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

// Add X icon for benefit removal
const X = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
    </svg>
)
