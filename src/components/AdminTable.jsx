function AdminTable({ apps, onEdit, onDelete }) {
  return (
    <div className="card shadow mt-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">📱 Uploaded Applications</h5>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Category</th>
              <th>Version</th>
              <th>Remarks</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {apps.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No applications uploaded yet.
                </td>
              </tr>
            )}

            {apps.map((app) => (
              <tr key={app.id}>
                <td width="80">
                  <img
                    src={app.icon_url}
                    alt={app.apk_name}
                    width="60"
                    height="60"
                    className="rounded"
                    style={{ objectFit: "cover" }}
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
                  <small className="text-secondary">{app.remarks || "N/A"}</small>
                </td>

                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    {/* Edit Button */}
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => onEdit(app)}
                    >
                      ✏️ Edit
                    </button>

                    {/* Download Link */}
                    <a
                      href={app.apk_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success btn-sm"
                      download
                    >
                      📥 Download
                    </a>

                    {/* Delete Button */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(app.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;