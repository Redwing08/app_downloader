import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

import {
  createApplication,
  getApps,
  deleteApp,
  subscribeApps,
} from "../services/appService";

import { uploadFile } from "../services/storageService";

function Admin() {
  const [apps, setApps] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [icon, setIcon] = useState(null);

  const [apk, setApk] = useState(null);

  const [form, setForm] = useState({
    apk_name: "",
    category: "",
    version: "",
    remarks: "",
  });

  // -------------------------
  // Load Applications
  // -------------------------

  async function loadApps() {
    try {
      const data = await getApps();

      setApps(data);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Database Error",
        text: err.message,
      });
    }
  }

  // -------------------------
  // Load on Start
  // -------------------------

  useEffect(() => {
    loadApps();

    const channel = subscribeApps(() => {
      loadApps();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // -------------------------
  // Form
  // -------------------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // -------------------------
  // Upload
  // -------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!icon) {
      Swal.fire(
        "Missing Icon",
        "Please choose an application icon.",
        "warning"
      );
      return;
    }

    if (!apk) {
      Swal.fire(
        "Missing APK",
        "Please choose an APK file.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Uploading...",
        text: "Please wait.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const iconUrl = await uploadFile(
        "app-icons",
        icon
      );

      const apkUrl = await uploadFile(
        "apk-files",
        apk
      );

      await createApplication({
        apk_name: form.apk_name,
        category: form.category,
        version: form.version,
        remarks: form.remarks,
        icon_url: iconUrl,
        apk_url: apkUrl,
        download_count: 0,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Application uploaded successfully.",
      });

      setForm({
        apk_name: "",
        category: "",
        version: "",
        remarks: "",
      });

      setIcon(null);
      setApk(null);

      document.getElementById("iconFile").value = "";

      document.getElementById("apkFile").value = "";

      loadApps();
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Delete
  // -------------------------

  const removeApp = async (id) => {
    const result = await Swal.fire({
      title: "Delete Application?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteApp(id);

      Swal.fire(
        "Deleted",
        "Application removed.",
        "success"
      );

      loadApps();
    } catch (err) {
      Swal.fire(
        "Error",
        err.message,
        "error"
      );
    }
  };

  // -------------------------
  // Search
  // -------------------------

  const filteredApps = apps.filter((app) => {

    const text =
      `${app.apk_name}
       ${app.category}
       ${app.version}
       ${app.remarks}`.toLowerCase();

    return text.includes(search.toLowerCase());

  });

  return (
    <>
      <Navbar />

      <div className="container py-5">

        <div className="row mb-4">

          <div className="col-md-4">

            <div className="card shadow border-0">

              <div className="card-body text-center">

                <h1>{apps.length}</h1>

                <h5>Total Applications</h5>

              </div>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow border-0">

              <div className="card-body text-center">

                <h1>

                  {
                    [...new Set(apps.map(a => a.category))].length
                  }

                </h1>

                <h5>Categories</h5>

              </div>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow border-0">

              <div className="card-body text-center">

                <h1>

                  {apps.reduce(
                    (sum, a) =>
                      sum + (a.download_count || 0),
                    0
                  )}

                </h1>

                <h5>Total Downloads</h5>

              </div>

            </div>

          </div>

        </div>

                {/* Upload Form */}

        <div className="card shadow-lg border-0 rounded-4 mb-5">

          <div className="card-header bg-primary text-white py-3">

            <h3 className="mb-0">
              📤 Upload Application
            </h3>

          </div>

          <div className="card-body p-4">

            <form onSubmit={handleSubmit}>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-bold">
                    APK Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="apk_name"
                    value={form.apk_name}
                    onChange={handleChange}
                    placeholder="Loan Application"
                    required
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-bold">
                    Category
                  </label>

                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Category
                    </option>

                    <option>Marketing / Collection</option>
                    <option>Credit Investigator</option>
                    {/* <option>Tools</option>
                    <option>Games</option>
                    <option>Education</option>
                    <option>Productivity</option> */}

                  </select>

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-bold">
                    Version
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="version"
                    value={form.version}
                    onChange={handleChange}
                    placeholder="1.0.0"
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-bold">
                    Application Icon
                  </label>

                  <input
                    id="iconFile"
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setIcon(e.target.files[0])}
                    required
                  />

                </div>

                <div className="col-12 mb-3">

                  <label className="form-label fw-bold">
                    APK File
                  </label>

                  <input
                    id="apkFile"
                    type="file"
                    className="form-control"
                    accept=".apk"
                    onChange={(e) => setApk(e.target.files[0])}
                    required
                  />

                </div>

                <div className="col-12 mb-3">

                  <label className="form-label fw-bold">
                    Remarks
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Enter application description..."
                  />

                </div>

                <div className="col-12">

                  <button
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >

                    {loading
                      ? "Uploading..."
                      : "📤 Upload Application"}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

        {/* Search */}

        <div className="card shadow border-0 mb-4">

          <div className="card-body">

            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="🔍 Search applications..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>
                {/* Applications Table */}

        <div className="card shadow-lg border-0 rounded-4">

          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

            <h4 className="mb-0">
              📱 Uploaded Applications
            </h4>

            <span className="badge bg-primary fs-6">
              {filteredApps.length} Apps
            </span>

          </div>

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>

                  <th style={{ width: "80px" }}>
                    Icon
                  </th>

                  <th>Application</th>

                  <th>Category</th>

                  <th>Version</th>

                  <th>Remarks</th>

                  <th>Downloads</th>

                  <th className="text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredApps.length === 0 && (

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-5"
                    >

                      <h5 className="text-muted">
                        No applications found.
                      </h5>

                    </td>

                  </tr>

                )}

                {filteredApps.map((app) => (

                  <tr key={app.id}>

                    <td>

                      <img
                        src={app.icon_url}
                        alt={app.apk_name}
                        className="rounded shadow"
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                        }}
                      />

                    </td>

                    <td>

                      <strong>
                        {app.apk_name}
                      </strong>

                    </td>

                    <td>

                      <span className="badge bg-primary">

                        {app.category}

                      </span>

                    </td>

                    <td>

                      {app.version}

                    </td>

                    <td>

                      {app.remarks}

                    </td>

                    <td>

                      <span className="badge bg-success">

                        {app.download_count || 0}

                      </span>

                    </td>

                    <td>

                      <div className="d-flex gap-2 justify-content-center">

                        <a
                          href={app.apk_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-success btn-sm"
                        >
                          📥 Download
                        </a>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            removeApp(app.id)
                          }
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
      {/* Footer */}

      <div className="text-center py-5">

        <hr />

        <p className="text-muted mb-0">
          © {new Date().getFullYear()} App Downloader Admin Dashboard
        </p>

        <small className="text-muted">
          Powered by React + Supabase
        </small>

      </div>

    </>

  );

}

export default Admin;