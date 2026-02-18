import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQty = (idx, val) => {
    const updated = [...cart];

    const maxStock = updated[idx].stock || 1;
    const newQty = updated[idx].quantity + val;

    updated[idx].quantity = Math.min(
      maxStock,
      Math.max(1, newQty)
    );

    saveCart(updated);
  };

  const changeSize = (idx, newSize) => {
    const updated = [...cart];

    const currentItem = updated[idx];

    
    const existingIndex = updated.findIndex(
      (item, i) =>
        i !== idx &&
        item.id === currentItem.id &&
        item.size === newSize
    );

    if (existingIndex !== -1) {
      
      updated[existingIndex].quantity += currentItem.quantity;
      updated.splice(idx, 1);
    } else {
      updated[idx].size = newSize;
    }

    saveCart(updated);
  };

  const remove = (idx) => {
    const updated = cart.filter((_, i) => i !== idx);
    saveCart(updated);
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  if (cart.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black uppercase">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 underline font-bold"
        >
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">

  
      <div className="md:col-span-2 space-y-6">

        <h1 className="text-3xl font-black uppercase mb-6">
          Shopping Cart
        </h1>

        {cart.map((item, idx) => (
          <div
            key={idx}
            className="flex gap-4 bg-white rounded-xl shadow p-4"
          >

            <img
              src={item.image_url}
              className="w-28 h-36 object-cover rounded-lg"
              alt={item.name}
            />

            <div className="flex-1 flex flex-col">

              <h2 className="font-black uppercase">
                {item.name}
              </h2>

              <p className="font-bold mt-1">
                ₱{item.price.toLocaleString()}
              </p>

              
              {item.sizes && item.sizes.length > 0 && (
                <div className="mt-2">
                  <label className="text-xs font-bold uppercase block mb-1">
                    Size
                  </label>
                  <select
                    value={item.size || ""}
                    onChange={(e) =>
                      changeSize(idx, e.target.value)
                    }
                    className="border px-3 py-1 rounded-lg text-sm"
                  >
                    {item.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-3 mt-auto">

                <div className="flex border rounded-lg overflow-hidden">

                  <button
                    disabled={item.quantity === 1}
                    onClick={() => updateQty(idx, -1)}
                    className="px-3 font-black disabled:opacity-30"
                  >
                    –
                  </button>

                  <span className="px-4 font-bold border-x">
                    {item.quantity}
                  </span>

                  <button
                    disabled={item.quantity >= item.stock}
                    onClick={() => updateQty(idx, 1)}
                    className="px-3 font-black disabled:opacity-30"
                  >
                    +
                  </button>

                </div>

                <button
                  onClick={() => remove(idx)}
                  className="text-red-500 text-xs font-bold uppercase"
                >
                  Remove
                </button>

              </div>

            </div>

            <p className="font-black text-lg">
              ₱{(item.price * item.quantity).toLocaleString()}
            </p>

          </div>
        ))}

      </div>

     
      <div className="sticky top-20 h-fit bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-black uppercase mb-6">
          Order Summary
        </h2>

        <div className="flex justify-between font-bold mb-4">
          <span>Total</span>
          <span>₱{total.toLocaleString()}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-black text-white py-4 rounded-xl font-black uppercase hover:opacity-90 transition"
        >
          Checkout
        </button>

      </div>

    </div>
  );
}
