import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const updateQty = (idx, val) => {
    const updated = [...cart];
    updated[idx].quantity = Math.max(1, updated[idx].quantity + val);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const remove = (idx) => {
    const updated = cart.filter((_, i) => i !== idx);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

  if (cart.length === 0) return <div className="py-40 text-center"><h2 className="text-4xl font-black italic">YOUR CART IS EMPTY</h2><button onClick={() => navigate("/products")} className="mt-4 underline font-bold">GO FIND SOME STYLE</button></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <h1 className="text-4xl font-black italic mb-8 border-b-4 border-black pb-2">SHOPPING BAG</h1>
      <div className="space-y-6">
        {cart.map((item, idx) => (
          <div key={idx} className="flex gap-6 items-center border-b pb-6">
            <img src={item.image_url} className="w-24 h-32 object-cover border-2 border-black" alt={item.name} />
            <div className="flex-1">
              <h2 className="text-xl font-black">{item.name}</h2>
              <p className="font-bold">₱{item.price.toLocaleString()}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="border-2 border-black flex">
                  <button onClick={() => updateQty(idx, -1)} className="px-3 py-1 font-bold">-</button>
                  <span className="px-4 py-1 border-x-2 border-black font-bold">{item.quantity}</span>
                  <button onClick={() => updateQty(idx, 1)} className="px-3 py-1 font-bold">+</button>
                </div>
                <button onClick={() => remove(idx)} className="text-red-600 text-xs font-bold underline">REMOVE</button>
              </div>
            </div>
            <p className="text-xl font-black">₱{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-right">
        <p className="text-3xl font-black">TOTAL: ₱{total.toLocaleString()}</p>
        <button onClick={() => navigate("/checkout")} className="mt-4 bg-black text-white px-12 py-4 font-black hover:bg-gray-800 transition tracking-widest">CHECKOUT NOW</button>
      </div>
    </div>
  );
}