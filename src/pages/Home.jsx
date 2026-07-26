import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppCard from "../components/AppCard";
import { getApps } from "../services/appService";

function Home() {

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  async function loadApps() {

    try {

      const data = await getApps();

      setApps(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadApps();

  }, []);

  const categories = useMemo(() => {

    return [...new Set(apps.map(a => a.category))];

  }, [apps]);

  const totalDownloads = useMemo(() => {

    return apps.reduce(
      (sum, app) => sum + (app.download_count || 0),
      0
    );

  }, [apps]);

  const filteredApps = apps.filter(app => {

    const matchesSearch =
      app.apk_name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "" ||
      app.category === category;

    return matchesSearch && matchesCategory;

  });

  return (

    <>

      <Navbar />

      <div className="container py-5">

        {/* HERO */}

        <div
          className="rounded-4 p-5 mb-5 text-white shadow-lg"
          style={{
            background:
              "linear-gradient(135deg,#0d6efd,#6610f2)"
          }}
        >

          <div className="row align-items-center">

            <div className="col-lg-8">

              <h1 className="display-4 fw-bold">

                Company App Store

              </h1>

              <p className="lead">

                Download all company applications securely and quickly.

              </p>

              <button className="btn btn-light btn-lg">

                Explore Apps

              </button>

            </div>

            <div className="col-lg-4 text-center">

              <h1 style={{fontSize:"90px"}}>

                📱

              </h1>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="row mb-5">

          <div className="col-md-4 mb-3">

            <div className="card border-0 shadow rounded-4">

              <div className="card-body text-center">

                <h1 className="text-primary">

                  {apps.length}

                </h1>

                <h5>

                  Total Applications

                </h5>

              </div>

            </div>

          </div>

          <div className="col-md-4 mb-3">

            <div className="card border-0 shadow rounded-4">

              <div className="card-body text-center">

                <h1 className="text-success">

                  {categories.length}

                </h1>

                <h5>

                  Categories

                </h5>

              </div>

            </div>

          </div>

          <div className="col-md-4 mb-3">

            <div className="card border-0 shadow rounded-4">

              <div className="card-body text-center">

                <h1 className="text-danger">

                  {totalDownloads}

                </h1>

                <h5>

                  Downloads

                </h5>

              </div>

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <div className="card shadow border-0 rounded-4 mb-5">

          <div className="card-body">

            <div className="row">

              <div className="col-lg-8 mb-3">

                <input

                  className="form-control form-control-lg"

                  placeholder="🔍 Search application..."

                  value={search}

                  onChange={(e)=>

                    setSearch(e.target.value)

                  }

                />

              </div>

              <div className="col-lg-4">

                <select

                  className="form-select form-select-lg"

                  value={category}

                  onChange={(e)=>

                    setCategory(e.target.value)

                  }

                >

                  <option value="">

                    All Categories

                  </option>

                  {categories.map(cat=>(

                    <option key={cat}>

                      {cat}

                    </option>

                  ))}

                </select>

              </div>

            </div>

          </div>

        </div>
                {/* Featured */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h2 className="fw-bold mb-1">
              📱 Available Applications
            </h2>

            <p className="text-muted mb-0">
              Browse and download the latest company applications.
            </p>

          </div>

          <span className="badge bg-primary fs-6 px-3 py-2">
            {filteredApps.length} Apps
          </span>

        </div>

        {/* Loading */}

        {loading && (

          <div className="text-center py-5">

            <div
              className="spinner-border text-primary"
              style={{
                width: "4rem",
                height: "4rem",
              }}
            ></div>

            <h4 className="mt-3">

              Loading Applications...

            </h4>

          </div>

        )}

        {/* Empty */}

        {!loading && filteredApps.length === 0 && (

          <div className="card border-0 shadow rounded-4">

            <div className="card-body text-center py-5">

              <div style={{fontSize:"80px"}}>

                📂

              </div>

              <h3>

                No Applications Found

              </h3>

              <p className="text-muted">

                Try changing your search or category.

              </p>

            </div>

          </div>

        )}

        {/* Grid */}

        {!loading && filteredApps.length > 0 && (

          <div className="row g-4">

            {filteredApps.map((app) => (

              <div
                className="col-xl-3 col-lg-4 col-md-6"
                key={app.id}
              >

                <div className="card border-0 shadow rounded-4 h-100">

                  <div className="text-center pt-4">

                    <img
                      src={app.icon_url}
                      alt={app.apk_name}
                      className="rounded-4 shadow"
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "cover",
                      }}
                    />

                  </div>

                  <div className="card-body text-center">

                    <h5 className="fw-bold">

                      {app.apk_name}

                    </h5>

                    <span className="badge bg-primary">

                      {app.category}

                    </span>

                    <div className="mt-3">

                      <small className="text-muted">

                        Version {app.version}

                      </small>

                    </div>

                    <p
                      className="mt-3 text-muted"
                      style={{
                        minHeight: "70px"
                      }}
                    >

                      {app.remarks}

                    </p>

                    <div className="d-flex justify-content-center gap-2 mt-3">

                      <span className="badge bg-success">

                        📥 {app.download_count || 0}

                      </span>

                    </div>

                  </div>

                  <div className="card-footer bg-white border-0">

                    <a
                      href={app.apk_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary w-100"
                    >

                      📥 Download APK

                    </a>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}
                {/* Bottom Banner */}

        <div
          className="mt-5 rounded-4 p-5 text-center text-white shadow-lg"
          style={{
            background:
              "linear-gradient(135deg,#198754,#20c997)"
          }}
        >

          <h2 className="fw-bold">
            🚀 Need the latest company apps?
          </h2>

          <p className="lead">

            All official applications are available here.
            Download safely with one click.

          </p>

          <button
            className="btn btn-light btn-lg mt-2"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            ⬆ Back to Top
          </button>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Home;