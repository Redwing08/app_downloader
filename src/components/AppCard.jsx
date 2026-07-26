function AppCard({ app }) {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">

      <div className="card h-100 shadow border-0 rounded-4">

        <div className="text-center pt-4">

          <img
            src={app.icon_url}
            alt={app.apk_name}
            style={{
              width: 90,
              height: 90,
              objectFit: "cover"
            }}
            className="rounded-4 shadow"
          />

        </div>

        <div className="card-body text-center">

          <h5 className="fw-bold">

            {app.apk_name}

          </h5>

          <span className="badge bg-primary">

            {app.category}

          </span>

          <p className="mt-2 text-muted">

            Version {app.version}

          </p>

          <p
            style={{
              minHeight: 60
            }}
          >

            {app.remarks}

          </p>

        </div>

        <div className="card-footer bg-white border-0">

          <a
            href={app.apk_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-success w-100"
          >

            📥 Download APK

          </a>

        </div>

      </div>

    </div>
  );
}

export default AppCard;