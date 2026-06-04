import React, { useState, useEffect } from "react";
import { useGetMeQuery, useUpdateMeMutation, useChangePasswordMutation } from "../../redux/features/account/accountSlice.tsx";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/services/authService.tsx";
import { useNavigate } from "react-router-dom";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-[#64748b]">{label}</label>
    {children}
  </div>
);

const inputCls = (err?: boolean) =>
  `border rounded-lg px-3 py-2.5 text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#0f172a] transition-colors ${
    err ? "border-red-400 bg-red-50" : "border-[#e2e8f0]"
  }`;

export const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: me, isLoading } = useGetMeQuery(undefined);
  const [updateMe, { isLoading: saving }]   = useUpdateMeMutation();
  const [changePwd, { isLoading: changing }] = useChangePasswordMutation();

  const [profile, setProfile] = useState({ firstName: "", lastName: "", phoneNumber: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwdMsg,     setPwdMsg]     = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (me) setProfile({ firstName: me.firstName, lastName: me.lastName, phoneNumber: me.phoneNumber });
  }, [me]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      await updateMe(profile).unwrap();
      setProfileMsg({ type: "ok", text: "Profile updated successfully." });
    } catch (err: any) {
      setProfileMsg({ type: "err", text: err?.data?.error || "Failed to update profile." });
    }
  };

  const handleChangePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (pwd.newPassword !== pwd.confirmPassword) {
      setPwdMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    try {
      await changePwd({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }).unwrap();
      setPwdMsg({ type: "ok", text: "Password changed successfully." });
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPwdMsg({ type: "err", text: err?.data?.error || "Failed to change password." });
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-full text-sm text-[#64748b]">Loading...</div>
  );

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">Account</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Manage your admin profile and security settings.</p>
      </div>

      {/* Avatar + name banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-center gap-4">
        <div className="size-14 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xl font-bold shrink-0">
          {me?.firstName?.[0]}{me?.lastName?.[0]}
        </div>
        <div>
          <p className="text-base font-semibold text-[#0f172a]">{me?.firstName} {me?.lastName}</p>
          <p className="text-sm text-[#64748b]">{me?.email}</p>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Member since {me?.createdAt ? new Date(me.createdAt).toLocaleDateString("en-GB") : "—"}
          </p>
        </div>
        <button
          onClick={() => { dispatch(logout()); navigate("/"); }}
          className="ml-auto px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs text-[#64748b] hover:bg-[#f1f5f9] hover:text-red-500 hover:border-red-200 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Profile info */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Profile Information</h2>
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name">
              <input value={profile.firstName} onChange={(e) => setProfile(p => ({ ...p, firstName: e.target.value }))}
                className={inputCls()} placeholder="John" />
            </Field>
            <Field label="Last Name">
              <input value={profile.lastName} onChange={(e) => setProfile(p => ({ ...p, lastName: e.target.value }))}
                className={inputCls()} placeholder="Doe" />
            </Field>
          </div>
          <Field label="Email">
            <input value={me?.email ?? ""} disabled
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#94a3b8] bg-[#f8fafc] cursor-not-allowed" />
          </Field>
          <Field label="Phone Number">
            <input value={profile.phoneNumber} onChange={(e) => setProfile(p => ({ ...p, phoneNumber: e.target.value }))}
              className={inputCls()} placeholder="+994 50 000 00 00" />
          </Field>

          {profileMsg && (
            <div className={`rounded-lg px-3 py-2 text-sm border ${
              profileMsg.type === "ok"
                ? "bg-[#f0fdf4] border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}>{profileMsg.text}</div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Change Password</h2>
        <form onSubmit={handleChangePwd} className="flex flex-col gap-4">
          <Field label="Current Password">
            <input type="password" value={pwd.currentPassword}
              onChange={(e) => setPwd(p => ({ ...p, currentPassword: e.target.value }))}
              className={inputCls()} placeholder="••••••••" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="New Password">
              <input type="password" value={pwd.newPassword}
                onChange={(e) => setPwd(p => ({ ...p, newPassword: e.target.value }))}
                className={inputCls()} placeholder="••••••••" />
            </Field>
            <Field label="Confirm New Password">
              <input type="password" value={pwd.confirmPassword}
                onChange={(e) => setPwd(p => ({ ...p, confirmPassword: e.target.value }))}
                className={inputCls()} placeholder="••••••••" />
            </Field>
          </div>

          {pwdMsg && (
            <div className={`rounded-lg px-3 py-2 text-sm border ${
              pwdMsg.type === "ok"
                ? "bg-[#f0fdf4] border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}>{pwdMsg.text}</div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={changing}
              className="px-5 py-2 bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
              {changing ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
