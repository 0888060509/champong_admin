
'use client';

import React, 'useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Trash2, GripVertical, Copy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMenuItems, mockOptionGroups } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import type { MenuItem, OptionGroup, MenuOption } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('items');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>(mockOptionGroups);
  
  const [isOptionGroupFormOpen, setOptionGroupFormOpen] = useState(false);
  const [editingOptionGroup, setEditingOptionGroup] = useState<OptionGroup | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();

  // Menu Item Handlers
  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    toast({ title: 'Success', description: 'Menu item deleted.', variant: 'destructive' });
  };
  
  const handleDuplicateItem = (itemId: string) => {
    const itemToDuplicate = menuItems.find(item => item.id === itemId);
    if (itemToDuplicate) {
        // By setting the state and navigating, the new page will pick it up
        router.push(`/menu/new?duplicateId=${itemId}`);
    }
  };

  // Option Group Handlers
  const handleOpenOptionGroupForm = (group: OptionGroup | null = null) => {
    setEditingOptionGroup(group ? JSON.parse(JSON.stringify(group)) : null);
    setOptionGroupFormOpen(true);
  };
  
  const handleSaveOptionGroup = (groupData: OptionGroup) => {
    if (groupData.id && optionGroups.some(g => g.id === groupData.id)) {
        setOptionGroups(optionGroups.map(g => g.id === groupData.id ? groupData : g));
        toast({ title: "Success", description: `Option group "${groupData.name}" updated.`});
    } else {
        const newGroup = { ...groupData, id: `OG${Date.now()}`};
        setOptionGroups(prev => [newGroup, ...prev]);
        toast({ title: "Success", description: `Option group "${groupData.name}" created.`});
    }
    setOptionGroupFormOpen(false);
    setEditingOptionGroup(null);
  };
  
  const handleDeleteOptionGroup = (groupId: string) => {
      setOptionGroups(prev => prev.filter(g => g.id !== groupId));
      toast({ title: "Success", description: "Option group deleted.", variant: "destructive" });
  };


  return (
    <>
      <Tabs defaultValue="items" onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
              <TabsList>
                  <TabsTrigger value="items">Menu Items</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="options">Option Groups</TabsTrigger>
              </TabsList>
              {activeTab === 'items' ? (
                <Button asChild>
                  <Link href="/menu/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                  </Link>
                </Button>
              ) : (
                <Button onClick={() => handleOpenOptionGroupForm()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {activeTab === 'options' ? 'Add Group' : 'Add Category'}
                </Button>
              )}
          </div>
          <TabsContent value="items">
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline">Menu Items</CardTitle>
                      <CardDescription>Manage your menu items and their options.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead className="w-16">Image</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Options</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead><span className="sr-only">Actions</span></TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {menuItems.map((item) => (
                          <TableRow key={item.id}>
                              <TableCell>
                                  <Image
                                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/64/64`}
                                      alt={item.name}
                                      width={64}
                                      height={64}
                                      className="rounded-md object-cover"
                                      data-ai-hint="food item"
                                  />
                              </TableCell>
                              <TableCell className="font-medium">
                                  <Link href={`/menu/${item.id}/edit`} className="font-medium hover:underline">{item.name}</Link>
                                  <div className="text-sm text-muted-foreground">{item.description}</div>
                              </TableCell>
                              <TableCell>{item.category}</TableCell>
                               <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {item.optionGroups?.map(og => (
                                    <Badge key={og.id} variant="secondary">{og.name}</Badge>
                                  ))}
                                  </div>
                              </TableCell>
                              <TableCell>
                                  <Badge variant={item.isActive ? 'default' : 'secondary'}>
                                      {item.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                              </TableCell>
                              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                      <Button aria-haspopup="true" size="icon" variant="ghost">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Toggle menu</span>
                                      </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <Link href={`/menu/${item.id}/edit`} passHref>
                                          <DropdownMenuItem>Edit</DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem onClick={() => handleDuplicateItem(item.id)}>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-destructive">Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                          ))}
                      </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="categories">
               <Card>
                  <CardHeader>
                      <CardTitle className="font-headline">Menu Categories</CardTitle>
                      <CardDescription>Organize your menu with categories.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p>Category management interface will be here.</p>
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="options">
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline">Option Groups</CardTitle>
                      <CardDescription>Manage reusable groups of options (like sizes, toppings) to apply to menu items.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                      {optionGroups.map(group => (
                          <Card key={group.id}>
                            <CardHeader className="flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="font-headline text-lg">{group.name}</CardTitle>
                                    <CardDescription>Type: <Badge variant="outline">{group.type}</Badge></CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenOptionGroupForm(group)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteOptionGroup(group.id)} className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                              <CardContent>
                                  <Table>
                                      <TableHeader>
                                          <TableRow>
                                              <TableHead>Option Name</TableHead>
                                              <TableHead className="text-right">Price Adjustment</TableHead>
                                          </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                          {group.options.map(option => (
                                              <TableRow key={option.id}>
                                                  <TableCell>{option.name}</TableCell>
                                                  <TableCell className="text-right">
                                                      {option.priceAdjustment >= 0 ? `+$${option.priceAdjustment.toFixed(2)}` : `-$${Math.abs(option.priceAdjustment).toFixed(2)}`}
                                                  </TableCell>
                                              </TableRow>
                                          ))}
                                      </TableBody>
                                  </Table>
                              </CardContent>
                          </Card>
                      ))}
                  </CardContent>
              </Card>
          </TabsContent>
      </Tabs>
      
      {/* Option Group Form Dialog */}
      <Dialog open={isOptionGroupFormOpen} onOpenChange={setOptionGroupFormOpen}>
          <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                  <DialogTitle className="font-headline">{editingOptionGroup ? 'Edit Option Group' : 'Create New Option Group'}</DialogTitle>
                  <DialogDescription>
                     Define a reusable group of options for your products.
                  </DialogDescription>
              </DialogHeader>
              <OptionGroupForm
                key={editingOptionGroup?.id}
                initialData={editingOptionGroup}
                onSave={handleSaveOptionGroup}
                onCancel={() => setOptionGroupFormOpen(false)}
              />
          </DialogContent>
      </Dialog>
    </>
  );
}

// Option Group Form Component
function OptionGroupForm({
    initialData,
    onSave,
    onCancel
}: {
    initialData: OptionGroup | null,
    onSave: (data: OptionGroup) => void,
    onCancel: () => void,
}) {
    const [group, setGroup] = useState<OptionGroup>(
        initialData || { id: '', name: '', type: 'single', options: [] }
    );

    const handleGroupChange = (field: keyof OptionGroup, value: any) => {
        setGroup(prev => ({ ...prev, [field]: value }));
    };

    const handleOptionChange = (optionId: string, field: keyof MenuOption, value: any) => {
        const newOptions = group.options.map(opt => {
            if (opt.id === optionId) {
                const newValue = field === 'priceAdjustment' ? parseFloat(value) || 0 : value;
                return { ...opt, [field]: newValue };
            }
            return opt;
        });
        handleGroupChange('options', newOptions);
    };

    const addOption = () => {
        const newOption: MenuOption = {
            id: `opt_${Date.now()}`,
            name: '',
            priceAdjustment: 0,
        };
        handleGroupChange('options', [...group.options, newOption]);
    };

    const removeOption = (optionId: string) => {
        handleGroupChange('options', group.options.filter(opt => opt.id !== optionId));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(group);
    }

    return (
        <form onSubmit={handleSubmit}>
            <ScrollArea className="max-h-[60vh] pr-6">
                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Group Name</Label>
                            <Input
                                id="group-name"
                                placeholder="e.g., Size, Toppings"
                                value={group.name}
                                onChange={(e) => handleGroupChange('name', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="group-type">Selection Type</Label>
                            <Select
                                value={group.type}
                                onValueChange={(value: 'single' | 'multiple') => handleGroupChange('type', value)}
                            >
                                <SelectTrigger id="group-type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">Single Choice (for Sizes, Sugar Level)</SelectItem>
                                    <SelectItem value="multiple">Multiple Choice (for Toppings)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-headline">Options</CardTitle>
                                    <CardDescription className="text-xs">Define the choices within this group.</CardDescription>
                                </div>
                                <Button type="button" size="sm" variant="outline" onClick={addOption}>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Add Option
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {group.options.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No options yet. Add one to get started.</p>
                            ) : (
                                group.options.map((option) => (
                                    <div key={option.id} className="flex items-center gap-2">
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Option Name (e.g., Large)"
                                            value={option.name}
                                            onChange={(e) => handleOptionChange(option.id, 'name', e.target.value)}
                                            required
                                        />
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="pl-6 w-32"
                                                placeholder="0.00"
                                                value={option.priceAdjustment}
                                                onChange={(e) => handleOptionChange(option.id, 'priceAdjustment', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeOption(option.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
             <DialogFooter className="pt-6 border-t">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Group</Button>
            </DialogFooter>
        </form>
    );
}
