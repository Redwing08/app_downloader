function Hero() {
  return (
    <div
      className="rounded-4 text-white p-5 mb-5"
      style={{
        background:
          "linear-gradient(135deg,#0d6efd,#6610f2)"
      }}
    >
      <h1 className="display-4 fw-bold">
        COMPANY APP DOWNLOADER
      </h1>

      <p className="lead">
        Download all company applications in one place.
      </p>

      <button className="btn btn-light btn-lg">
        Explore Apps
      </button>

    </div>
  );
}

export default Hero;