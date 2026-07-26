function AdminTable({ apps }) {
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
              <th>Download</th>
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
                  />

                </td>

                <td>{app.apk_name}</td>

                <td>{app.category}</td>

                <td>{app.version}</td>

                <td>{app.remarks}</td>

                <td>

                  <a
                    href={app.apk_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success btn-sm"
                  >
                    Download
                  </a>

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