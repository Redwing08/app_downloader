function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container py-4">

        <div className="row">

          <div className="col-md-6 mb-3">
            <h5 className="fw-bold">
              📱 Company App Downloader
            </h5>

            <p className="text-white-50 mb-0">
              Download trusted Android applications quickly and securely.
            </p>
          </div>

          <div className="col-md-3 mb-3">
            <h6 className="fw-bold">Quick Links</h6>

            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-decoration-none text-white-50">
                  Home
                </a>
              </li>

              <li>
                <a href="/admin" className="text-decoration-none text-white-50">
                  Admin
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-3">
            <h6 className="fw-bold">Contact</h6>

            <p className="text-white-50 mb-1">
              barrerasteve032@gmail.com
            </p>

            <p className="text-white-50">
              Philippines
            </p>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center text-white-50">
          © {year} Company
           App Downloader. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;