import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/Skeleton';
import { useLoanProducts } from '@/hooks/useLoanProducts';
import type { LoanProduct } from '@/types/loan';

const formatCurrency = (amount: number) =>
  `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`;

const productImages: Record<string, string> = {
  vehicle_loan:
    'https://www.capitecbank.co.za/globalassets/approved-images/credit/purposeloan_vehicle_2023---desktop.png',
  personal_loan:
    'https://www.capitecbank.co.za/globalassets/approved-images/credit/credit-adcard_2023---desktop.png',
};

const formatPurpose = (purpose: string) =>
  purpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

export default function LoanProducts() {
  const { data, isFetching } = useLoanProducts();

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
        </CardHeader>
        <CardContent className="loan-products__skeleton">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} style={{ height: 200, width: '100%', borderRadius: 8 }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  const products = data?.products ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="loan-products__list">
          {products.map((product: LoanProduct) => {
            const image = productImages[product.id];
            return (
              <div key={product.id} className="loan-products__card">
                {image && (
                  <div className="loan-products__card-image-wrapper">
                    <img
                      src={image}
                      alt={product.name}
                      className="loan-products__card-image"
                    />
                  </div>
                )}
                <div className="loan-products__card-body">
                  <h4 className="loan-products__card-name">{product.name}</h4>
                  <p className="loan-products__card-desc">{product.description}</p>
                  <div className="loan-products__card-details">
                    <div className="loan-products__card-detail">
                      <span className="loan-products__card-detail-label">Amount Range</span>
                      <span className="loan-products__card-detail-value">
                        {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                      </span>
                    </div>
                    <div className="loan-products__card-detail">
                      <span className="loan-products__card-detail-label">Term</span>
                      <span className="loan-products__card-detail-value">
                        {product.minTerm} - {product.maxTerm} months
                      </span>
                    </div>
                    <div className="loan-products__card-detail">
                      <span className="loan-products__card-detail-label">Interest Rate</span>
                      <span className="loan-products__card-detail-value">
                        {product.interestRateRange.min}% - {product.interestRateRange.max}%
                      </span>
                    </div>
                  </div>
                  <div className="loan-products__purposes">
                    {product.purposes.map(purpose => (
                      <span key={purpose} className="loan-products__purpose-tag">
                        {formatPurpose(purpose)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
