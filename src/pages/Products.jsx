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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products on filter change
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category]);

  const fetchProducts = async () => {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("*")
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
    <div className="max-w-7xl mx-auto p-6 min-h-screen">

     
      <div className="grid md:grid-cols-3 gap-4 mb-10">

        
        <div className="relative md:col-span-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full border-2 border-black py-3 pl-10 pr-10 font-bold uppercase"
          />

          <span className="absolute left-3 top-1/2 -translate-y-1/2"> </span>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-black"
            >
              X
            </button>
          )}
        </div>

       
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-2 border-black px-3 font-bold uppercase"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

      </div>

      <button
        onClick={clearFilters}
        className="mb-8 underline font-black"
      >
        CLEAR FILTERS
      </button>

     
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {loading ? (
          <p className="col-span-full text-center font-black">Loading...</p>
        ) : products.length === 0 ? (
          <p className="col-span-full text-center font-black">No products found.</p>
        ) : (
          products.map(p => (
            <div key={p.id} className="flex flex-col h-full">

              <div
                onClick={() => navigate(`/product/${p.id}`)}
                className="aspect-[3/4] border-2 border-black cursor-pointer overflow-hidden"
              >
                <img
                  src={p.image_url}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col flex-1">

                <h2 className="font-black mt-3 uppercase line-clamp-2">
                  {p.name}
                </h2>

                <p className="font-black mt-1">
                  ₱{Number(p.price).toLocaleString()}
                </p>

                <button
                  onClick={() => addToCart(p)}
                  className="mt-auto bg-black text-white py-2 font-black uppercase"
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
