import { useSelector } from 'react-redux';
import { useDashboardStats } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import MonthlySpendingTrends from './components/MonthlySpendingTrends';
import SpendingGoals from './components/SpendingGoals';
import SpendingSummary from './components/SpendingSummary';
import SpendingByCategory from './components/SpendingByCategory';
import CustomerProfile from './components/CustomerProfile';
import TransactionsList from '@/pages/Dashboard/components/TransactionsList';
import { RootState } from '@/store';

export default function Dashboard() {
  const { isLoading, error } = useDashboardStats();
  const profileName = useSelector((state: RootState) => state.profile.data?.name);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading dashboard: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="page-wrapper sub-page-wrapper ">
      <section className="container hero-section-space hero-section-space--no-image">
        <article className="hero-landing-narrow-content">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="hero-landing-narrow-content__header-content">
                <h1 className="heading-accented">Hi, {profileName ?? 'there'}</h1>
                <p className="paragraph-intro">See where your money's going.</p>
                <div className="button--v2-group">
                  <Link
                    to="/"
                    aria-label="Download the app call to action button"
                    className="btn button--v2 button--v2--secondary"
                  >
                    Get a loan
                  </Link>
                  <a
                    href="/personal/transact/transact-fees/"
                    aria-label="View our fees call to action button"
                    className="btn button--v2 button--v2--next-to"
                  >
                    Update your profile
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <MonthlySpendingTrends />
            </div>
          </div>
        </article>
      </section>
      <div className="container mb-8">
        <div className="row">
          <div className="col-md-9">
            <SpendingSummary />
            <TransactionsList />
          </div>
          <div className="col-md-3">
            <div className="row">
              <div className="col-12 mb-4">
                <CustomerProfile />
              </div>
              <div className="col-12 mb-4">
                <SpendingByCategory />
              </div>
              <div className="col-12 pb-4 mb-4">
                <SpendingGoals />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
