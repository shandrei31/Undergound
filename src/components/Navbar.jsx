import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(JSON.parse(localStorage.getItem("user")));
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    await supabase.auth.signOut();
    window.location.assign("/login");
  };

  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-[9999] border-b border-gray-800 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        <Link to="/" className="text-xl font-black italic tracking-tighter">
          UNDERGROUND
        </Link>

        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest">

          <Link to="/products" className="hover:text-gray-400">
            Shop
          </Link>

          <Link to="/cart" className="hover:text-gray-400">
            Cart
          </Link>

          {user ? (
            <div className="relative flex items-center gap-4 border-l border-gray-700 pl-4">

              {/* Avatar */}
              <button
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold uppercase hover:opacity-80"
              >
                {user.email?.charAt(0)}
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-12 bg-black border border-gray-700 rounded w-44 text-xs shadow-xl z-[9999]">

                  <div className="px-3 py-2 border-b border-gray-700 text-gray-400 lowercase">
                    {user.email}
                  </div>

                  {user.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 hover:bg-gray-800"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/my-orders"
                      className="block px-3 py-2 hover:bg-gray-800"
                    >
                      My Orders
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-800"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>
          ) : (
            <Link to="/login" className="border border-white px-4 py-1">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}
