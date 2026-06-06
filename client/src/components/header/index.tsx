import React from "react";
import Bell from "../../assets/Header/Bell";
import Settings from "../../assets/Header/Settings";
import Search from "../../assets/Header/Search";
import { logout } from "../../redux/services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Header = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: () => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 h-12">
      {/* Expand button (shown when sidebar is collapsed) */}
      {collapsed && (
        <button
          onClick={setCollapsed}
          className="h-full px-3 bg-white border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] text-[#64748b] transition-colors max-md:hidden"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Search */}
      <div className="flex-1 max-md:hidden bg-white border border-[#e2e8f0] rounded-lg flex items-center gap-2 px-3 h-full hover:border-[#94a3b8] transition-colors">
        <Search className="size-4 text-[#94a3b8] shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Bell */}
        <button className="size-10 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] text-[#64748b] transition-colors">
          <Bell className="size-4" />
        </button>

        {/* Settings */}
        <button className="size-10 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] text-[#64748b] transition-colors max-md:hidden">
          <Settings className="size-4" />
        </button>

        {/* Avatar / Logout */}
        <button
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
          className="h-10 px-3 flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <span className="size-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            A
          </span>
          <span className="max-md:hidden">Admin</span>
        </button>
      </div>
    </div>
  );
};
