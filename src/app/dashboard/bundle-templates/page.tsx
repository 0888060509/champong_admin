

'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash2, GripVertical, Settings, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { BundleTemplate, BundleSlot, SlotItem } from '@/lib/types';
import { mockBundleTemplates, mockMenuItems } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function BundleTemplatesPage() {
  const [templates, setTemplates] = useState<BundleTemplate[]>(mockBundleTemplates);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BundleTemplate | null>(null);
  const { toast } = useToast();

  const openForm = (template: BundleTemplate | null = null) => {
    setEditingTemplate(template ? JSON.parse(JSON.stringify(template)) : null);
    setFormOpen(true);
  };
  
  const handleSaveTemplate = (template: BundleTemplate) => {
    if (editingTemplate) {
        setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        toast({ title: "Success", description: "Bundle template updated."});
    } else {
        const newTemplate = { ...template, id: `BT${Date.now()}`};
        setTemplates(prev => [newTemplate, ...prev]);
        toast({ title: "Success", description: "Bundle template created."});
    }
    setFormOpen(false);
    setEditingTemplate(null);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({ title: "Template Deleted", variant: 'destructive' });
  };
  
  const duplicateTemplate = (template: BundleTemplate) => {
      const newTemplate = JSON.parse(JSON.stringify(template));
      newTemplate.id = `BT${Date.now()}`;
      newTemplate.name = `Copy of ${template.name}`;
      setTemplates(prev => [newTemplate, ...prev]);
      toast({ title: "Template Duplicated" });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Bundle Templates</CardTitle>
            <CardDescription>Create and manage reusable templates for flexible "Build-Your-Own" combos.</CardDescription>
          </div>
          <Button onClick={() => openForm()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Template
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Base Price</TableHead>
                <TableHead className="text-right">Slots</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map(template => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">
                    <button onClick={() => openForm(template)} className="hover:underline text-primary">
                        {template.name}
                    </button>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${template.basePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{template.slots.length}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openForm(template)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateTemplate(template)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteTemplate(template.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingTemplate ? 'Edit Bundle Template' : 'Create New Bundle Template'}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? 'Modify the structure of this bundle.' : 'Define a new flexible combo for customers to build.'}
            </DialogDescription>
          </DialogHeader>
          <BundleTemplateForm
            key={editingTemplate?.id}
            initialData={editingTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}


function BundleTemplateForm({
    initialData,
    onSave,
    onCancel
}: {
    initialData: BundleTemplate | null,
    onSave: (data: BundleTemplate) => void,
    onCancel: () => void,
}) {
    const [template, setTemplate] = useState<BundleTemplate>(
        initialData || { id: '', name: '', basePrice: 0, slots: [], isActive: true }
    );

    const handleTemplateChange = (field: keyof BundleTemplate, value: any) => {
        setTemplate(prev => ({ ...prev, [field]: value }));
    };

    const addSlot = () => {
        const newSlot: BundleSlot = {
            id: `slot_${Date.now()}`,
            name: 'New Slot',
            minSelection: 1,
            maxSelection: 1,
            items: [],
        };
        handleTemplateChange('slots', [...template.slots, newSlot]);
    };

    const removeSlot = (slotId: string) => {
        handleTemplateChange('slots', template.slots.filter(s => s.id !== slotId));
    };

    const handleSlotChange = (slotId: string, field: keyof BundleSlot, value: any) => {
        const newSlots = template.slots.map(s => {
            if (s.id === slotId) {
                return { ...s, [field]: value };
            }
            return s;
        });
        handleTemplateChange('slots', newSlots);
    };

    const handleSlotItemChange = (slotId: string, itemId: string, field: keyof SlotItem, value: any) => {
        const newSlots = template.slots.map(s => {
            if (s.id === slotId) {
                const newItems = s.items.map(i => {
                    if (i.id === itemId) {
                        return { ...i, [field]: value };
                    }
                    return i;
                });
                return { ...s, items: newItems };
            }
            return s;
        });
        handleTemplateChange('slots', newSlots);
    };
    
    const addSlotItem = (slotId: string, menuItem: typeof mockMenuItems[0]) => {
        const newSlotItem: SlotItem = { id: menuItem.id, name: menuItem.name, upcharge: 0 };
        const newSlots = template.slots.map(s => {
            if (s.id === slotId) {
                // Avoid adding duplicates
                if (s.items.some(i => i.id === newSlotItem.id)) return s;
                return { ...s, items: [...s.items, newSlotItem] };
            }
            return s;
        });
        handleTemplateChange('slots', newSlots);
    }
    
    const removeSlotItem = (slotId: string, itemId: string) => {
        const newSlots = template.slots.map(s => {
            if (s.id === slotId) {
                return { ...s, items: s.items.filter(i => i.id !== itemId) };
            }
            return s;
        });
        handleTemplateChange('slots', newSlots);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(template);
    }

    return (
        <form onSubmit={handleSubmit}>
            <ScrollArea className="max-h-[70vh] pr-6">
                <div className="space-y-6 py-4">
                    {/* General Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">General Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="template-name">Template Name</Label>
                                    <Input id="template-name" placeholder="e.g., Lunch Special" value={template.name} onChange={(e) => handleTemplateChange('name', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="base-price">Base Price</Label>
                                    <Input id="base-price" type="number" step="0.01" value={template.basePrice} onChange={(e) => handleTemplateChange('basePrice', parseFloat(e.target.value) || 0)} required />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="template-desc">Description (Optional)</Label>
                                <Input id="template-desc" placeholder="Internal description for this template." value={template.description} onChange={(e) => handleTemplateChange('description', e.target.value)} />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch id="template-active" checked={template.isActive} onCheckedChange={(val) => handleTemplateChange('isActive', val)} />
                                <Label htmlFor="template-active">Template is Active</Label>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Slots */}
                    <div className="space-y-4">
                        <h3 className="font-headline text-lg">Bundle Slots</h3>
                        {template.slots.map(slot => (
                            <Card key={slot.id} className="bg-muted/30">
                                <CardHeader>
                                     <div className="flex items-start justify-between">
                                        <div className="flex-1 mr-4 space-y-2">
                                            <Label htmlFor={`slot-name-${slot.id}`}>Slot Name</Label>
                                            <Input id={`slot-name-${slot.id}`} value={slot.name} onChange={e => handleSlotChange(slot.id, 'name', e.target.value)} className="text-base font-semibold" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <div className="flex items-center gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`slot-min-${slot.id}`}>Min</Label>
                                                    <Input id={`slot-min-${slot.id}`} type="number" value={slot.minSelection} onChange={e => handleSlotChange(slot.id, 'minSelection', parseInt(e.target.value) || 0)} className="w-20" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`slot-max-${slot.id}`}>Max</Label>
                                                    <Input id={`slot-max-${slot.id}`} type="number" value={slot.maxSelection} onChange={e => handleSlotChange(slot.id, 'maxSelection', parseInt(e.target.value) || 0)} className="w-20" />
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSlot(slot.id)} className="text-destructive self-end"><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                     </div>
                                     <CardDescription>
                                        Set the minimum and maximum number of items a customer must/can select for this slot. Set Min to 0 for optional.
                                     </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Label>Selectable Items</Label>
                                    <div className="mt-2 space-y-2">
                                        {slot.items.length > 0 && (
                                            <div className="border rounded-md">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Product</TableHead>
                                                            <TableHead className="w-40">Upcharge</TableHead>
                                                            <TableHead className="w-16 text-right">Action</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {slot.items.map(item => (
                                                            <TableRow key={item.id}>
                                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                                <TableCell>
                                                                    <Input type="number" step="0.01" value={item.upcharge} onChange={e => handleSlotItemChange(slot.id, item.id, 'upcharge', parseFloat(e.target.value) || 0)} className="h-8" />
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSlotItem(slot.id, item.id)}><Trash2 className="h-4 w-4 text-destructive/70" /></Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                        <ProductSelector availableItems={mockMenuItems.filter(mi => !slot.items.some(si => si.id === mi.id))} onSelect={menuItem => addSlotItem(slot.id, menuItem)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Button type="button" variant="outline" onClick={addSlot}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Slot
                    </Button>
                </div>
            </ScrollArea>
            <DialogFooter className="pt-6 border-t">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Template</Button>
            </DialogFooter>
        </form>
    );
}

function ProductSelector({
    availableItems,
    onSelect,
} : {
    availableItems: typeof mockMenuItems,
    onSelect: (menuItem: typeof mockMenuItems[0]) => void
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product to Slot
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandList>
                        <CommandEmpty>No products found.</CommandEmpty>
                        <CommandGroup>
                            {availableItems.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.name}
                                    onSelect={() => {
                                        onSelect(item);
                                        setOpen(false);
                                    }}
                                    className="!p-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={item.imageUrl || `https://picsum.photos/seed/${item.id}/64/64`}
                                            alt={item.name}
                                            width={40}
                                            height={40}
                                            className="rounded-md object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.category} &middot; ${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

    