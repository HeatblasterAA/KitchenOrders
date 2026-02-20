import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600";

  return (
    <div className="bg-white shadow-md p-4 flex justify-between">

      <div className="flex gap-4">

        <Link to="/" className={isActive("/")}>
          Dashboard
        </Link>

        <Link to="/menu" className={isActive("/menu")}>
          Menu
        </Link>

        <Link to="/orders" className={isActive("/orders")}>
          Orders
        </Link>

        <Link to="/orders/new" className={isActive("/orders/new")}>
          Create
        </Link>

      </div>

      <button
        onClick={logout}
        className="text-red-600 font-semibold"
      >
        Logout
      </button>

    </div>
  );
}