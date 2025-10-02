import "./style/index.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { AuthLayout } from "./layout/AuthLayout";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/dashboard";
import { MainLayout } from "./layout/MainLayout";
import { PrivateRoute } from "./routes/privateRoute";

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
