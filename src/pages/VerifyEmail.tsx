import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail(){
  const { user, resendVerification, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="center">
      <div className="card">
        <h2>Verify your email</h2>
        <p>We sent a verification link to <b>{user?.email}</b>. Click it, then return and sign in.</p>
        <div className="row">
          <button onClick={resendVerification}>Resend email</button>
          <button className="ghost" onClick={()=>nav("/signin")}>Go to Sign in</button>
          <button className="link" onClick={logout}>Log out</button>
        </div>
      </div>
    </div>
  );
}
