import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, []);

  const fetchMyOrders = async () => {
  try {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const emailToFind = storedUser?.email;

    if (!emailToFind) return;

   
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", emailToFind)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    
    setOrders(data || []); 
  } catch (err) {
    console.error("Fetch error:", err.message);
  } finally {
    setLoading(false);
  }
};

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "Cancelled" })
        .eq("id", orderId);

      if (error) throw error;

      alert("Order Cancelled!");
      fetchMyOrders(); 
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (!user) return <div className="p-20 text-center font-black">PLEASE LOGIN TO VIEW ORDERS</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-10 border-b-8 border-black pb-4">
        My History
      </h1>

      {loading ? (
        <p className="font-bold animate-pulse">LOADING YOUR ORDERS...</p>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center border-4 border-dashed border-gray-200">
            <p className="text-gray-400 font-black italic uppercase text-2xl">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className={`border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white ${order.status === 'Cancelled' ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase">Order Ref</p>
                  <p className="font-mono text-sm font-bold text-blue-600">#{String(order.id).slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase border-2 border-black ${order.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-yellow-400'}`}>
                    {order.status}
                  </span>
                  
                  {order.status === "Pending" && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="block mt-2 text-[10px] font-bold text-red-600 underline hover:text-red-800 ml-auto"
                    >
                      CANCEL ORDER
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {Array.isArray(order.items) && order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm font-bold uppercase">
                    <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                    <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t-2 border-dashed border-black flex justify-between items-center">
                <p className="text-[10px] font-black uppercase">Total Paid</p>
                <p className="text-2xl font-black italic">₱{Number(order.total_price).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}