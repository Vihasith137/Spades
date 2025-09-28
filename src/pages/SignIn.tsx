import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function SignIn() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState<"signin"|"signup">("signin");
  const nav = useNavigate();

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user && !cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        alert("We sent a verification email. Please verify, then sign in.");
      }
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/setup");
    }
  };

  const handleGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    nav("/setup");
  };

  return (
    <div className="card playing-card">

	<div className="center">
      <div className="card">
        <h1>Spades League</h1>
        <p>Create an account or sign in</p>
        <form onSubmit={handleEmail} className="stack">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit">{mode === "signup" ? "Sign up" : "Sign in"}</button>
        </form>
        <button className="ghost" onClick={handleGoogle}>Continue with Google</button>
        <button className="link" onClick={()=>setMode(m=> m === "signup" ? "signin" : "signup")}>{mode === "signup" ? "Have an account? Sign in" : "New here? Create an account"}</button>
      </div>
    </div>
	</div>
  );
}
