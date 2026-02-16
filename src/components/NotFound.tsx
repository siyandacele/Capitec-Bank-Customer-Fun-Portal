import { Link } from '@tanstack/react-router';

export default function NotFound() {
  return (
    <main className="page-wrapper sub-page-wrapper">
      <section className="container hero-section-space hero-section-space--no-image">
        <article className="hero-landing-narrow-content">
          <div className="hero-landing-narrow-content__header-content">
            <div className="not-found__status">404</div>
            <h1 className="heading-accented">Page Not Found</h1>
            <p className="paragraph-intro">
              Sorry, the page you are looking for does not exist or has been
              moved.
            </p>
            <div className="button--v2-group">
              <Link to="/" className="btn button--v2">
                Go to Dashboard
              </Link>
              <Link
                to="/loan-simulator"
                className="btn button--v2 button--v2--secondary"
              >
                Check Your Loan Eligibility
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
