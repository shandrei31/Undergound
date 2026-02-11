import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Orders from "./pages/Orders";
import ProtectedAdmin from "./components/ProtectedAdmin";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    
    const checkPersistedSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await syncUserToStorage(session);
      } else {
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("storage"));
      }
    };

    checkPersistedSession();

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await syncUserToStorage(session);
        } 
        
        if (event === "SIGNED_OUT") {
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("storage"));
          navigate("/login"); 
        }
      }
    );

    
    async function syncUserToStorage(session) {
      try {
       
        let { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        
        if (!profile) {
          console.log("No profile found, creating one...");
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([{ 
                id: session.user.id, 
                email: session.user.email, 
                role: 'user' 
            }])
            .select()
            .single();

          if (insertError) throw insertError;
          profile = newProfile; 
        }

        const userData = {
          id: session.user.id,
          email: session.user.email,
          role: profile?.role || "user",
        };

        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Sync Error:", err.message);
      }
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-black">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/my-orders" element={<Orders />} />
          <Route path="/admin" element={
            <ProtectedAdmin>
              <Admin />
            </ProtectedAdmin>
          } />
        </Routes>
      </main>
      <footer className="py-6 text-center text-[10px] tracking-widest text-gray-400 border-t">
        © 2026 UNDERGROUND STREETWEAR
      </footer>
    </div>
  );
}