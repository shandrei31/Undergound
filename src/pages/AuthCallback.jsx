import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const user = data.session.user;

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const userData = {
          id: user.id,
          email: user.email,
          role: profile?.role || "user"
        };

        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("storage"));

        navigate(userData.role === "admin" ? "/admin" : "/", { replace: true });
      }
    });
  }, []);

  return <p>Logging in...</p>;
}
