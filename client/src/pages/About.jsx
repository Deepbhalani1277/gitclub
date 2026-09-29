import './About.css';

function About() {
  return (
    <div className="about-page container">
      <div className="about-header">
        <h1>About Git Club CHARUSAT</h1>
        <p className="lead-text">
          A community of student developers dedicated to learning, building, and sharing knowledge.
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            The Git Club at CHARUSAT was founded with a simple goal: to bridge the gap between academic curriculum and industry practices. We believe that the best way to learn software engineering is by doing it together.
          </p>
          <p>
            We focus on open-source contributions, version control best practices, modern web development, and cloud computing.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Do</h2>
          <ul className="activities-list">
            <li>
              <strong>Hands-on Workshops:</strong> Regular sessions on Git, GitHub, React, Node.js, and more.
            </li>
            <li>
              <strong>Hackathons & Competitions:</strong> Opportunities to build projects under pressure and solve real problems.
            </li>
            <li>
              <strong>Open Source Months:</strong> Dedicated events to help students make their first PRs to real projects.
            </li>
            <li>
              <strong>Networking Meetups:</strong> Connect with alumni and industry professionals.
            </li>
          </ul>
        </section>

        <section className="about-section team-section">
          <h2>Join the Community</h2>
          <p>
            Whether you're a first-year student writing your first "Hello World" or a final-year student building complex distributed systems, there's a place for you here.
          </p>
          <div className="join-cta">
            <p>Ready to get involved?</p>
            <a href="/events" className="btn btn-primary">Check out upcoming events</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
