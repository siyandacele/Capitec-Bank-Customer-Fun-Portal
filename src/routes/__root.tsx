import { createRootRoute, Outlet } from '@tanstack/react-router';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import NotFound from '@/components/NotFound';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <Outlet />
      <PageFooter />
    </div>
  ),
  notFoundComponent: NotFound,
});
