import "./style/index.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/login.tsx";
import { Register } from "./pages/auth/register.tsx";
import { Dashboard } from "./pages/dashboard/index.tsx";
import { PrivateRoute } from "./routes/privateRoute.tsx";
import { AuthLayout } from "./layout/auth/index.tsx";
import { MainLayout } from "./layout/main/index.tsx";

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
        </Route>
      </Route>
    </Routes>
  );
};
