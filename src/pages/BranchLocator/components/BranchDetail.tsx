import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import type { Branch } from '@/types';
import PopularTimesChart from './PopularTimesChart';

interface BranchDetailProps {
  branch: Branch;
}

export default function BranchDetail({ branch }: BranchDetailProps) {
  return (
    <Card className="branch-detail">
      <CardHeader>
        <div className="branch-detail__header">
          <div>
            <CardTitle>{branch.name}</CardTitle>
            <CardDescription>
              {branch.type === 'atm' ? 'ATM' : 'Branch'} Details
            </CardDescription>
          </div>
          <span
            className={`branch-card__type-badge branch-card__type-badge--${branch.type}`}
          >
            {branch.type === 'atm' ? 'ATM' : 'Branch'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="branch-detail__body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="branch-detail__info-item">
                <MapPin className="branch-detail__info-icon" />
                <div>
                  <p className="branch-detail__info-label">Address</p>
                  <p className="branch-detail__info-value">
                    {branch.address}
                  </p>
                </div>
              </div>
            </div>

            {branch.phone && (
              <div className="col-12 col-md-6">
                <div className="branch-detail__info-item">
                  <Phone className="branch-detail__info-icon" />
                  <div>
                    <p className="branch-detail__info-label">Phone</p>
                    <p className="branch-detail__info-value">
                      {branch.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {branch.email && (
              <div className="col-12 col-md-6">
                <div className="branch-detail__info-item">
                  <Mail className="branch-detail__info-icon" />
                  <div>
                    <p className="branch-detail__info-label">Email</p>
                    <p className="branch-detail__info-value">
                      {branch.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="col-12 col-md-6">
              <div className="branch-detail__info-item">
                <Clock className="branch-detail__info-icon" />
                <div>
                  <p className="branch-detail__info-label">Hours</p>
                  <p className="branch-detail__info-value">
                    {branch.hours}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12">
              <p className="branch-detail__services-label">Services Available</p>
              <div className="branch-detail__services">
                {branch.services.map((service, idx) => (
                  <span key={idx} className="branch-detail__service-badge">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <PopularTimesChart branchId={branch.id} />
        </div>
      </CardContent>
    </Card>
  );
}
