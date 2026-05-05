import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { CategoryPage } from "@/pages/CategoryPage";
import { ToolDetail } from "@/pages/ToolDetail";
import { Topics } from "@/pages/Topics";
import { UserCenter } from "@/pages/UserCenter";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? "" : "flex-1"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/user/favorites" element={<UserCenter />} />
          <Route path="/user/history" element={<UserCenter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
