import "./style/index.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/login.tsx";
import { Register } from "./pages/auth/register.tsx";
import { Dashboard } from "./pages/dashboard/index.tsx";
import { PrivateRoute } from "./routes/privateRoute.tsx";
import { AuthLayout } from "./layout/auth/index.tsx";
import { MainLayout } from "./layout/main/index.tsx";
import { Sales } from "./pages/sales/index.tsx";
import { Transactions } from "./pages/transactions/index.tsx";
import { Pos } from "./pages/pos/index.tsx";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/employees" element={<div>employees</div>} />
          <Route path="/products" element={<div>products</div>} />
          <Route path="/suppliers" element={<div>suppliers</div>} />
          <Route path="/point-of-sale" element={<Pos />} />

          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Route>
    </Routes>
  );
};
