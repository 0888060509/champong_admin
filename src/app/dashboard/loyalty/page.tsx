

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
import type { Tier, StampCardConfig, Reward } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

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
        maxSpend: null,
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

const initialRewards: Reward[] = [
    { id: 'rew-1', title: 'Free Coffee', description: 'Any regular coffee on the menu.', pointsCost: 50 },
    { id: 'rew-2', title: '$5 Off Voucher', description: 'Get $5 off your next purchase.', pointsCost: 100 },
];

const initialRewardState: Reward = {
    id: '',
    title: '',
    description: '',
    pointsCost: 0,
};

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState('tiers');
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [stampConfig, setStampConfig] = useState<StampCardConfig>({ isEnabled: true, stampsNeeded: 10, reward: 'Free Pastry' });
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);

  const [isTierDialogOpen, setTierDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [newBenefit, setNewBenefit] = useState('');
  
  const [isRewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const { toast } = useToast();

  // Tier Management
  const handleOpenTierDialog = (tier: Tier | null = null) => {
    if (tier) {
        setEditingTier({ ...tier, benefits: [...tier.benefits] });
    } else {
        setEditingTier({ ...initialTierState, id: `tier-${Date.now()}`, benefits: [] });
    }
    setTierDialogOpen(true);
  };
  
  const handleDeleteTier = (tierId: string) => {
      setTiers(tiers.filter(t => t.id !== tierId));
      toast({ title: "Success", description: "Tier deleted successfully." });
  }

  const handleSaveTier = () => {
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

    setTierDialogOpen(false);
    setEditingTier(null);
  };

  const handleTierFieldChange = (field: keyof Tier, value: any) => {
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
  
  // Stamp Config Management
  const handleStampConfigChange = (field: keyof StampCardConfig, value: any) => {
      setStampConfig(prev => ({ ...prev, [field]: value }));
  }

  const handleSaveStampConfig = () => {
      toast({ title: 'Success', description: 'Stamp card settings saved.' });
  }

  // Reward Management
  const handleOpenRewardDialog = (reward: Reward | null = null) => {
      setEditingReward(reward ? { ...reward } : { ...initialRewardState, id: `rew-${Date.now()}` });
      setRewardDialogOpen(true);
  }

  const handleSaveReward = () => {
      if (!editingReward || !editingReward.title) {
          toast({ title: 'Error', description: 'Reward title is required.', variant: 'destructive' });
          return;
      }
      
      if (rewards.some(r => r.id === editingReward.id)) {
          setRewards(rewards.map(r => r.id === editingReward.id ? editingReward : r));
          toast({ title: 'Success', description: 'Reward updated successfully.'});
      } else {
          setRewards([...rewards, editingReward]);
          toast({ title: 'Success', description: 'Reward added successfully.'});
      }
      setRewardDialogOpen(false);
      setEditingReward(null);
  }

  const handleDeleteReward = (rewardId: string) => {
      setRewards(rewards.filter(r => r.id !== rewardId));
      toast({ title: 'Success', description: 'Reward deleted successfully.'});
  }

  const handleRewardFieldChange = (field: keyof Reward, value: any) => {
      if (editingReward) {
          setEditingReward({ ...editingReward, [field]: value });
      }
  }


  return (
    <>
      <Tabs defaultValue="tiers" onValueChange={setActiveTab}>
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
           <Button onClick={() => activeTab === 'tiers' ? handleOpenTierDialog() : handleOpenRewardDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> 
              {activeTab === 'tiers' ? 'Add Tier' : activeTab === 'rewards' ? 'Add Reward' : ''}
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
                            <Button variant="outline" onClick={() => handleOpenTierDialog(tier)}>Edit</Button>
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
              <CardDescription>Configure how customers collect loyalty stamps via a digital stamp card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Switch id="stamp-enabled" checked={stampConfig.isEnabled} onCheckedChange={(val) => handleStampConfigChange('isEnabled', val)} />
                    <Label htmlFor="stamp-enabled">Enable Stamp Card</Label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="stamps-needed">Stamps Needed</Label>
                        <Input id="stamps-needed" type="number" value={stampConfig.stampsNeeded} onChange={(e) => handleStampConfigChange('stampsNeeded', Number(e.target.value))} />
                        <p className="text-sm text-muted-foreground">Number of stamps to complete one card.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stamp-reward">Reward</Label>
                        <Input id="stamp-reward" value={stampConfig.reward} onChange={(e) => handleStampConfigChange('reward', e.target.value)} />
                        <p className="text-sm text-muted-foreground">Reward for completing a stamp card.</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveStampConfig}>Save Stamp Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Redeemable Rewards</CardTitle>
              <CardDescription>Manage loyalty rewards that can be redeemed with points.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rewards.map((reward) => (
                <Card key={reward.id}>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="font-headline text-lg">{reward.title}</CardTitle>
                            <CardDescription>{reward.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{reward.pointsCost} Points</Badge>
                            <Button variant="outline" size="sm" onClick={() => handleOpenRewardDialog(reward)}>Edit</Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteReward(reward.id)}>
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Delete Reward</span>
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tier Dialog */}
      <Dialog open={isTierDialogOpen} onOpenChange={setTierDialogOpen}>
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
                <Input id="name" value={editingTier.name} onChange={(e) => handleTierFieldChange('name', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input id="description" value={editingTier.description} onChange={(e) => handleTierFieldChange('description', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minSpend" className="text-right">Min Spend</Label>
                <Input id="minSpend" type="number" value={editingTier.minSpend} onChange={(e) => handleTierFieldChange('minSpend', Number(e.target.value))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxSpend" className="text-right">Max Spend</Label>
                <Input id="maxSpend" type="number" placeholder="Leave blank for no upper limit" value={editingTier.maxSpend ?? ''} onChange={(e) => handleTierFieldChange('maxSpend', e.target.value === '' ? null : Number(e.target.value))} className="col-span-3" />
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
            <Button variant="ghost" onClick={() => setTierDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTier}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reward Dialog */}
      <Dialog open={isRewardDialogOpen} onOpenChange={setRewardDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingReward?.id && rewards.some(r => r.id === editingReward.id) ? 'Edit Reward' : 'Add New Reward'}</DialogTitle>
            <DialogDescription>
              Set up a reward that customers can redeem with loyalty points.
            </DialogDescription>
          </DialogHeader>
          {editingReward && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward-title" className="text-right">Title</Label>
                <Input id="reward-title" value={editingReward.title} onChange={(e) => handleRewardFieldChange('title', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="reward-desc" className="text-right pt-2">Description</Label>
                <Textarea id="reward-desc" value={editingReward.description} onChange={(e) => handleRewardFieldChange('description', e.target.value)} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward-points" className="text-right">Points Cost</Label>
                <Input id="reward-points" type="number" value={editingReward.pointsCost} onChange={(e) => handleRewardFieldChange('pointsCost', Number(e.target.value))} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRewardDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveReward}>Save Reward</Button>
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

    