
'use client';

import { CampaignsProvider } from './campaigns-context';

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CampaignsProvider>{children}</CampaignsProvider>;
}
