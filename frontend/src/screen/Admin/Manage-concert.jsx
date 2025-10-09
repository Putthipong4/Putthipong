import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/Admin/SidebarAdmin";
import Breadcrumbs from "../../components/Admin/Breadcrumbs";
import Axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import {  Edit2,  Plus,  Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ManageConcert() {
  
  const navigate = useNavigate();
  const [concerts, setConcerts] = useState([]);
  // ดึงข้อมูลคอนเสิร์ตจาก API
  
  useEffect(() => {
    Axios.get("http://localhost:3001/api/concert/ShowdateandConcert", {
      credentials: "include",
    }).then((response) => {
      console.log(response.data);
      setConcerts(response.data);
    });
  }, []);


  const getConcerts = async () => {
    const res = await Axios.get('http://localhost:3001/api/concert/ShowdateandConcert');
    setConcerts(res.data);
  };

  const deleteConcert = async (Concert_id) => {
  const result = await Swal.fire({
    title: "ลบข้อมูลคอนเสิร์ตนี้ใช่หรือไม่",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่",
    cancelButtonText: "ไม่",
    customClass: {
      title: "kanit-medium",
      confirmButton: "kanit-medium",
      cancelButton: "kanit-medium",
    },
  });

  if (result.isConfirmed) {
    try {
      await Axios.delete(`http://localhost:3001/api/concert/delete/${Concert_id}`);
      await Swal.fire({
        title: "ลบสำเร็จ",
        icon: "success",
        confirmButtonText: "รับทราบ!",
        customClass: {
          title: "kanit-medium",
          confirmButton: "kanit-medium",
        },
      });
      getConcerts();
    } catch (err) {
      console.error(" Delete error:", err.response?.data || err.message);
      await Swal.fire({
        title: "ลบไม่สำเร็จ",
        text: err.response?.data?.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
        icon: "error",
        confirmButtonText: "ปิด",
        customClass: {
          title: "kanit-medium",
          confirmButton: "kanit-medium",
        },
      });
    }
  }
};

const closeConcert = async (Concert_id) => {
  const result = await Swal.fire({
    title: "ต้องการปิดคอนเสิร์ตนี้หรือไม่?",
    text: "ระบบจะตั้งที่นั่งทั้งหมดของคอนเสิร์ตนี้เป็น 'จองแล้ว' (Sold Out)",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่, ปิดคอนเสิร์ต",
    cancelButtonText: "ยกเลิก",
  });

  if (result.isConfirmed) {
    try {
      await Axios.put(`http://localhost:3001/api/concert/close/${Concert_id}`);
      await Swal.fire("ปิดคอนเสิร์ตสำเร็จ!", "ที่นั่งทั้งหมดถูกจองแล้ว", "success");
      getConcerts();
    } catch {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถปิดคอนเสิร์ตได้", "error");
    }
  }
};


  const uniqueConcerts = concerts.reduce((acc, curr) => {
  if (!acc.some(c => c.Concert_id === curr.Concert_id)) {
    acc.push(curr);
  }
  return acc;
}, []);




  return (
    <div className="drawer lg:drawer-open">
      {/* drawer toggle สำหรับ mobile */}
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* Sidebar (ฝั่งซ้าย) */}
      <SidebarAdmin />

      {/* เนื้อหา (ฝั่งขวา) */}
      <div className="drawer-content flex flex-col p-2">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/admin/HomeAdmin" },
            { label: "จัดการคอนเสิร์ต", path: "/admin/manage-concert" },
          ]}
        />
        {/* เนื้อหาหลักของหน้านี้ */}
        <h1 className="kanit-medium mb-4 text-3xl">จัดการคอนเสิร์ต</h1>
        <div className="cursor-pointer ml-auto p-2 " >
          <Plus size={30} color="SpringGreen" onClick={()=> navigate('/admin/AddConcert')}/>
        </div>

        {/* ใส่ตารางหรือ card ที่แสดงคอนเสิร์ตต่างๆ ได้ที่นี่ */}

        <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border kanit-medium">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th><p className="text-center">รหัสคอนเสิร์ต</p></th>
                <th><p className="text-center">โปสเตอร์</p></th>
                <th><p className="text-center">ชื่อคอนเเสิร์ต</p></th>
                <th><p className="text-center">ราคา</p></th>
                <th><p className="text-center">วันเปิดจำหน่าย</p></th>
                <th><p className="text-center">เวลาเปิดจำหน่าย</p></th>
                <th><p className="text-center">รายละเอียด</p></th>
                <th><p className="text-center">เจ้าหน้าที่</p></th>
                <th><p className="text-center">จัดการ</p></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {uniqueConcerts.map(concert => (
                <tr key={concert.Concert_id} className="hover:bg-gray-600 hover:scale-100 transition cursor-pointer">
                  <td><p className="text-center">{concert.Concert_id}</p></td>
                  <td><p className="max-w-xs truncate mx-auto flex justify-center"><img src={`http://localhost:3001/uploads/poster/${concert.Poster}`} width="150" /></p></td>
                  <td><p className="max-w-xs truncate mx-auto text-center">{concert.ConcertName}</p></td>
                  <td><p className="text-center">{concert.Price.toLocaleString("th-TH")} บาท</p></td>
                  <td>
                    <p className="text-center">
                      {dayjs(concert.OpenSaleDate)
                        .locale("th")
                        .format("D MMMM YYYY")}
                    </p>
                  </td>
                  <td>
                    <p className=" text-center">{concert.OpenSaleTimes.slice(0, 5)} น.</p>
                  </td>
                  <td>
                    <p className="max-w-xs truncate mx-auto">{concert.Details}</p>
                  </td>
                  <td>
                    <p className="text-center">{concert.Admin_id}</p>
                  </td>
                  <td>
                    <div className="flex gap-4 justify-center">
                      <Edit2 className="cursor-pointer" color="#FFFF99" onClick={() => navigate(`/admin/EditConcert/${concert.Concert_id}`)}/>
                      <Trash2 onClick={() => deleteConcert(concert.Concert_id, concert.ShowDate_id)} className="cursor-pointer" color="#FF6666" />
                        <button
  className="btn btn-error btn-sm"
  onClick={() => closeConcert(concert.Concert_id)}
>
  ปิดคอนเสิร์ต
</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageConcert;
