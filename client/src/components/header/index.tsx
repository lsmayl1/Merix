import React, { useState } from "react";
import Bell from "../../assets/Header/Bell";
import Settings from "../../assets/Header/Settings";
import Search from "../../assets/Header/Search";
import { logout } from "../../redux/services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";

export const Header = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: () => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const iconBtn = "h-9 w-9 flex items-center justify-center rounded-md text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-colors duration-150";

  return (
    <div className="flex items-center gap-2 h-14 px-4 bg-bg-surface border-b border-border shrink-0">
      {/* Expand button */}
      {collapsed && (
        <button
          onClick={setCollapsed}
          className={`${iconBtn} max-md:hidden`}
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Search */}
      <div className="flex-1 max-w-sm max-md:hidden bg-bg-subtle border border-border rounded-lg flex items-center gap-2 px-3 h-9 hover:border-text-muted transition-colors">
        <Search className="size-3.5 text-text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search…"
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button onClick={toggleTheme} className={iconBtn} title={isDark ? "Light mode" : "Dark mode"}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Bell */}
        <button className={iconBtn}>
          <Bell className="size-4" />
        </button>

        {/* Settings */}
        <button className={`${iconBtn} max-md:hidden`}>
          <Settings className="size-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* User + logout */}
        <button
          onClick={() => { dispatch(logout()); navigate("/"); }}
          className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-md hover:bg-bg-muted transition-colors group"
        >
          <span className="size-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0">
            A
          </span>
          <span className="text-sm font-medium text-text-primary max-md:hidden">Admin</span>
          <LogOut size={14} className="text-text-muted group-hover:text-text-secondary transition-colors max-md:hidden" />
        </button>
      </div>
    </div>
  );
};
