import { Link } from '@tanstack/react-router';

export default function PageFooter() {
  return (
    <footer className="footer--v2">
      <div className="row">
        <div className="footer--v2__banner">
          <div className="footer--v2__banner-inner container">
            <p className="footer--v2__banner-text">You deserve to bank simpler</p>
            <a
              href="https://www.capitecbank.co.za/personal/transact/open-an-account/"
              className="btn button--v2 button--v2--secondary"
              role="button"
              aria-label="Footer Open an account button"
            >
              Open an account
            </a>
          </div>
        </div>
      </div>
      <div className="row flex-column">
        <div className="footer--v2__logo">
          <Link className="navbar-brand" to="/" aria-label="Home">
            <img
              src="https://www.capitecbank.co.za/Static/capitec_v2/dist/assets/images/Capitec_logo_grey.svg"
              alt="Capitec Bank"
            />
          </Link>
        </div>
      </div>
      <div className="row footer--v2__bottom">
        <div className="col-12 p-0">
          <div className="footer--v2__disclaimer ">
            <div className="footer--v2-width">
              <span>
                <p>
                  Capitec Bank is an authorised financial services provider (FSP 46669)
                  and registered credit provider (NCRCP13). Capitec Bank Limited Reg. No:
                  1980/003695/06
                </p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
