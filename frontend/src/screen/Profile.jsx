import React, { useState, useEffect } from "react";
import Axios from "axios";
import Breadcrumbs from "../components/Admin/Breadcrumbs";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

function Profile() {
  const [formdata, setFormdata] = useState({
    Member_id: "",
    Firstname: "",
    Lastname: "",
    Telephone: "",
    Email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchCurrentUser = () => {
    Axios.get("http://localhost:3001/api/member/checkAuth", {
      withCredentials: true,
    })
      .then((response) => {
        setFormdata((prev) => ({
          ...prev,
          Member_id: response.data.user.Member_id,
          Firstname: response.data.user.Firstname,
          Lastname: response.data.user.Lastname,
          Telephone: response.data.user.Telephone,
          Email: response.data.user.Email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      })
      .catch((error) => {
        console.error("Error fetching current user data:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลผู้ใช้ได้", "error");
      });
  };

  useEffect(() => {
    fetchCurrentUser();
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

    if (formdata.newPassword !== formdata.confirmPassword) {
      Swal.fire("รหัสผ่านไม่ตรงกัน", "กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน", "warning");
      return;
    }

    try {

      const response = await Axios.put(
        "http://localhost:3001/api/member/updateProfile",
        formdata,
        { withCredentials: true }
      );

      Swal.close();

      if (response.data.success) {
        await Swal.fire({
          title: "อัปเดตข้อมูลสำเร็จ!",
          text: "ข้อมูลส่วนตัวของคุณถูกบันทึกเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
        });

        setFormdata((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        Swal.fire("ไม่สำเร็จ", response.data.message || "ไม่สามารถอัปเดตข้อมูลได้", "error");
      }
    } catch (error) {
      Swal.close();
      console.error("Error updating profile:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", "error");
    }
  };

  return (
    <div className="kanit-medium min-h-screen bg-base-100">
      <Navbar />
      <div className="ml-4 flex flex-col">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/" },
            { label: "โปรไฟล์", path: "/Profile" },
          ]}
        />

        <h1 className="kanit-medium text-3xl mb-6">ข้อมูลส่วนตัว</h1>

        <form onSubmit={handleSubmit}>
          <fieldset className="bg-base-100 p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <label className="label kanit-medium text-lg">ชื่อ</label>
                <input
                  type="text"
                  name="Firstname"
                  className="input input-lg input-bordered w-full"
                  value={formdata.Firstname}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="label kanit-medium text-lg">นามสกุล</label>
                <input
                  type="text"
                  name="Lastname"
                  className="input input-lg input-bordered w-full"
                  value={formdata.Lastname}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="label kanit-medium text-lg">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  name="Telephone"
                  className="input input-lg input-bordered w-full"
                  value={formdata.Telephone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="label kanit-medium text-lg">อีเมล</label>
                <input
                  type="email"
                  name="Email"
                  className="input input-lg input-bordered w-full"
                  value={formdata.Email}
                  onChange={handleInputChange}
                />
              </div>

              {/* เปลี่ยนรหัสผ่าน */}
              <hr className="my-4" />
              <h2 className="text-xl kanit-medium">เปลี่ยนรหัสผ่าน</h2>

              <div>
                <label className="label kanit-medium text-lg">รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="input input-lg input-bordered w-full"
                  value={formdata.currentPassword}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="label kanit-medium text-lg">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="newPassword"
                  className="input input-lg input-bordered w-full"
                  value={formdata.newPassword}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="label kanit-medium text-lg">ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input input-lg input-bordered w-full"
                  value={formdata.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-6">
              <button type="submit" className="btn btn-primary btn-lg px-10">
                บันทึก
              </button>

              <button
                type="button"
                className="btn btn-error btn-lg px-10"
                onClick={() => {
                  Swal.fire({
                    title: "ยกเลิกการแก้ไข?",
                    text: "ข้อมูลที่ยังไม่บันทึกจะหายไป",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "ตกลง",
                    cancelButtonText: "ไม่ใช่ตอนนี้",
                  }).then((result) => {
                    if (result.isConfirmed) fetchCurrentUser();
                  });
                }}
              >
                ยกเลิก
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Profile;
