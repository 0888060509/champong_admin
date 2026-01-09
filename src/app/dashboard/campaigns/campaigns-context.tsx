

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Campaign } from '@/lib/types';
import { mockCampaigns } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface CampaignsContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (campaignId: string) => void;
  getCampaignById: (campaignId: string) => Campaign | undefined;
}

const CampaignsContext = createContext<CampaignsContextType | null>(null);

export const CampaignsProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const { toast } = useToast();

  const addCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [...prev, campaign]);
    toast({ title: 'Success', description: 'Campaign created successfully.' });
  };

  const updateCampaign = (updatedCampaign: Campaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c))
    );
    toast({ title: 'Success', description: 'Campaign updated successfully.' });
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    toast({ title: 'Success', description: 'Campaign deleted successfully.' });
  };
  
  const getCampaignById = (campaignId: string): Campaign | undefined => {
    return campaigns.find(c => c.id === campaignId);
  }

  return (
    <CampaignsContext.Provider
      value={{ campaigns, addCampaign, updateCampaign, deleteCampaign, getCampaignById }}
    >
      {children}
    </CampaignsContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignsContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignsProvider');
  }
  return context;
};
