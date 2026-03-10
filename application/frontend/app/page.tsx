import Link from 'next/link';
import MobilePage from '@/components/MobilePage';

export default function HomePage() {
  return (
    <MobilePage>
      <section className="hero">
        <h1>Meet new people without the messy prototype issues.</h1>
        <p>
          This version is responsive, scrollable, and interactive so you can demo it like a real mobile app.
        </p>
      </section>

      <main className="content">
        <section className="card">
          <h2 className="section-title">What changed</h2>
          <div className="chips">
            <span className="chip">Responsive layout</span>
            <span className="chip">Working navigation</span>
            <span className="chip">Scrollable pages</span>
            <span className="chip">Interactive inputs</span>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Start here</h2>
          <p className="subtle">Use the buttons below to test the main flows.</p>
          <div className="row">
            <Link href="/signin" className="btn center">
              Sign in
            </Link>
            <Link href="/signup" className="btn-secondary center">
              Create account
            </Link>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Quick demo flow</h2>
          <ol className="subtle" style={{ paddingLeft: 20, margin: 0 }}>
            <li>Open Sign up and enter profile details.</li>
            <li>Add photos and continue to matching.</li>
            <li>Like a profile and review matches.</li>
            <li>Send a test message in chat.</li>
          </ol>
        </section>
      </main>
    </MobilePage>
  );
}
