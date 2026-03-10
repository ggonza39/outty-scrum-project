import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav';

interface MobilePageProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export default function MobilePage({ children, showBottomNav = true }: MobilePageProps) {
  return (
    <div className="page">
      <AppHeader />
      {children}
      {showBottomNav ? <BottomNav /> : null}
    </div>
  );
}
