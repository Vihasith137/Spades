import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import VerifyEmail from "./pages/VerifyEmail";
import Setup from "./pages/Setup";
import Game from "./pages/Game";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import HeaderBar from "./components/HeaderBar";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center">Loading…</div>;
  if (!user) return <Navigate to="/signin" replace />;
  if (!user.emailVerified && !user.providerData.some(p => p.providerId === "google.com")) {
    return <Navigate to="/verify" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="center-container">
      <h1>SPADES</h1>
      <div className="subtitle">Round {round} / 13</div>
          <Routes>
            <Route path="/" element={<Navigate to="/setup" replace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/setup" element={<PrivateRoute><Setup /></PrivateRoute>} />
            <Route path="/game/:sessionId" element={<PrivateRoute><Game /></PrivateRoute>} />
            <Route path="*" element={<div className="center">404</div>} />
            <div className="game-panel">
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
