import { Suspense } from 'react';
import OnboardingClient from './OnboardingClient';

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#022c22] flex items-center justify-center text-white font-black italic">SYNCING OUTTY...</div>}>
      <OnboardingClient />
    </Suspense>
  );
}