import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Products() {
  const navigate = useNavigate();
  
  
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("cached_products");
    return saved ? JSON.parse(saved) : [];
  });
  
  
  const [loading, setLoading] = useState(products.length === 0);

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const fetchProducts = async () => {
    try {
     
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
      } else {
        setProducts(data || []);
        
        localStorage.setItem("cached_products", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
    } finally {
      setLoading(false); 
    }
  };

  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first to shop.");
      return navigate("/login");
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productPrice = Number(product.price) || 0;
    const index = cart.findIndex(i => i.id === product.id);
    
    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ 
        id: product.id,
        name: product.name,
        price: productPrice,
        image_url: product.image_url,
        quantity: 1 
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage")); 
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">The Feed</h1>
          <p className="text-gray-400 font-bold mt-2 tracking-widest uppercase text-sm">Latest Underground Drops</p>
        </div>
        {!loading && (
          <p className="text-black font-black bg-gray-100 px-4 py-1 text-sm border-2 border-black">
            {products.length} ITEMS AVAILABLE
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="flex flex-col animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] border-2 border-gray-100"></div>
              <div className="pt-4 space-y-2">
                <div className="h-3 w-20 bg-gray-200"></div>
                <div className="h-5 w-full bg-gray-200"></div>
                <div className="h-6 w-1/2 bg-gray-200"></div>
                <div className="h-10 w-full bg-gray-200 mt-4"></div>
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-32 border-4 border-dashed border-gray-200">
            <p className="font-black text-3xl italic text-gray-300 uppercase tracking-tighter">No Drops Available Yet.</p>
            <button onClick={fetchProducts} className="mt-4 underline font-bold hover:text-red-500">REFRESH FEED</button>
          </div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="group flex flex-col">
              <div 
                className="relative overflow-hidden bg-gray-100 aspect-[3/4] border-2 border-black cursor-pointer"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <img 
                  src={p.image_url || "https://via.placeholder.com/400x500"} 
                  alt={p.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500" 
                />
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase">
                  New
                </div>
              </div>

              <div className="pt-4 flex-1 flex flex-col">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{p.category || 'General'}</p>
                <h2 className="text-lg font-black uppercase leading-tight group-hover:underline decoration-2">{p.name}</h2>
                <p className="text-xl font-black mt-1">₱{(Number(p.price) || 0).toLocaleString()}</p>
                
                <button 
                  onClick={() => addToCart(p)} 
                  className="mt-4 w-full bg-black text-white py-3 font-black uppercase text-sm border-2 border-black hover:bg-white hover:text-black transition-all duration-300 transform active:scale-95"
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