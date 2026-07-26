function CategoryFilter({ category, setCategory }) {

  const categories = [
    "All",
    "Finance",
    "Games",
    "Tools",
    "Business",
    "Education"
  ];

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">

      {categories.map((item) => (

        <button
          key={item}
          className={
            category === item
              ? "btn btn-primary"
              : "btn btn-outline-primary"
          }
          onClick={() => setCategory(item)}
        >
          {item}
        </button>

      ))}

    </div>
  );
}

export default CategoryFilter;