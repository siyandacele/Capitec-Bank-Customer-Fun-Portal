import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { Skeleton } from '@/components/shared/Skeleton';
import { setProfile } from '@/store/slices/profileSlice';
import type { RootState } from '@/store';

const badgeModifier: Record<string, string> = {
  premium: 'customer-profile__badge--premium',
  gold: 'customer-profile__badge--gold',
  basic: 'customer-profile__badge--basic',
};

export default function CustomerProfile() {
  const dispatch = useDispatch();
  const customerId = useSelector((state: RootState) => state.filters.customerId);
  const { data: profile, isFetching } = useCustomerProfile(customerId);

  useEffect(() => {
    if (profile) {
      dispatch(setProfile(profile));
    }
  }, [profile, dispatch]);

  if (isFetching) {
    return (
      <Card className="w-full shadow-none">
        <CardContent className="pt-4 pb-4">
          <div className="customer-profile__skeleton">
            <Skeleton className="skeleton--circle" style={{ width: 48, height: 48 }} />
            <div className="customer-profile__skeleton-lines">
              <Skeleton style={{ height: 16, width: 128 }} />
              <Skeleton style={{ height: 12, width: 192 }} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  const modifier = badgeModifier[profile.accountType] || badgeModifier.basic;
  const joinDate = new Date(profile.joinDate).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <Card className="w-full shadow-none">
      <CardHeader className="pb-2">
        <div className="customer-profile__header">
          <span className="customer-profile__title">Profile</span>
          <span className={`customer-profile__badge ${modifier}`}>
            {profile.accountType}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="customer-profile__avatar-row">
          <div className="customer-profile__avatar">
            <User />
          </div>
          <div>
            <p className="customer-profile__name">{profile.name}</p>
            <div className="customer-profile__email-row">
              <Mail />
              <span>{profile.email}</span>
            </div>
          </div>
        </div>

        <div className="customer-profile__details">
          <div className="customer-profile__detail-row">
            <div className="customer-profile__detail-label">
              <Calendar />
              <span>Member since</span>
            </div>
            <span className="customer-profile__detail-value">{joinDate}</span>
          </div>
          <div className="customer-profile__detail-row">
            <div className="customer-profile__detail-label">
              <CreditCard />
              <span>Total spent</span>
            </div>
            <span className="customer-profile__detail-value">
              R{profile.totalSpent.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
