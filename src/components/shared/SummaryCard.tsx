import { TrendingUp, TrendingDown, Award, Calculator } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
  };
  icon?: 'award' | 'trending' | 'calculator';
}

export default function SummaryCard({ title, value, trend, icon }: SummaryCardProps) {
  const isTrendUp = trend ? trend.value > 0 : false;

  return (
    <div className="d-flex stats-card-container">
      <div className="stats-card-image-container theme--transact--primary">
        <div className="stats-card-image-wrapper">
          {trend && (
            <div className="card--trends">
              <span className="icon">
                {isTrendUp ? (
                  <TrendingUp className="text-black" size={16} />
                ) : (
                  <TrendingDown className="text-black" size={16} />
                )}
              </span>
              <p className="icon--paragraph">
                {isTrendUp ? '+' : ''}
                {trend.value}%
              </p>
            </div>
          )}

          {icon === 'award' && (
            <span className="icon">
              <Award className="text-black" size={20} />
            </span>
          )}

          {icon === 'calculator' && (
            <span className="icon">
              <Calculator className="text-black" size={20} />
            </span>
          )}
        </div>
      </div>
      <div className="stats-card-content">
        <h6>{title}</h6>
        <p>{value}</p>
      </div>
    </div>
  );
}
