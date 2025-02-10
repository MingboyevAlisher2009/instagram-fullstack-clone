import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar";

const MainLayout = () => {
  return (
    <div className="flex gap-5">
      <Sidebar />

      <Outlet />
    </div>
  );
};

export default MainLayout;
