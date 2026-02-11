import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" }); 
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  
  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), duration);
  };

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(rawUser);
    setUserEmail(parsedUser.email);
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, [navigate]);

  const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return showToast("Your cart is empty!", "error"); // toast instead of alert
    setLoading(true);

    try {
      const cleanItems = cart.map(item => ({
        name: item.name || "Unknown Item",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      }));

      const orderData = {
        customer_email: userEmail,
        total_price: Number(total),
        items: cleanItems,
        status: "Pending"
      };

      console.log("Sending to DB:", orderData);

      const { error } = await supabase.from("orders").insert([orderData]);

      if (error) {
        console.error("Supabase Error:", error);
        showToast("Database Error: " + error.message, "error"); 
        setLoading(false);
        return;
      }

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));

      showToast("Order placed successfully!", "success"); 
      setTimeout(() => navigate("/my-orders"), 1500); 
    } catch (err) {
      console.error("System Error:", err);
      showToast("System Error: " + err.message, "error"); 
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="p-20 text-center font-black uppercase">Cart is Empty</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 py-12 relative">

      
      {toast.message && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-lg text-white font-bold uppercase z-50 transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-10 border-b-8 border-black pb-4 text-center">Checkout</h1>

      <div className="border-4 border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-10">
        <p className="mb-4 font-bold uppercase text-xs text-gray-400">Customer: {userEmail}</p>
        <div className="space-y-4 mb-8">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between font-bold uppercase italic border-b-2 border-gray-100 pb-2">
              <span>{item.name} x{item.quantity}</span>
              <span>₱{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-end border-t-4 border-black pt-4">
          <p className="font-black uppercase text-xl text-gray-400">Total Amount</p>
          <p className="font-black text-5xl tracking-tighter italic">₱{total.toLocaleString()}</p>
        </div>
      </div>

      <button
        onClick={placeOrder}
        disabled={loading}
        className="w-full bg-black text-white py-6 font-black uppercase text-2xl border-4 border-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none disabled:opacity-50"
      >
        {loading ? "SAVING..." : "CONFIRM ORDER"}
      </button>
    </div>
  );
}
