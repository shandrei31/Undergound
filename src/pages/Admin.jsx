import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    category: "Streetwear", 
    image_url: "",
    stock: 0 // added stock field
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" }); 

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), duration);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    setProducts(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      if (error) throw error;
      fetchOrders(); 
      showToast("Order status updated!", "success");
    } catch (err) {
      console.error("Error: " + err.message);
      showToast("Failed to update order status!", "error");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Permanently Delete this item?")) {
      try {
        const { error } = await supabase.from("orders").delete().eq("id", orderId);
        if (error) throw error;
        fetchOrders();
        showToast("Order removed from database!", "success");
      } catch (err) {
        console.error("Delete Error:", err.message);
        showToast("Failed to delete order!", "error");
      }
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await supabase.from("products").update(formData).eq("id", editingProduct.id);
        showToast("Product updated successfully!", "success");
      } else {
        await supabase.from("products").insert([formData]);
        showToast("New product posted!", "success");
      }
      setFormData({ name: "", description: "", price: "", category: "Streetwear", image_url: "", stock: 0 });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err.message);
      showToast("Failed to save product!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await supabase.from("products").delete().eq("id", id);
        fetchProducts();
        showToast("Product deleted successfully!", "success");
      } catch (err) {
        console.error(err.message);
        showToast("Failed to delete product!", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-white relative">

      {toast.message && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-lg text-white font-bold uppercase z-50 transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex gap-4 mb-10 border-b-4 border-black pb-4">
        <button onClick={() => setActiveTab("products")} className={`px-8 py-3 font-black uppercase italic border-4 border-black transition-all ${activeTab === 'products' ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-white text-black hover:bg-gray-100'}`}>Inventory</button>
        <button onClick={() => setActiveTab("orders")} className={`px-8 py-3 font-black uppercase italic border-4 border-black transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-white text-black hover:bg-gray-100'}`}>Customer Orders ({orders.length})</button>
      </div>

      {activeTab === "products" ? (
        <div className="grid md:grid-cols-3 gap-10">
          <form onSubmit={handleProductSubmit} className="border-4 border-black p-8 space-y-5 h-fit sticky top-24 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 border-b-2 border-black pb-2">{editingProduct ? 'Update Item' : 'New Drop'}</h2>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Item Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border-2 border-black font-bold outline-none bg-gray-50 focus:bg-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Price (PHP)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 border-2 border-black font-bold outline-none bg-gray-50 focus:bg-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Stock</label>
              <input type="number" value={formData.stock} min={0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full p-3 border-2 border-black font-bold outline-none bg-gray-50 focus:bg-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Image URL</label>
              <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-3 border-2 border-black font-bold outline-none bg-gray-50 focus:bg-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border-2 border-black font-bold outline-none h-24 bg-gray-50 focus:bg-white" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 font-black uppercase hover:bg-white hover:text-black border-4 border-black transition-all text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              {loading ? 'WAIT...' : (editingProduct ? 'SAVE CHANGES' : 'POST DROP')}
            </button>
            {editingProduct && <button type="button" onClick={() => {setEditingProduct(null); setFormData({name:"", description:"", price:"", category:"Streetwear", image_url:"", stock:0})}} className="w-full text-xs font-black uppercase underline mt-2 text-red-600 text-center">Cancel Edit</button>}
          </form>

          <div className="md:col-span-2 overflow-x-auto">
            <table className="w-full border-4 border-black">
              <thead className="bg-black text-white uppercase text-xs italic tracking-widest">
                <tr>
                  <th className="p-4 text-left">Preview</th>
                  <th className="p-4 text-left">Details</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock</th> {/* new stock column */}
                  <th className="p-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b-4 border-black hover:bg-gray-50 font-bold uppercase">
                    <td className="p-4 w-24"><img src={p.image_url} className="w-20 h-24 object-cover border-2 border-black" alt="" /></td>
                    <td className="p-4"><p className="text-xl font-black italic">{p.name}</p></td>
                    <td className="p-4 font-black text-lg">₱{Number(p.price).toLocaleString()}</td>
                    <td className="p-4">
                      <input 
                        type="number"
                        value={p.stock}
                        min={0}
                        onChange={async (e) => {
                          const newStock = Number(e.target.value);
                          setProducts(products.map(prod => prod.id === p.id ? {...prod, stock: newStock} : prod));
                          try {
                            await supabase.from('products').update({ stock: newStock }).eq('id', p.id);
                            showToast(`Stock updated for ${p.name}`, 'success');
                          } catch(err) {
                            console.error(err);
                            showToast('Failed to update stock!', 'error');
                          }
                        }}
                        className="w-20 p-1 border-2 border-black text-center font-bold"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <button onClick={() => {setEditingProduct(p); setFormData(p)}} className="bg-blue-600 text-white p-2 text-[10px] border-2 border-black">EDIT</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-600 text-white p-2 text-[10px] border-2 border-black">DELETE</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-4 border-black">
            <thead className="bg-black text-white italic uppercase text-[10px] tracking-widest">
              <tr>
                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-center">Action / Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const isCancelled = order.status === 'Cancelled';
                return (
                  <tr 
                    key={order.id} 
                    className={`border-b-4 border-black transition-all ${isCancelled ? 'bg-gray-100 opacity-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-4 font-mono text-xs font-bold">#{String(order.id).slice(0,8)}</td>
                    <td className="p-4 font-black text-sm uppercase">
                      {order.customer_email}
                      <p className="text-[10px] text-gray-400 font-normal">{new Date(order.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 font-black text-xl italic">₱{Number(order.total_price).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <select 
                          value={order.status} 
                          disabled={isCancelled}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`p-2 border-2 border-black font-black uppercase text-xs outline-none ${
                            isCancelled ? 'bg-gray-400 text-white cursor-not-allowed' : 
                            order.status === 'Shipped' ? 'bg-blue-500 text-white' : 
                            order.status === 'Delivered' ? 'bg-green-600 text-white' : 'bg-yellow-400'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {isCancelled && (
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-red-600 text-white px-4 py-1 text-[10px] font-black border-2 border-black hover:bg-white hover:text-red-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          >
                            DELETE ORDER
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
