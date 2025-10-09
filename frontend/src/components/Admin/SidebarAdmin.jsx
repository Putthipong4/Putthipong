import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Ticket, Users, LogOut, Menu, Guitar, Armchair, User, ListOrdered } from "lucide-react";
import Axios from "axios";
function SidebarAdmin() {

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const navigateWithLoading = (path) => {
    setIsPageLoading(true);
    setTimeout(() => {
      navigate(path);
      setIsPageLoading(false);
    }, 300);
  };

  const refreshUser = () => {
    setIsAuthLoading(true);
    Axios.get("http://localhost:3001/api/admin/checkAuthAdmin", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  };
  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    window.refreshNavbarUser = refreshUser;
    return () => { delete window.refreshNavbarUser; };
  }, []);
  const handleLogout = () => {
    document.activeElement.blur();
    Axios.post(
      "http://localhost:3001/api/logout",
      {},
      { withCredentials: true },
    )
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout failed", err);
      });
  };
  return (
    <div className="drawer lg:drawer-open">

      {isPageLoading && (
        <div className="fixed inset-0 bg-base-100 bg-opacity-70 flex items-center justify-center z-50">
          <span className="loading loading-dots loading-lg text-green-600"></span>
        </div>
      )}
      {/* toggle drawer checkbox */}
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col p-2">
        {/* Navbar (แสดงปุ่ม toggle เฉพาะหน้าจอเล็ก) */}
        <div className="mb-4 lg:hidden">
          <label
            htmlFor="admin-drawer"
            className="btn drawer-button bg-green-600 text-white"
          >
            <Menu className="h-5 w-5" /> เมนู
          </label>
        </div>

      </div>

      {isAuthLoading ? (
        <div className="loading loading-spinner mx-auto text-white"></div>
      ) : user ? (
        <div className="drawer-side">
          <label htmlFor="admin-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 min-h-full bg-green-600 text-white kanit-medium space-y-2">
            <h2 className="text-2xl ">เจ้าหน้าที่ดูแลระบบ</h2>
            <div className="flex gap-2" onClick={() => navigate('/admin/ProfileAdmin')}>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="rounded-full">
                  <User className="cursor-pointer" />
                </div>
              </div>
              <p className="kanit text-lg mt-2">{user.Firstname}</p>
            </div>

            <li>
              <a onClick={() => navigateWithLoading("/admin/HomeAdmin")}>
                <LayoutDashboard className="w-5 h-5" />
                หน้าหลัก
              </a>
            </li>
            <li>
              <a onClick={() => navigateWithLoading("/admin/member")}>
                <Users className="w-5 h-5" />
                สมาชิก
              </a>
            </li>
            <li>
              <a onClick={() => navigateWithLoading("/admin/admin")}>
                <Users className="w-5 h-5" />
                ผู้ดูแลระบบ
              </a>
            </li>
            <li>
              <a onClick={() => navigateWithLoading("/admin/manage-concert")}>
                <Ticket className="w-5 h-5" />
                คอนเสิร์ต
              </a>
            </li>

            <li>
              <a onClick={() => navigateWithLoading("/admin/showdate")}>
                <Guitar className="w-5 h-5" />
                รอบการแสดง
              </a>
              <a onClick={() => navigateWithLoading("/admin/order")}>
                <ListOrdered className="w-5 h-5" />
                คำสั่งซื้อ
              </a>
            </li>
            <li className="mt-auto">
              <a onClick={handleLogout} className="text-red-200 hover:text-white">
                <LogOut className="w-5 h-5" />
                ออกจากระบบ
              </a>
            </li>

          </ul>
        </div>
      ) : (
        <div className="drawer-side">
          <label htmlFor="admin-drawer" className="drawer-overlay"></label>
          <div className="kanit-medium min-h-screen w-64 bg-green-600 p-4 text-white">
            <h2 className="mb-6 text-2xl">แอดมิน</h2>
            <ul className="menu space-y-2">
              <li>
                <a onClick={() => navigate("/")}>
                  <LogOut className="h-5 w-5" />
                  เข้าสู่ระบบ
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  )
}

export default SidebarAdmin