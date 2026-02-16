import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, Phone, Clock, Search, Building2, Landmark } from 'lucide-react';
import type { Branch } from '@/types';

interface BranchSearchPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: 'all' | 'branch' | 'atm';
  onFilterChange: (type: 'all' | 'branch' | 'atm') => void;
  branches: Branch[];
  selectedBranch: Branch | null;
  onBranchClick: (branch: Branch) => void;
}

export default function BranchSearchPanel({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  branches,
  selectedBranch,
  onBranchClick,
}: BranchSearchPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Find a Branch</CardTitle>
        <CardDescription>Search for branches and ATMs near you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="branch-search">
          <div className="branch-search__input-wrapper">
            <Search className="branch-search__icon" />
            <Input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="branch-search__input"
            />
          </div>
          <div className="branch-filter">
            {(['all', 'branch', 'atm'] as const).map(type => (
              <button
                key={type}
                type="button"
                className={`branch-filter__tab ${filterType === type ? 'branch-filter__tab--active' : ''}`}
                onClick={() => onFilterChange(type)}
              >
                {type === 'all' ? 'All' : type === 'branch' ? 'Branches' : 'ATMs'}
              </button>
            ))}
          </div>

          <p className="branch-search__count">
            {branches.length} location
            {branches.length !== 1 ? 's' : ''} found
          </p>

          <div className="branch-list">
            {branches.map(branch => (
              <div
                key={branch.id}
                className={`branch-card ${selectedBranch?.id === branch.id ? 'branch-card--selected' : ''}`}
                onClick={() => onBranchClick(branch)}
              >
                <div className="branch-card__header">
                  <span className="branch-card__type-icon">
                    {branch.type === 'atm' ? (
                      <Landmark size={14} />
                    ) : (
                      <Building2 size={14} />
                    )}
                  </span>
                  <h3 className="branch-card__name">{branch.name}</h3>
                  <span
                    className={`branch-card__type-badge branch-card__type-badge--${branch.type}`}
                  >
                    {branch.type === 'atm' ? 'ATM' : 'Branch'}
                  </span>
                </div>

                <div className="branch-card__details">
                  <div className="branch-card__detail">
                    <MapPin className="branch-card__detail-icon" />
                    <span>{branch.address}</span>
                  </div>
                  {branch.phone && (
                    <div className="branch-card__detail">
                      <Phone className="branch-card__detail-icon" />
                      <span>{branch.phone}</span>
                    </div>
                  )}
                  <div className="branch-card__detail">
                    <Clock className="branch-card__detail-icon" />
                    <span>{branch.hours}</span>
                  </div>
                </div>

                <div className="branch-card__services">
                  {branch.services.map((service, idx) => (
                    <span key={idx} className="branch-card__service-badge">
                      {service}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn button--v2 button--v2--secondary branch-card__map-btn"
                  onClick={e => {
                    e.stopPropagation();
                    onBranchClick(branch);
                  }}
                >
                  View on Map
                </button>
              </div>
            ))}

            {branches.length === 0 && (
              <div className="branch-list__empty">
                <MapPin className="branch-list__empty-icon" />
                <p>No locations found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
