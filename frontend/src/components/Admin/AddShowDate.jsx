import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import Axios from "axios";
import SidebarAdmin from './SidebarAdmin';
import Breadcrumbs from './Breadcrumbs';
import Swal from "sweetalert2";

import { useNavigate } from 'react-router-dom';
function AddShowDate() {
  const { ShowDate_id } = useParams();
  const [show, setShow] = useState("");
  const [showdate, setShowDate] = useState("");
  const [showstart, setShowStart] = useState("");
  const [totalseat, setTotalSeat] = useState("");
  const [showtime, setShowTime] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!ShowDate_id) return;

    Axios.get(`http://localhost:3001/api/concert/showdate/${ShowDate_id}`)
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.data.length > 0) {
          setShow(response.data[0]);
        }
        if (response.data.ShowDate) {
          setShow(new Date(response.data.ShowDate).toISOString().split("T")[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching concert:", error);
      });
  }, [ShowDate_id]);

  const handleAddShowDate = async (event) => {
    event.preventDefault();

    try {
      await Axios.post(
        "http://localhost:3001/api/concert/AddShowdate",
        {
          Concert_id: show?.Concert_id,
          ShowDate: showdate,
          ShowStart: showstart,
          TotalSeat: totalseat,
          ShowTime: showtime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      Swal.fire({
              icon: "success",
              title: "เพิ่มรอบการแสดงสำเร็จ",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#3085d6",
            });
      
      setShowDate("");
      setShowStart("");
      setTotalSeat("");
      setShowTime("");
      navigate("/admin/showdate");
    } catch (err) {
      if (err.response?.data?.error) {
        console.error(err.response.data.error);
      } else {
        console.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
      console.error("Error adding concert:", err);
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
            { label: "เพิ่มรอบการแสดงคอนเสิร์ต", path: "/admin/AddShowDate" },
          ]}
        />
        <h1 className="kanit-medium text-3xl">เพิ่มรอบการแสดงคอนเสิร์ต</h1>
        <form action="" onSubmit={handleAddShowDate}>
          <fieldset className="bg-base-100 mt-8">
            <div className="mx-auto max-w-xl gap-8">
              <div className="space-y-6">
                <div>
                  <label className="label kanit-medium text-lg">รหัสคอนเสิร์ต</label>
                  <input
                    type="text"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={show?.Concert_id || ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">วันที่แสดง</label>
                  <input
                    type="date"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={showdate}
                    onChange={(e) => setShowDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">เวลาที่เริ่มแสดง</label>
                  <input
                    type="time"
                    className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                    value={showstart}
                    onChange={(e) => setShowStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label kanit-medium text-lg">จำนวนที่นั่ง</label>
                  <input
                    type="text"
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

                <span className=""></span>
                บันทึก
              </button>
              <button
                type="reset"
                className="btn btn-error btn-lg kanit-medium px-10 shadow-xl"
                onClick={() => navigate(-1)}
              >
                ยกเลิก
              </button>
            </div>
          </fieldset>
        </form>

      </div>
    </div>
  )
}

export default AddShowDate