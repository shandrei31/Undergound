import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { supabase } from "../supabase";

export default function ProductDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      navigate("/products");
    } else {
      setProduct(data);
    }

    setLoading(false);
  };

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    if (product.stock <= 0) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(item => item.id === product.id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔥 reduce stock in Supabase
    await supabase
      .from("products")
      .update({ stock: product.stock - 1 })
      .eq("id", product.id);

    setProduct(prev => ({ ...prev, stock: prev.stock - 1 }));

    navigate("/cart");
  };

  if (loading) return <div className="text-center py-20 font-black">Loading...</div>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">

      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm underline text-gray-500"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">

        <img
          src={product.image_url || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full md:w-1/2 rounded-xl object-cover shadow-lg"
          style={{ maxHeight: "500px" }}
        />

        <div className="flex-1 flex flex-col justify-center">

          <span className="text-gray-500 uppercase tracking-wide text-sm font-semibold">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mb-4 mt-2">
            {product.name}
          </h1>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-3xl font-semibold mb-2">
            ₱{Number(product.price).toLocaleString()}
          </p>

          {/* STOCK */}
          <p className={`mb-6 font-bold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0
              ? `${product.stock} LEFT IN STOCK`
              : "OUT OF STOCK"}
          </p>

          <button
            disabled={product.stock <= 0}
            onClick={addToCart}
            className={`py-4 w-full rounded-lg transition text-lg font-medium ${
              product.stock > 0
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {product.stock > 0 ? "Add to Cart" : "Sold Out"}
          </button>

        </div>
      </div>
    </div>
  );
}
