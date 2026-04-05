import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Transaction = lazy(() => import("../pages/Transaction"));

const MainRoutes = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;
