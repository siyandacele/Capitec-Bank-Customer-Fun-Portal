import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { setBranchPageContext } from '@/store/slices/branchPageSlice';
import BranchLocator from '@/pages/BranchLocator';

function BranchLocatorPage() {
  const dispatch = useDispatch();
  const { title, subtitle } = useSelector((state: RootState) => state.branchPage);

  useEffect(() => {
    dispatch(
      setBranchPageContext({
        title: 'Branch Locator',
        subtitle: 'Find a Capitec branch or ATM near you.',
      }),
    );
  }, [dispatch]);

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
        <BranchLocator />
      </div>
    </main>
  );
}

export const Route = createFileRoute('/branch-locator')({
  component: BranchLocatorPage,
});
