import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import SidebarAdmin from "./SidebarAdmin";
import Breadcrumbs from "./Breadcrumbs";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AddConcert() {
  const [poster, setPoster] = useState("");
  const [concertname, setConcertName] = useState("");
  const [price, setPrice] = useState("");
  const [opensaledate, setOpenSaleDate] = useState("");
  const [opensaletimes, setOpenSaleTimes] = useState("");
  const [details, setDetails] = useState("");
  const [showdate, setShowDate] = useState("");
  const [showstart, setShowStart] = useState("");
  const [totalseat, setTotalSeat] = useState("");
  const [showtime, setShowTime] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const handleAddConcert = async (event) => {
    event.preventDefault();
    setLoading(true);

    const today = new Date();
    const saleDate = new Date(opensaledate);
    const concertDate = new Date(showdate);

    if (saleDate < new Date(today.toDateString())) {
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถเพิ่มคอนเสิร์ตได้",
      text: "วันเปิดจำหน่ายต้องไม่ย้อนหลังจากวันปัจจุบัน!",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#d33",
    });
    return;
  }

    if (concertDate < saleDate) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเพิ่มคอนเสิร์ตได้",
        text: "วันที่แสดงต้องไม่ก่อนวันเปิดจำหน่าย!",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (concertDate.getTime() === saleDate.getTime()) {
    Swal.fire({
      icon: "warning",
      title: "วันเปิดจำหน่ายซ้ำกับวันแสดง!",
      text: "กรุณาเลือกวันเปิดจำหน่ายให้ก่อนวันแสดงอย่างน้อย 1 วัน",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#d33",
    });
    return;
  }

    const formData = new FormData();
    formData.append("Poster", poster);
    formData.append("ConcertName", concertname);
    formData.append("Price", price);
    formData.append("OpenSaleDate", opensaledate);
    formData.append("OpenSaleTimes", opensaletimes);
    formData.append("Details", details);
    formData.append("Admin_id", user?.Admin_id);
    formData.append("ShowDate", showdate);
    formData.append("ShowStart", showstart);
    formData.append("TotalSeat", totalseat);
    formData.append("ShowTime", showtime);
    try {
      await Axios.post(
        "http://localhost:3001/api/concert/addconcert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        },
      );
      Swal.fire({
        icon: "success",
        title: "เพิ่มคอนเสิร์ตสำเร็จ",
        text: `${concertname} ถูกบันทึกเรียบร้อยแล้ว`,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#3085d6",
      });

      setConcertName("");
      setPrice("");
      setOpenSaleDate("");
      setOpenSaleTimes("");
      setDetails("");
      setPoster(null);
      setShowDate("");
      setShowStart("");
      setTotalSeat("");
      setShowTime("");
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // <-- ล้างค่าไฟล์
      }
    } catch (err) {
      if (err.response?.data?.error) {
        console.error(err.response.data.error);
      } else {
        console.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
      console.error("Error adding concert:", err);
    } finally {
      setLoading(false); // โหลดเสร็จ
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/admin/checkAuthAdmin", {
      withCredentials: true,
    })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => { });
  });

  const handleResetForm = () => {
    setConcertName("");
    setPrice("");
    setOpenSaleDate("");
    setOpenSaleTimes("");
    setDetails("");
    setPoster(null);
    setShowDate("");
    setShowStart("");
    setTotalSeat("");
    setShowTime("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    navigate("/admin/manage-concert");
  };


  return (
    <div className="drawer lg:drawer-open">
      <SidebarAdmin />
      <div className="drawer-content flex flex-col p-2">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/admin/HomeAdmin" },
            { label: "จัดการคอนเสิร์ต", path: "/admin/manage-concert" },
            { label: "เพิ่มคอนเสิร์ต", path: "/admin/Addconcert" },
          ]}
        />
        <h1 className="kanit-medium  text-3xl">เพิ่มคอนเสิร์ต</h1>
        <form action="" onSubmit={handleAddConcert}>
          <fieldset className="bg-base-100 mx-auto max-w-5xl rounded-2xl  shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* ซ้าย: ข้อมูลคอนเสิร์ต */}
              <div className="space-y-6">
                <p className="kanit-medium text-2xl">ข้อมูลคอนเสิร์ต</p>
                <div>
                  <label className="label kanit-medium text-lg">ชื่อคอนเสิร์ต</label>
                  <input
                    type="text"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={concertname}
                    onChange={(e) => setConcertName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">ราคา (ต่อ 1 บัตร)</label>
                  <input
                    type="text"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    placeholder="เช่น 1,400"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">วันเปิดจำหน่าย</label>
                  <input
                    type="date"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={opensaledate}
                    onChange={(e) => setOpenSaleDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">เวลาเปิดจำหน่าย</label>
                  <input
                    type="time"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={opensaletimes}
                    onChange={(e) => setOpenSaleTimes(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label kanit-medium text-lg">รายละเอียด</label>
                  <textarea
                    className="textarea textarea-bordered kanit-medium w-full shadow-xl"
                    rows="4"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="label kanit-medium text-lg">โปสเตอร์</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="file-input file-input-bordered w-full shadow-xl"
                    onChange={(e) => setPoster(e.target.files[0])}
                    required
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">รหัสเจ้าหน้าที่</label>
                  <input
                    type="text"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={user?.Admin_id || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* ขวา: รอบการแสดง */}
              <div className="space-y-6">
                <p className="kanit-medium text-2xl">รอบการแสดง</p>
                <div>
                  <label className="label kanit-medium text-lg">วันที่แสดง</label>
                  <input
                    type="date"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={showdate}
                    onChange={(e) => setShowDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">เวลาที่เริ่มแสดง</label>
                  <input
                    type="time"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={showstart}
                    onChange={(e) => setShowStart(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">จำนวนที่นั่ง</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={totalseat}
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
                      setTotalSeat(value);
                    }}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    * จำนวนสูงสุดไม่เกิน 500 ที่นั่ง
                  </p>
                </div>
                <div>
                  <label className="label kanit-medium text-lg">จำนวนชั่วโมงในการแสดง</label>
                  <input
                    type="text"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={showtime}
                    onChange={(e) => setShowTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ปุ่ม */}
            <div className="mt-6 flex justify-center gap-8">
              <button
                type="submit"
                className="btn btn-primary btn-lg kanit-medium px-10 shadow-xl"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "บันทึก"
                )}
              </button>
              <button
                type="reset"
                className="btn btn-error btn-lg kanit-medium px-10 shadow-xl"
                onClick={handleResetForm}
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
export default AddConcert;
