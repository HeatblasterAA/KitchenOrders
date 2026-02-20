// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Menu from "./pages/Menu";
// import Orders from "./pages/Orders";
// import Navbar from "./components/Navbar";
// import CreateOrder from "./pages/CreateOrder";

// function App() {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return (
//       <Routes>
//         <Route path="*" element={<Login />} />
//       </Routes>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/menu" element={<Menu />} />
//         <Route path="/orders/new" element={<CreateOrder />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import CreateOrder from "./pages/CreateOrder";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    // also check immediately
    const interval = setInterval(() => {
      setToken(localStorage.getItem("token"));
    }, 200);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!token) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders/new" element={<CreateOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
