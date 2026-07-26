import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          📱 App Downloader
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Uploader
              </Link>
            </li> */}

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;