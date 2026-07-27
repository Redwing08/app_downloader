import { useState } from "react";

function SearchSection({
    search,
    setSearch,
    category,
    setCategory
}) {

    return (

        <div className="card shadow border-0 rounded-4 mb-5">

            <div className="card-body">

                <div className="row">

                    <div className="col-md-8 mb-3">

                        <input
                            className="form-control form-control-lg"
                            placeholder="🔍 Search application..."
                            value={search}
                            onChange={(e)=>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    <div className="col-md-4">

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

                            <option>Marketing / Collection</option>

                            <option>Credit Investigator</option>
                            

                            {/* <option>Tools</option>

                            <option>Games</option>

                            <option>Education</option>

                            <option>Productivity</option> */}

                        </select>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default SearchSection;