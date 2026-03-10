import Link from 'next/link';
import MobilePage from '@/components/MobilePage';

const items = [
  { name: 'Jordan', detail: 'Matched 5 minutes ago', href: '/message' },
  { name: 'Avery', detail: 'New conversation waiting', href: '/message' },
  { name: 'Sam', detail: 'Liked your profile yesterday', href: '/message' },
];

export default function MatchesPage() {
  return (
    <MobilePage>
      <section className="hero">
        <h1>Your matches</h1>
        <p>Use this screen to show a scrollable list of active connections.</p>
      </section>

      <main className="content">
        {items.map((item) => (
          <Link key={item.name} href={item.href} className="card">
            <h2 className="section-title">{item.name}</h2>
            <p className="subtle">{item.detail}</p>
          </Link>
        ))}
      </main>
    </MobilePage>
  );
}
