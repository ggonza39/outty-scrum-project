import MobilePage from '@/components/MobilePage';

export default function AboutPage() {
  return (
    <MobilePage>
      <section className="hero">
        <h1>About Outty</h1>
        <p>This page gives your prototype a fuller product story.</p>
      </section>

      <main className="content">
        <section className="card">
          <h2 className="section-title">Purpose</h2>
          <p className="subtle">
            Outty is a mobile-first social matching concept designed to help users discover people with shared interests,
            build connections, and start conversations in a simple interface.
          </p>
        </section>

        <section className="card">
          <h2 className="section-title">Why this version works better</h2>
          <ul className="subtle" style={{ margin: 0, paddingLeft: 20 }}>
            <li>Layouts scale to small and larger screens.</li>
            <li>Content scrolls naturally on long pages.</li>
            <li>Navigation and buttons move users between screens.</li>
            <li>Form fields and chat areas accept input for demos.</li>
          </ul>
        </section>
      </main>
    </MobilePage>
  );
}
