

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { SuggestedCollection } from '@/ai/flows/suggest-product-collections';

export type CollectionCondition = {
  id?: string;
  type: 'condition';
  criteria: string;
  operator: string;
  value: any;
};

export type CollectionGroup = {
    id?: string;
    type: 'group';
    logic: 'AND' | 'OR';
    conditions: (CollectionCondition | CollectionGroup)[];
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  publicTitle?: string;
  publicSubtitle?: string;
  productCount: number;
  root: CollectionGroup;
  isActive: boolean;
};

interface CollectionsContextType {
    collections: Collection[];
    isFormOpen: boolean;
    setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editingCollection: Partial<Collection> | null;
    isSaving: boolean;
    handleSaveCollection: (data: any) => void;
    deleteCollection: (collectionId: string) => void;
    openForm: (collection?: Partial<Collection> | null) => void;
    handleSuggestionClick: (suggestion: SuggestedCollection) => void;
    handleDuplicateCollection: (collection: Collection) => void;
    getCollectionById: (id: string) => Collection | undefined;
}

const CollectionsContext = createContext<CollectionsContextType | null>(null);

export const CollectionsProvider = ({ children }: { children: ReactNode }) => {
    const [collections, setCollections] = useState<Collection[]>([
    { 
      id: '1', 
      name: 'High Profit Items',
      publicTitle: "Chef's Recommendations",
      description: 'Items with a high profit margin, great for upselling.',
      productCount: 12, 
      root: { type: 'group', logic: 'AND', conditions: [{type: 'condition', id: 'cond-1', criteria: 'profit_margin', operator: 'gte', value: 40}]},
      isActive: true,
    },
    { 
      id: '2', 
      name: 'Low Stock Specials', 
      publicTitle: "Last Chance to Buy!",
      description: 'Clear out items that are low in stock.',
      productCount: 8, 
      root: { type: 'group', logic: 'AND', conditions: [{type: 'condition', id: 'cond-2', criteria: 'stock_level', operator: 'lte', value: 10}]},
      isActive: true,
    },
    { 
      id: '3', 
      name: 'Weekend Dessert Specials', 
      publicTitle: "Sweet Weekend Deals",
      description: 'Special desserts featured only on weekends.',
      productCount: 4, 
      root: { 
          type: 'group',
          logic: 'AND', 
          conditions: [
              {type: 'condition', id: 'cond-3a', criteria: 'tags', operator: 'contains', value: 'weekend_special'},
              {type: 'condition', id: 'cond-3b', criteria: 'category', operator: 'eq', value: 'Desserts'}
          ]
      },
      isActive: false,
    },
     { 
      id: '4', 
      name: 'Premium Main Courses', 
      productCount: 7, 
      publicTitle: "Premium Entrees",
      description: 'Top-tier main courses for discerning customers.',
      isActive: true,
      root: { 
          type: 'group',
          logic: 'AND', 
          conditions: [
              {type: 'condition', id: 'cond-4a', criteria: 'category', operator: 'eq', value: 'Main Course'},
              {type: 'condition', id: 'cond-4b', criteria: 'price', operator: 'gte', value: 25}
          ]
      },
    },
  ]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Partial<Collection> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const openForm = (collection: Partial<Collection> | null = null) => {
    setEditingCollection(collection);
    setFormOpen(true);
  }

  const handleSaveCollection = async (data: any) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingCollection && editingCollection.id) { // We are editing
        setCollections(prev => prev.map(c => c.id === editingCollection.id ? { ...c, ...data, isActive: data.isActive } : c));
        toast({
            title: "Collection Updated",
            description: `The collection "${data.name}" has been successfully updated.`,
        });
    } else { // We are creating
        setCollections(prev => [...prev, {
            id: String(Date.now()),
            productCount: Math.floor(Math.random() * 20), // Mock customer count
            ...data,
        }]);
        toast({
            title: "Collection Created",
            description: `The collection "${data.name}" has been successfully created.`,
        });
    }

    setIsSaving(false);
    setFormOpen(false);
    setEditingCollection(null);
  }

  const deleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
    toast({
        title: "Collection Deleted",
        description: "The collection has been successfully deleted.",
        variant: "destructive"
    });
  }

  const handleDuplicateCollection = (collection: Collection) => {
    const newCollectionData = {
        ...collection,
        id: undefined, // Remove ID to indicate it's a new entity
        name: `Copy of ${collection.name}`
    };
    openForm(newCollectionData);
  }
  
  const handleSuggestionClick = (suggestion: SuggestedCollection) => {
    const collectionData: Partial<Collection> = {
      name: suggestion.name,
      description: suggestion.description,
      publicTitle: suggestion.publicTitle,
      publicSubtitle: suggestion.publicSubtitle,
      root: suggestion.suggestedConditions,
      isActive: true,
    };
    openForm(collectionData);
  }

  const getCollectionById = (id: string) => {
    return collections.find(c => c.id === id);
  }

  return (
    <CollectionsContext.Provider
      value={{ 
          collections,
          isFormOpen,
          setFormOpen,
          editingCollection,
          isSaving,
          handleSaveCollection,
          deleteCollection,
          openForm,
          handleSuggestionClick,
          handleDuplicateCollection,
          getCollectionById
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};

    