import React, { useEffect, useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import Breadcrumbs from "./Breadcrumbs";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditShowDate() {
  const navigate = useNavigate();
  const { ShowDate_id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ShowDate: "",   // YYYY-MM-DD
    ShowStart: "",  // HH:mm
    ShowTime: "",   // ข้อความ/นาที ตามที่ระบบคุณเก็บ
    TotalSeat: "",  // จำนวนที่นั่งทั้งหมดของรอบนี้
  });

  // เช็คสิทธิ์ admin — เรียกครั้งเดียว
  useEffect(() => {
    Axios.get("http://localhost:3001/api/admin/checkAuthAdmin", {
      withCredentials: true,
    })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // ดึงข้อมูลรอบการแสดง
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Axios.get(`http://localhost:3001/api/concert/showdate/${ShowDate_id}`)
      .then((res) => {
        if (!mounted) return;
        console.log("ShowDate payload:", res.data); // 👈 ดูโครงสร้างจริง

        // รองรับทั้ง array และ object
        const d = Array.isArray(res.data) ? res.data[0] || {} : (res.data || {});

        // --- แปลงวันที่เป็น YYYY-MM-DD ---
        // กรณี API ส่ง yyyy-mm-ddTHH:mm:ss หรือ yyyy-mm-dd ให้ดึง 10 ตัวแรกพอ
        let formattedDate = "";
        if (d.ShowDate) {
          const s = String(d.ShowDate);
          formattedDate = s.length >= 10 ? s.slice(0, 10) : s; // "2025-10-08"
        }

        // --- แปลงเวลาเริ่มเป็น HH:mm ---
        // รองรับทั้ง "HH:mm:ss" และ "HH:mm"
        let formattedStart = "";
        if (d.ShowStart) {
          const t = String(d.ShowStart);
          // ถ้าเป็น "HH:mm:ss" ให้ตัดเหลือ 5 ตัวแรก
          formattedStart = t.length >= 5 ? t.slice(0, 5) : t;
        }

        setFormData({
          ShowDate: formattedDate || "",
          ShowStart: formattedStart || "",
          ShowTime: d.ShowTime ? String(d.ShowTime) : "",
          TotalSeat: d.TotalSeat != null ? String(d.TotalSeat) : "",
        });
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching showdate:", err);
        setError("ไม่สามารถโหลดข้อมูลรอบการแสดงได้");
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [ShowDate_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "TotalSeat") {
      const onlyNum = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNum }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ShowDate || !formData.ShowStart || !formData.TotalSeat) {
      alert("กรุณากรอก วันแสดง เวลาเริ่ม และจำนวนที่นั่ง");
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append("ShowDate_id", ShowDate_id);
      data.append("ShowDate", formData.ShowDate);   // YYYY-MM-DD
      data.append("ShowStart", formData.ShowStart); // HH:mm
      data.append("ShowTime", formData.ShowTime);
      data.append("TotalSeat", formData.TotalSeat);

      await Axios.put(
        "http://localhost:3001/api/concert/UpdateShowDate",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("อัปเดตรอบการแสดงสำเร็จ");
      navigate("/admin/showdate");
    } catch (err) {
      console.error("Update error:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <SidebarAdmin />
      <div className="drawer-content flex flex-col p-2">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/admin/HomeAdmin" },
            { label: "จัดการรอบการแสดง", path: "/admin/showdate" },
            { label: "แก้ไขรอบการแสดง", path: `/admin/EditShowDate/${ShowDate_id}` },
          ]}
        />

        <h1 className="kanit-medium mb-4 text-3xl">แก้ไขรอบการแสดง</h1>

        {loading ? (
          <div className="kanit-medium p-6">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="kanit-medium p-6 text-error">{error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <fieldset className="bg-base-100 mx-auto max-w-2xl space-y-4 rounded-xl p-6">
              <div>
                <label className="label kanit-medium text-lg">รหัสรอบการแสดง</label>
                <input
                  type="text"
                  className="input input-lg input-bordered kanit-medium w-full"
                  value={ShowDate_id}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label kanit-medium text-lg">วันที่แสดง</label>
                  <input
                    type="date"
                    name="ShowDate"
                    className="input input-lg input-bordered kanit-medium w-full"
                    value={formData.ShowDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="label kanit-medium text-lg">เวลาเริ่มแสดง</label>
                  <input
                    type="time"
                    name="ShowStart"
                    className="input input-lg input-bordered kanit-medium w-full"
                    value={formData.ShowStart}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label kanit-medium text-lg">ระยะเวลาแสดง</label>
                  <input
                    type="text"
                    name="ShowTime"
                    className="input input-lg input-bordered kanit-medium w-full"
                    value={formData.ShowTime}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label kanit-medium text-lg">จำนวนที่นั่งทั้งหมด</label>
                  <input
                    type="text"
                    name="TotalSeat"
                    className="input input-lg input-bordered kanit-medium w-full"
                    value={formData.TotalSeat}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label kanit-medium text-lg">รหัสเจ้าหน้าที่</label>
                <input
                  type="text"
                  className="input input-lg input-bordered kanit-medium w-full"
                  value={user?.Admin_id || ""}
                  readOnly
                />
              </div>

              <div className="flex justify-center gap-12">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg kanit-medium px-10"
                  disabled={saving}
                >
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
                <button
                  type="button"
                  className="btn btn-error btn-lg kanit-medium px-10"
                  onClick={() => navigate("/admin/showdate")}
                  disabled={saving}
                >
                  ยกเลิก
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditShowDate;
