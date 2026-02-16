import { Link, useMatchRoute } from '@tanstack/react-router';

export default function PageHeader() {
  const matchRoute = useMatchRoute();
  const isLoanPage = matchRoute({ to: '/loan-simulator', fuzzy: true });
  const isPaymentCalc = matchRoute({ to: '/loan-simulator/payment-calculator' });
  const isCheckEligibility = isLoanPage && !isPaymentCalc && !matchRoute({ to: '/loan-simulator/results' });

  return (
    <div className="fixed-top">
      <div className="mainNavBar">
        <div className="sticky--v2 main-navigation--v2-wrapper">
          <div className="main-nav-background-wrapper">
            <nav className="main-navigation--v2 navbar navbar-expand-sm">
              <div className="nav-button-container">
                <Link className="navbar-brand" to="/" aria-label="Home">
                  <img
                    src="https://www.capitecbank.co.za/Static/capitec_v2/dist/assets/images/capitec-logo.svg"
                    alt="Capitec Bank"
                  />
                </Link>
                <ul className="navbar-nav full desktop-menu">
                  <li className={`nav-item__v2${matchRoute({ to: '/', fuzzy: false }) ? ' active' : ''}`}>
                    <Link to="/" className="full" activeOptions={{ exact: true }}>
                      <span className="nav-link">Dashboard</span>
                    </Link>
                  </li>
                  <li className={`nav-item__v2${isLoanPage ? ' active' : ''}`}>
                    <Link to="/loan-simulator" className="full">
                      <span className="nav-link">Check Your Loan Eligibility</span>
                    </Link>
                  </li>
                  <li className={`nav-item__v2${matchRoute({ to: '/branch-locator' }) ? ' active' : ''}`}>
                    <Link to="/branch-locator" className="full">
                      <span className="nav-link">Branch Locator</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          {isLoanPage && (
            <div className="subnav-container-wrapper navbar-expand-sm show theme--default-sub-nav">
              <div className="subnav-container">
                <div className="container-fluid h-100">
                  <div className="row justify-content-lg-end h-100 p-0">
                    <div className="col-lg-9 d-none d-lg-flex">
                      <div className={`sub-menu-item${isCheckEligibility ? ' active' : ''}`}>
                        <Link to="/loan-simulator">
                          <span className="nav-link">Check Your Eligibility</span>
                        </Link>
                      </div>
                      <div className={`sub-menu-item${isPaymentCalc ? ' active' : ''}`}>
                        <Link to="/loan-simulator/payment-calculator">
                          <span className="nav-link">Payment Calculator</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
