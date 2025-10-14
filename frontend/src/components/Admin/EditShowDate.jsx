import React, { useEffect, useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import Breadcrumbs from "./Breadcrumbs";
import Axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function EditShowDate() {
  const navigate = useNavigate();
  const { ShowDate_id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ShowDate: "",
    ShowStart: "",
    ShowTime: "",
    TotalSeat: "",
  });

   const [concertId, setConcertId] = useState("");
  const [originalSeat, setOriginalSeat] = useState("");

  //  ตรวจสอบสิทธิ์ admin
  useEffect(() => {
    Axios.get("http://localhost:3001/api/admin/checkAuthAdmin", {
      withCredentials: true,
    })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  //  ดึงข้อมูลรอบการแสดง
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Axios.get(`http://localhost:3001/api/concert/showdate/${ShowDate_id}`)
      .then((res) => {
        if (!mounted) return;
        const d = Array.isArray(res.data) ? res.data[0] || {} : res.data || {};

        const formattedDate = d.ShowDate
  ? dayjs(d.ShowDate).format("YYYY-MM-DD")
  : "";
        const formattedStart = d.ShowStart
          ? String(d.ShowStart).slice(0, 5)
          : "";

        setFormData({
          ShowDate: formattedDate,
          ShowStart: formattedStart,
          ShowTime: d.ShowTime ? String(d.ShowTime) : "",
          TotalSeat: d.TotalSeat != null ? String(d.TotalSeat) : "",
        });

        setOriginalSeat(d.TotalSeat || "");
        setConcertId(d.Concert_id || "");
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

  //  handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "TotalSeat") {
      const onlyNum = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNum }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //  handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ShowDate || !formData.ShowStart || !formData.TotalSeat) {
      Swal.fire("แจ้งเตือน", "กรุณากรอก วันแสดง เวลาเริ่ม และจำนวนที่นั่ง", "warning");
      return;
    }

    // ถ้าลดจำนวนที่นั่ง ให้เตือนก่อน
    if (parseInt(formData.TotalSeat) < parseInt(originalSeat)) {
      const confirm = await Swal.fire({
        title: "ยืนยันการลดจำนวนที่นั่ง?",
        text: "บางที่นั่งอาจถูกจองอยู่ การลดจำนวนอาจไม่สำเร็จ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });
      if (!confirm.isConfirmed) return;
    }

    setSaving(true);
    try {
      const response = await Axios.put(
        "http://localhost:3001/api/concert/UpdateShowDate",
        {
          ShowDate_id,
          Concert_id: concertId,
          ShowDate: formData.ShowDate,
          ShowStart: formData.ShowStart,
          ShowTime: formData.ShowTime,
          TotalSeat: formData.TotalSeat,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      Swal.fire({
        title: "สำเร็จ!",
        text: response.data.message || "อัปเดตรอบการแสดงสำเร็จ",
        icon: "success",
      }).then(() => navigate("/admin/showdate"));
    } catch (err) {
      console.error("Update error:", err);
      const msg =
        err.response?.data?.message ||
        "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง";

      Swal.fire({
        title: "ไม่สามารถอัปเดตได้",
        text: msg,
        icon: "error",
      });
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
                  <label className="label kanit-medium text-lg">จำนวนที่นั่ง</label>
                  <input
                    type="number"
                    name="TotalSeat"
                    className="input input-lg input-bordered kanit-medium w-full"
                    value={formData.TotalSeat}
                    onChange={(e) => {
                          const value = e.target.value;
                          if (Number(value) > 500) {
                            Swal.fire({
                              icon: "warning",
                              title: "จำนวนที่นั่งเกินกำหนด!",
                              text: "ไม่สามารถระบุเกิน 500 ที่นั่งได้",
                              confirmButtonText: "ตกลง",
                              confirmButtonColor: "#d33",
                            });
                            return; 
                          }
                          setFormData((prev) => ({ ...prev, TotalSeat: value }));
                        }}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        * จำนวนสูงสุดไม่เกิน 500 ที่นั่ง
                      </p>
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
