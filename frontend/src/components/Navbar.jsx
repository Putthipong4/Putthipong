import React, { useState, useEffect } from "react";
import ModalLogin from "./ModalLogin";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { User } from "lucide-react";

function Navbar() {
  
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshUser = () => {
    setIsAuthLoading(true);
    Axios.get("http://localhost:3001/api/member/checkAuth", { withCredentials: true })
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
    return () => {
      delete window.refreshNavbarUser;
    };
  }, []);
  const handleLogout = () => {
  document.activeElement.blur();

  Swal.fire({
    title: "ต้องการออกจากระบบหรือไม่?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่",
    cancelButtonText: "ไม่",
  }).then((result) => {
    if (result.isConfirmed) {
      Axios.post("http://localhost:3001/api/logout", {}, { withCredentials: true })
        .then(() => {
          Swal.fire({
            title: "ออกจากระบบสำเร็จ",
            icon: "success",
            confirmButtonText: "รับทราบ!",
          }).then(() => {
            setUser(null);
            navigate("/");
          });
        })
        .catch((err) => {
          console.error("Logout failed", err);
          Swal.fire({
            title: "เกิดข้อผิดพลาดในการออกจากระบบ",
            icon: "error",
          });
        });
    }
  });
};


  const navigate = useNavigate();

  return (
    <div className="navbar sticky top-0 left-0 z-50 w-full bg-green-500 p-5 shadow-xl saturate-100 ">
      <div className="navbar-start">
        <a
          className="kanit-medium cursor-pointer text-3xl"
          onClick={() => navigate("/")}
        >
          Concert Ticket
        </a>
      </div>
      <div className="navbar-end">
        {isAuthLoading ? (
          <div className="loading loading-spinner text-white"></div>
        ) : user ? (
          <div className="dropdown dropdown-end ">
            <div className="flex items-center gap-2">
              <label className="kanit-medium text-xl">{user.Firstname}</label>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <User size={39}/>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box kanit-medium z-1 mt-1 w-62 p-2 shadow"
            >
              <li>
                <a className="text-lg" onClick={() => navigate("/Profile")}>
                  ข้อมูลส่วนตัว
                </a>
              </li>
              <li>
                <a className="text-lg"  onClick={() => navigate("/MyTicket")}>บัตรของฉัน</a>
              </li>
              <li>
                <a onClick={handleLogout} className="text-lg">
                  ออกจากระบบ
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="btn btn-outline btn-sm kanit-medium rounded-full"
            onClick={() => {
              document.activeElement.blur();
              document.getElementById("my_modal_1").showModal();
            }}
          >
            เข้าสู่ระบบ
          </button>
        )}
      </div>
      <ModalLogin setUser={setUser} />
    </div>
  );
}

export default Navbar;
