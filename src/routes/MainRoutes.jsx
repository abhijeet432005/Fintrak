import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Transaction = lazy(() => import("../pages/Transaction"));

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transaction" element={<Transaction />} />
    </Routes>
  );
};

export default MainRoutes;
