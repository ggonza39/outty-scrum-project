import Link from 'next/link';
import MobilePage from '@/components/MobilePage';

export default function CongratsPage() {
  return (
    <MobilePage>
      <section className="hero">
        <h1>It&apos;s a match</h1>
        <p>You now have an interaction that feels more real than a static screen.</p>
      </section>

      <main className="content">
        <section className="card center" style={{ textAlign: 'center', minHeight: 220 }}>
          <div style={{ fontSize: 64 }}>🎉</div>
          <h2 className="section-title">Jordan liked you too</h2>
          <p className="subtle">Open messages to continue the flow.</p>
        </section>

        <div className="row">
          <Link href="/match" className="btn-ghost center">Keep browsing</Link>
          <Link href="/message" className="btn-secondary center">Send a message</Link>
        </div>
      </main>
    </MobilePage>
  );
}
