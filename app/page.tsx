'use client';

import dynamic from 'next/dynamic';

// Dynamically import the OEEDashboard component with SSR disabled
const OEEDashboard = dynamic(() => import('./components/OEEDashboard'), {
  ssr: false,
});

export default function Home() {
  return <OEEDashboard />;
}
