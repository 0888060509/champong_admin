
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Campaign } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useCampaigns } from '../campaigns-context';

export default function CampaignDetailsPage() {
    const params = useParams();
    const campaignId = params.id as string;
    const { getCampaignById } = useCampaigns();
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    useEffect(() => {
        if (!campaignId) return;
        const foundCampaign = getCampaignById(campaignId);
        if (foundCampaign) {
            setCampaign(foundCampaign);
        } else {
            console.log("Campaign not found!");
        }
    }, [campaignId, getCampaignById]);

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
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">{campaign.name}</CardTitle>
                            <CardDescription>{campaign.description || 'No description available.'}</CardDescription>
                        </div>
                        {getStatusBadge(campaign.status)}
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Sent</p>
                            <p className="text-2xl font-bold">{campaign.sentCount.toLocaleString()}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Open Rate</p>
                            <p className="text-2xl font-bold">{(campaign.openRate * 100).toFixed(1)}%</p>
                        </div>
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
        </div>
    );
}
