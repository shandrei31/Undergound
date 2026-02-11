import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/");
  }, [navigate]);

  
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin 
      }
    });
    if (error) alert(error.message);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data?.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        const userData = { id: data.user.id, email: data.user.email, role: profile?.role || "user" };
        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("storage"));
        navigate(userData.role === "admin" ? "/admin" : "/", { replace: true });
      }
    } catch (err) {
      alert("Login Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans text-black">
      <div className="bg-white p-10 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <h1 className="text-5xl font-black italic mb-8 tracking-tighter uppercase">Login</h1>
        
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-4 border-2 border-black font-bold outline-none focus:bg-gray-50" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-4 border-2 border-black font-bold outline-none focus:bg-gray-50" />
          <button disabled={loading} className="w-full bg-black text-white py-4 font-black uppercase text-xl hover:bg-white hover:text-black border-2 border-black transition transform active:scale-95">
            {loading ? "AUTHENTICATING..." : "Enter the Shop"}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <hr className="border-t-2 border-black" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 font-black uppercase text-xs italic">OR</span>
        </div>

        
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black py-4 border-2 border-black font-black uppercase flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest">
          No account yet? <Link to="/signup" className="underline text-blue-600">Create Account</Link>
        </p>
      </div>
    </div>
  );
}