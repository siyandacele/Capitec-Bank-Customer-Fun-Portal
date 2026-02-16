import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import LoanProducts from '@/pages/LoanEligibilitySimulator/components/LoanProducts';

function LoanSimulatorLayout() {
  const { title, subtitle } = useSelector((state: RootState) => state.loanPage);

  return (
    <main className="page-wrapper sub-page-wrapper">
      <section className="container hero-section-space hero-section-space--no-image">
        <article className="hero-landing-narrow-content">
          <div className="hero-landing-narrow-content__header-content">
            <h1 className="heading-accented">{title}</h1>
            <p className="paragraph-intro">{subtitle}</p>
          </div>
        </article>
      </section>
      <div className="container mb-8">
        <div className="row">
          <div className="col-md-8">
            <Outlet />
          </div>
          <div className="col-md-4">
            <LoanProducts />
          </div>
        </div>
      </div>
    </main>
  );
}

export const Route = createFileRoute('/loan-simulator')({
  component: LoanSimulatorLayout,
});
