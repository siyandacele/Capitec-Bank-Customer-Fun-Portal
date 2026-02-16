import { useState } from 'react';
import { useBranches } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import type { Branch } from '@/types';
import BranchSearchPanel from './components/BranchSearchPanel';
import BranchMap from './components/BranchMap';
import BranchDetail from './components/BranchDetail';

export default function BranchLocator() {
  const { data: branches, isLoading, error } = useBranches();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'branch' | 'atm'>('all');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-28.4793, 24.6727]);
  const [mapZoom, setMapZoom] = useState(6);

  const filteredBranches =
    branches?.filter(branch => {
      const matchesSearch =
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || branch.type === filterType;
      return matchesSearch && matchesType;
    }) || [];

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setMapCenter([branch.lat, branch.lng]);
    setMapZoom(15);
  };

  if (isLoading) {
    return (
      <div className="branch-locator__loading">
        <div className="spinner" />
        <p className="branch-locator__loading-text">Loading branches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="branch-locator__error">
        <Card>
          <CardContent>
            <p className="branch-locator__error-text">
              Error loading branches: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="branch-locator fade-in">
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <BranchSearchPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterChange={setFilterType}
            branches={filteredBranches}
            selectedBranch={selectedBranch}
            onBranchClick={handleBranchClick}
          />
        </div>

        <div className="col-12 col-lg-8">
          <BranchMap
            branches={branches || []}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            onBranchClick={handleBranchClick}
          />

          {selectedBranch && <BranchDetail branch={selectedBranch} />}
        </div>
      </div>
    </div>
  );
}
