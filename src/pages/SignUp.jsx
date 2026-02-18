import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" }); 
  const navigate = useNavigate();

  
  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), duration);
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) showToast(error.message, "error");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      showToast(error.message, "error"); 
    } else if (data?.user) {
      try {
        await supabase.from("profiles").insert([{ id: data.user.id, email: email, role: "user" }]);
        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.user.id, email: data.user.email, role: "user" })
        );
        showToast("Welcome to UNDERGROUND! Account created.", "success"); 
        setTimeout(() => navigate("/"), 1500); 
      } catch (err) {
        showToast("Failed to save profile!", "error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black relative">
      
      
      {toast.message && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-lg text-white font-bold uppercase z-50 transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-white p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md space-y-4">
        <h2 className="text-3xl font-black text-center tracking-tighter italic uppercase">Join the Underground</h2>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <input type="email" className="border-2 border-black w-full p-3 font-bold outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="border-2 border-black w-full p-3 font-bold outline-none" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button disabled={loading} className="bg-black text-white w-full py-3 font-black uppercase italic tracking-widest hover:bg-white hover:text-black border-2 border-black transition">
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="text-center font-black text-xs">OR</div>

        <button 
          onClick={handleGoogleAuth}
          className="w-full bg-white border-2 border-black py-3 font-black uppercase flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-4" />
          Sign up with Google
        </button>

        <p className="text-center text-[10px] font-black uppercase pt-4">
          Already a member? <Link to="/login" className="underline text-blue-600">Login here</Link>
        </p>
      </div>
    </div>
  );
}
