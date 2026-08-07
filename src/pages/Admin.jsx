import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

import {
  createApplication,
  getApps,
  deleteApp,
  updateApplication, // Ensure this function is exported in your appService.js
  subscribeApps,
} from "../services/appService";

import { uploadFile } from "../services/storageService";

function Admin() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Create Form File States & Refs
  const [icon, setIcon] = useState(null);
  const [apk, setApk] = useState(null);
  const iconInputRef = useRef(null);
  const apkInputRef = useRef(null);

  // Edit Form States & Refs
  const [editingApp, setEditingApp] = useState(null);
  const [editForm, setEditForm] = useState({
    apk_name: "",
    category: "",
    version: "",
    remarks: "",
  });
  const [editIcon, setEditIcon] = useState(null);
  const [editApk, setEditApk] = useState(null);

  const initialFormState = {
    apk_name: "",
    category: "",
    version: "",
    remarks: "",
  };

  const [form, setForm] = useState(initialFormState);

  // -------------------------
  // Load Applications
  // -------------------------
  async function loadApps() {
    try {
      const data = await getApps();
      setApps(data || []);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Database Error",
        text: err.message || "Failed to fetch applications.",
      });
    }
  }

  // -------------------------
  // Subscriptions & Lifecycle
  // -------------------------
  useEffect(() => {
    loadApps();

    const channel = subscribeApps(() => {
      loadApps();
    });

    return () => {
      if (channel && typeof channel.unsubscribe === "function") {
        channel.unsubscribe();
      }
    };
  }, []);

  // -------------------------
  // Handlers - Create
  // -------------------------
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setIcon(null);
    setApk(null);

    if (iconInputRef.current) iconInputRef.current.value = "";
    if (apkInputRef.current) apkInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!icon) return Swal.fire("Missing Icon", "Please choose an application icon.", "warning");
    if (!apk) return Swal.fire("Missing APK", "Please choose an APK file.", "warning");

    try {
      setLoading(true);

      Swal.fire({
        title: "Uploading...",
        text: "Uploading files and saving application data...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const iconUrl = await uploadFile("app-icons", icon);
      const apkUrl = await uploadFile("apk-files", apk);

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

      resetForm();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Handlers - Update / Edit
  // -------------------------
  const openEditModal = (app) => {
    setEditingApp(app);
    setEditForm({
      apk_name: app.apk_name || "",
      category: app.category || "",
      version: app.version || "",
      remarks: app.remarks || "",
    });
    setEditIcon(null);
    setEditApk(null);
  };

  const closeEditModal = () => {
    setEditingApp(null);
    setEditIcon(null);
    setEditApk(null);
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      setLoading(true);

      Swal.fire({
        title: "Updating...",
        text: "Processing changes...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let updatedIconUrl = editingApp.icon_url;
      let updatedApkUrl = editingApp.apk_url;

      // Upload replacement files if new ones were provided
      if (editIcon) {
        updatedIconUrl = await uploadFile("app-icons", editIcon);
      }
      if (editApk) {
        updatedApkUrl = await uploadFile("apk-files", editApk);
      }

      const updatedPayload = {
        apk_name: editForm.apk_name,
        category: editForm.category,
        version: editForm.version,
        remarks: editForm.remarks,
        icon_url: updatedIconUrl,
        apk_url: updatedApkUrl,
      };

      await updateApplication(editingApp.id, updatedPayload);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Application updated successfully.",
      });

      closeEditModal();
      loadApps();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message || "Could not update application.",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Handlers - Delete
  // -------------------------
  const removeApp = async (id) => {
    const result = await Swal.fire({
      title: "Delete Application?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteApp(id);
      Swal.fire("Deleted", "Application removed successfully.", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete application.", "error");
    }
  };

  // -------------------------
  // Filtering & Metrics
  // -------------------------
  const filteredApps = apps.filter((app) => {
    const searchTarget = `${app.apk_name || ""} ${app.category || ""} ${app.version || ""} ${app.remarks || ""}`.toLowerCase();
    return searchTarget.includes(search.toLowerCase().trim());
  });

  const totalCategories = [...new Set(apps.map((a) => a.category).filter(Boolean))].length;
  const totalDownloads = apps.reduce((sum, a) => sum + (a.download_count || 0), 0);

  return (
    <>
      <Navbar />

      <div className="container py-5">
        {/* Dashboard Metrics */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card shadow border-0">
              <div className="card-body text-center py-4">
                <h1 className="display-5 fw-bold">{apps.length}</h1>
                <h5 className="text-muted mb-0">Total Applications</h5>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card shadow border-0">
              <div className="card-body text-center py-4">
                <h1 className="display-5 fw-bold">{totalCategories}</h1>
                <h5 className="text-muted mb-0">Categories</h5>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body text-center py-4">
                <h1 className="display-5 fw-bold">{totalDownloads}</h1>
                <h5 className="text-muted mb-0">Total Downloads</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="card shadow-lg border-0 rounded-4 mb-5">
          <div className="card-header bg-primary text-white py-3">
            <h3 className="mb-0 fs-4">📤 Upload Application</h3>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">APK Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="apk_name"
                    value={form.apk_name}
                    onChange={handleChange}
                    placeholder="e.g., Loan Collector App"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Marketing / Collection">Marketing / Collection</option>
                    <option value="Credit Investigator">Credit Investigator</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Version</label>
                  <input
                    type="text"
                    className="form-control"
                    name="version"
                    value={form.version}
                    onChange={handleChange}
                    placeholder="1.0.0"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Application Icon</label>
                  <input
                    ref={iconInputRef}
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setIcon(e.target.files[0])}
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">APK File</label>
                  <input
                    ref={apkInputRef}
                    type="file"
                    className="form-control"
                    accept=".apk"
                    onChange={(e) => setApk(e.target.files[0])}
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">Remarks</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Enter application description..."
                  />
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "📤 Upload Application"}
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Applications Table */}
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
            <h4 className="mb-0 fs-5">📱 Uploaded Applications</h4>
            <span className="badge bg-primary fs-6">
              {filteredApps.length} Apps
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "80px" }}>Icon</th>
                  <th>Application</th>
                  <th>Category</th>
                  <th>Version</th>
                  <th>Remarks</th>
                  <th>Downloads</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <h5 className="text-muted mb-0">No applications found.</h5>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <img
                          src={app.icon_url}
                          alt={app.apk_name}
                          className="rounded shadow-sm"
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                      </td>
                      <td>
                        <strong>{app.apk_name}</strong>
                      </td>
                      <td>
                        <span className="badge bg-primary">{app.category}</span>
                      </td>
                      <td>{app.version}</td>
                      <td>
                        <small className="text-secondary">
                          {app.remarks || "N/A"}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-success fs-6">
                          {app.download_count || 0}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => openEditModal(app)}
                          >
                            ✏️ Edit
                          </button>

                          <a
                            href={app.apk_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-success btn-sm"
                            download
                          >
                            📥 Download
                          </a>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeApp(app.id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* -------------------------
          EDIT MODAL
         ------------------------- */}
      {editingApp && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header bg-warning text-dark py-3">
                <h5 className="modal-title fw-bold">
                  ✏️ Edit Application: {editingApp.apk_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditModal}
                  disabled={loading}
                ></button>
              </div>

              <form onSubmit={handleUpdate}>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">APK Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="apk_name"
                        value={editForm.apk_name}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Marketing / Collection">
                          Marketing / Collection
                        </option>
                        <option value="Credit Investigator">
                          Credit Investigator
                        </option>
                        <option value="Manager">Manager</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Version</label>
                      <input
                        type="text"
                        className="form-control"
                        name="version"
                        value={editForm.version}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Replace Icon (Optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setEditIcon(e.target.files[0])}
                      />
                      <small className="text-muted">
                        Leave blank to keep current icon
                      </small>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold">
                        Replace APK File (Optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".apk"
                        onChange={(e) => setEditApk(e.target.files[0])}
                      />
                      <small className="text-muted">
                        Leave blank to keep current APK file
                      </small>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold">Remarks</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="remarks"
                        value={editForm.remarks}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning fw-bold"
                    disabled={loading}
                  >
                    {loading ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-5">
        <hr />
        <p className="text-muted mb-0">
          © {new Date().getFullYear()} App Downloader Admin Dashboard
        </p>
        <small className="text-muted">Powered by React + Supabase</small>
      </footer>
    </>
  );
}

export default Admin;