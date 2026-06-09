import "./style/index.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Login }        from "./pages/auth/login.tsx";
import { Dashboard }    from "./pages/dashboard/index.tsx";
import { PrivateRoute } from "./routes/privateRoute.tsx";
import { AuthLayout }   from "./layout/auth/index.tsx";
import { MainLayout }   from "./layout/main/index.tsx";
import { OwnerLayout }  from "./layout/owner/index.tsx";
import { Clients as Companies }          from "./pages/clients/index.tsx";
import { ClientDetail as CompanyDetail } from "./pages/clients/detail.tsx";
import { Database }       from "./pages/database/index.tsx";
import { Account }        from "./pages/account/index.tsx";
import { LandingPage }    from "./pages/landing/index.tsx";
import { DemoRequests }   from "./pages/demo-requests/index.tsx";
import { Reports }        from "./pages/reports/index.tsx";
import { ServerLogs }     from "./pages/server-logs/index.tsx";
import { OwnerDashboard } from "./pages/owner/dashboard/index.tsx";
import { OwnerSales }     from "./pages/owner/sales/index.tsx";
import { OwnerReports }   from "./pages/owner/reports/index.tsx";

const AdminRoute = () => {
  const role = useSelector((s: any) => s.authService.role);
  if (role === "owner") return <Navigate to="/owner/dashboard" replace />;
  return <MainLayout />;
};

const OwnerRoute = () => {
  const role = useSelector((s: any) => s.authService.role);
  if (role !== "owner") return <Navigate to="/dashboard" replace />;
  return <OwnerLayout />;
};

export const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthLayout />}>
      <Route index element={<Login />} />
    </Route>
    <Route element={<PrivateRoute />}>
      {/* Admin routes */}
      <Route path="/" element={<AdminRoute />}>
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/companies"     element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/demo-requests" element={<DemoRequests />} />
        <Route path="/reports"       element={<Reports />} />
        <Route path="/database"      element={<Database />} />
        <Route path="/server-logs"   element={<ServerLogs />} />
        <Route path="/account"       element={<Account />} />
      </Route>
      {/* Owner routes */}
      <Route path="/owner" element={<OwnerRoute />}>
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="sales"     element={<OwnerSales />} />
        <Route path="reports"   element={<OwnerReports />} />
      </Route>
    </Route>
    <Route path="*" element={<div className="flex items-center justify-center h-screen text-[#94a3b8]">Page not found</div>} />
  </Routes>
);
