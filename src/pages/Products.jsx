import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);


  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category]);

  const fetchProducts = async () => {
  setLoading(true);

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_archived", false) // 🔥 important
    .order("id", { ascending: false });

  if (debouncedSearch) {
    query = query.ilike("name", `%${debouncedSearch}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data } = await query;

  setProducts(data || []);

  const unique = [...new Set((data || []).map(p => p.category).filter(Boolean))];
  setCategories(unique);

  setLoading(false);
};


  const clearFilters = () => {
    setSearch("");
    setCategory("");
  };

  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(i => i.id === product.id);

    if (index !== -1) cart[index].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black uppercase">Shop Products</h1>
        <p className="opacity-60 mt-2">Discover your next streetwear fit</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full border rounded-xl py-3 px-4 font-bold focus:outline-none focus:ring"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-xl px-4 font-bold"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

      </div>

      <div className="mb-10 text-right">
        <button
          onClick={clearFilters}
          className="text-sm font-black underline opacity-70 hover:opacity-100"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {loading ? (
          <p className="col-span-full text-center font-black">Loading...</p>
        ) : products.length === 0 ? (
          <p className="col-span-full text-center font-black">No products found.</p>
        ) : (
          products.map(p => (
            <div
              key={p.id}
              className="group border rounded-2xl overflow-hidden shadow hover:shadow-xl transition bg-white flex flex-col"
            >

              <div
                onClick={() => navigate(`/product/${p.id}`)}
                className="relative aspect-[3/4] cursor-pointer overflow-hidden"
              >
                <img
                  src={p.image_url}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />

                <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full uppercase">
                  {p.category}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">

                <h2 className="font-black uppercase line-clamp-2">
                  {p.name}
                </h2>

                <p className="mt-1 font-bold text-lg">
                  ₱{Number(p.price).toLocaleString()}
                </p>

                <button
                  onClick={() => addToCart(p)}
                  className="mt-auto bg-black text-white py-2 rounded-xl font-black uppercase hover:opacity-90 active:scale-95 transition"
                >
                  Add to Cart
                </button>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
