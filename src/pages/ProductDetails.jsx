import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
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

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex(
      item => item.id === product.id && item.size === selectedSize
    );

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        ...product,
        size: selectedSize || null,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    await supabase
      .from("products")
      .update({ stock: product.stock - 1 })
      .eq("id", product.id);

    setProduct(prev => ({ ...prev, stock: prev.stock - 1 }));

    navigate("/cart");
  };

  if (loading)
    return <div className="text-center py-32 text-lg font-semibold">Loading...</div>;

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">

 
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm tracking-wide text-gray-500 hover:text-black transition"
        >
          ← BACK TO SHOP
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16">

        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.image_url || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {product.stock > 0 ? (
            <div className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full tracking-wider">
              IN STOCK
            </div>
          ) : (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full tracking-wider">
              SOLD OUT
            </div>
          )}
        </div>

        
        <div className="flex flex-col justify-between">

          <div>
            <p className="uppercase text-xs tracking-[0.3em] text-gray-400 mb-4">
              {product.category}
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              {product.name}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            <p className="text-3xl font-bold mb-10">
              ₱{Number(product.price).toLocaleString()}
            </p>

         
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-10">
                <p className="text-sm font-semibold mb-4 tracking-wide">
                  SELECT SIZE
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border rounded-xl text-sm font-semibold transition
                        ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "border-gray-300 hover:border-black"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

         
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-500">
                {product.stock > 0
                  ? `${product.stock} pieces available`
                  : "Currently unavailable"}
              </span>
            </div>

            <button
              disabled={product.stock <= 0}
              onClick={addToCart}
              className={`w-full py-5 rounded-2xl text-lg font-bold tracking-wide transition
                ${
                  product.stock > 0
                    ? "bg-black text-white hover:bg-gray-900 active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {product.stock > 0 ? "ADD TO CART" : "SOLD OUT"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
