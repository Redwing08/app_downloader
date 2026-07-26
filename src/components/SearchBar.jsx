import { FaSearch, FaFilter } from "react-icons/fa";

function SearchBar({ value, onChange }) {
  return (
    <div className="search-section shadow-sm">

      <div className="row align-items-center">

        <div className="col-lg-8 mb-3 mb-lg-0">

          <div className="input-group input-group-lg">

            <span className="input-group-text bg-white border-end-0">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search application name..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />

          </div>

        </div>

        <div className="col-lg-4 text-lg-end">

          <button className="btn btn-primary btn-lg w-100">
            <FaFilter className="me-2" />
            Search Apps
          </button>

        </div>

      </div>

    </div>
  );
}

export default SearchBar;