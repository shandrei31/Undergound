import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const syncUser = () => setUser(JSON.parse(localStorage.getItem("user")));
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    sessionStorage.clear();
    supabase.auth.signOut().catch(() => {});
    window.location.assign("/login");
  };

  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-[9999] border-b border-gray-800 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-black italic tracking-tighter">UNDERGROUND</Link>
        
        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest">
          <Link to="/products" className="hover:text-gray-400">Shop</Link>
          <Link to="/cart" className="hover:text-gray-400 text-yellow-400">Cart</Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
              {user.role === "admin" ? (
                <Link to="/admin" className="bg-white text-black px-2 py-1 rounded">Admin</Link>
              ) : (
                <div className="flex items-center gap-2">
                 
                  <Link to="/my-orders" className="hover:text-blue-400 mr-2">My Orders</Link>
                  <Link  className="bg-blue-600 text-white px-2 py-1 rounded">User</Link>
                </div>
              )}
              
              <button 
                onClick={handleLogout}
                type="button"
                className="text-red-500 hover:text-red-700 cursor-pointer pointer-events-auto relative z-[10000]"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link to="/login" className="border border-white px-4 py-1">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}