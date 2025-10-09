import React, { useEffect, useState } from "react";
import Axios from "axios";


function ModalEditProfile({ onProfileUpdate }) { // รับ prop onProfileUpdate
  const [user, setUser] = useState(null);
  const [formdata, setFormdata] = useState({
    Member_id: "",
    Firstname: "",
    Lastname: "",
    Telephone: "",
    Email: "",
  });

  const fetchUserData = () => {
    Axios.get("http://localhost:3001/api/member/checkAuth", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
        setFormdata({
          Member_id: response.data.user.Member_id,
          Firstname: response.data.user.Firstname,
          Lastname: response.data.user.Lastname,
          Telephone: response.data.user.Telephone,
          Email: response.data.user.Email,

        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUser(null);
      });
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.put(
        "http://localhost:3001/api/member/updateProfile",
        formdata,
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("Profile updated successfully!");
        document.getElementById("my_modal_4").close();
        fetchUserData(); // อัปเดตข้อมูลใน Modal
        if (onProfileUpdate) onProfileUpdate(); // แจ้ง Profile ให้รีเฟรชข้อมูล
        if (window.refreshNavbarUser) window.refreshNavbarUser(); // รีเฟรช Navbar ให้แสดงชื่อใหม่
      } else {
        alert("Failed to update profile: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile.");
    }
  };

  if (!user) return <div className="p-4">Loading...</div>;
  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
            ✕
          </button>
        </form>
        <form onSubmit={handleSubmit}>
          <h2 className="kanit-medium mb-5 flex justify-center text-3xl">
            Concert Ticket
          </h2>
          <fieldset className="fieldset bg-base-100 rounded-box mx-auto w-xs p-4">
            <legend className="fieldset-legend kanit-medium text-center text-xl">
              แก้ไขข้อมูลส่วนตัว
            </legend>

            <label className="label kanit-medium text-sm">ชื่อ</label>
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="text"
                required
                placeholder="กรอกชื่อ"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
                className="kanit-medium"
                name="Firstname"
                value={formdata.Firstname}
                onChange={handleInputChange}
              />
            </label>

            <label className="label kanit-medium text-sm">นามสกุล</label>
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="text"
                required
                placeholder="กรอกนามสกุล"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
                className="kanit-medium"
                name="Lastname"
                value={formdata.Lastname}
                onChange={handleInputChange}
              />
            </label>

            <label className="label kanit-medium text-sm">เบอร์โทรศัพท์</label>
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <g fill="none">
                  <path
                    d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
              <input
                type="tel"
                className="kanit-medium tabular-nums"
                required
                placeholder="กรอกเบอร์โทรศัพท์"
                pattern="[0-9]*"
                minLength="10"
                maxLength="10"
                title="Must be 10 digits"
                name="Telephone"
                value={formdata.Telephone}
                onChange={handleInputChange}
              />
            </label>

            <label className="label kanit-medium text-sm">อีเมล</label>
            <label className="input kanit-medium">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                required
                className="kanit-medium"
                placeholder="กรอกอีเมล"
                name="Email"
                value={formdata.Email}
                onChange={handleInputChange}
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary kanit-medium mt-4 text-sm"
            >บันทึก</button>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalEditProfile;