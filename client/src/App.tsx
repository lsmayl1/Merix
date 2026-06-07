import "./style/index.css";
import { Route, Routes } from "react-router-dom";
import { Login }        from "./pages/auth/login.tsx";
import { Dashboard }    from "./pages/dashboard/index.tsx";
import { PrivateRoute } from "./routes/privateRoute.tsx";
import { AuthLayout }   from "./layout/auth/index.tsx";
import { MainLayout }   from "./layout/main/index.tsx";
import { Clients as Companies }      from "./pages/clients/index.tsx";
import { ClientDetail as CompanyDetail } from "./pages/clients/detail.tsx";
import { Database }     from "./pages/database/index.tsx";
import { Account }      from "./pages/account/index.tsx";
import { LandingPage }  from "./pages/landing/index.tsx";

export const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthLayout />}>
      <Route index element={<Login />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<MainLayout />}>
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/companies"     element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/database"     element={<Database />} />
        <Route path="/account"      element={<Account />} />
        <Route path="*"             element={<div className="flex items-center justify-center h-full text-[#94a3b8]">Page not found</div>} />
      </Route>
    </Route>
  </Routes>
);
