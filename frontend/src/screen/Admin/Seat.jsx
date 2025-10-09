import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/Admin/SidebarAdmin";
import Breadcrumbs from "../../components/Admin/Breadcrumbs";
import Axios from "axios";
import "dayjs/locale/th";
import {  Edit2,  Plus, Trash, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Seat() {

    const [seat, setSeat] = useState([]);

    useEffect(() => {
    Axios.get("http://localhost:3001/api/concert/Showdateandseat", {
      credentials: "include",
    }).then((response) => {
      console.log(response.data);
      setSeat(response.data);
    });
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
            { label: "ที่นั่ง", path: "/admin/seat" },
          ]}
        />
        {/* เนื้อหาหลักของหน้านี้ */}
        <h1 className="kanit-medium mb-4 text-3xl">จัดการคอนเสิร์ต</h1>

        {/* ใส่ตารางหรือ card ที่แสดงคอนเสิร์ตต่างๆ ได้ที่นี่ */}

        <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border kanit-medium">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th><p className="text-center">รหัสคอนเสิร์ต</p></th>
                <th><p className="text-center">รหัสรอบการแสดง</p></th>
                <th><p className="text-center">เลขที่นั่ง</p></th>
                <th><p className="text-center">สถานะของที่นั่ง</p></th>
                <th><p className="text-center">จัดการ</p></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {seat.map(seat => (
                <tr key={seat.Seat_Number} className=" hover:bg-gray-600 hover:scale-100 transition cursor-pointer">
                    <td><p className="text-center">{seat.Concert_id}</p></td>
                    <td><p className="text-center">{seat.ShowDate_id}</p></td>
                    <td><p className="text-center">{seat.Seat_Number}</p></td>
                  <td><p className="text-center">{seat.Status}</p></td>
                  <td>
                    <div className="flex gap-4 justify-center">
                      <Edit2 className="cursor-pointer" color="#FFFF99"/>
                      <Trash2  className="cursor-pointer" color="#FF6666" />
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

export default Seat