import MobilePage from '@/components/MobilePage';

export default function AboutPage() {
  return (
    <MobilePage showBottomNav={false}>
      <section className="hero">
        <h1>About Outty</h1>
        <p>
          Meet new people, explore shared interests, and build real connections through adventure.
        </p>
      </section>

      <main className="content">
        <section className="card">
          <h2 className="section-title">Our Purpose</h2>
          <p className="subtle">
            Outty is designed to connect people who enjoy similar activities and want to build meaningful connections.
            Whether you're looking for a hiking partner, a travel companion, or someone to try something new with,
            Outty makes it easy to find your match.
          </p>
        </section>

        <section className="card">
          <h2 className="section-title">What You Can Do</h2>
          <ul className="subtle" style={{ margin: 0, paddingLeft: 20 }}>
            <li>Discover people with shared interests</li>
            <li>Match with others nearby</li>
            <li>Start conversations and plan activities</li>
            <li>Build real-world connections</li>
          </ul>
        </section>
      </main>
    </MobilePage>
  );
}
