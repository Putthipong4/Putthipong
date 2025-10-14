import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/Admin/SidebarAdmin";
import Breadcrumbs from "../../components/Admin/Breadcrumbs";
import Axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Edit2, Plus, Trash, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Showdate() {
  const [showdate, setShowdate] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:3001/api/concert/showdate", {
      credentials: "include",
    }).then((response) => {
      console.log(response.data);
      setShowdate(response.data);
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
            { label: "รอบการแสดง", path: "/admin/showdate" },
          ]}
        />
        {/* เนื้อหาหลักของหน้านี้ */}
        <h1 className="kanit-medium mb-4 text-3xl">จัดการรอบการแสดง</h1>

        {/* ใส่ตารางหรือ card ที่แสดงคอนเสิร์ตต่างๆ ได้ที่นี่ */}

        <div className="rounded-box border-base-content/5 bg-base-100 kanit-medium overflow-x-auto border">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <p className="text-center">ชื่อคอนเสิร์ต</p>
                </th>
                <th>
                  <p className="text-center">รอบการแสดง</p>
                </th>
                <th>
                  <p className="text-center">เวลาที่เริ่ม</p>
                </th>
                <th>
                  <p className="text-center">จำนวนที่นั่ง</p>
                </th>
                <th>
                  <p className="text-center">จำนวนชั่วโมงในการแสดง</p>
                </th>
                
                <th>
                  <p className="text-center">จัดการ</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {showdate.map((show) => {

                return (
                  <tr key={show.ShowDate_id}>
                    <td className="text-center">{show.ConcertName}</td>
                    <td className="text-center">{dayjs(show.ShowDate).locale("th").format("D MMMM YYYY")}</td>
                    <td className="text-center">{show.ShowStart.slice(0, 5)}</td>
                    <td className="text-center">{show.TotalSeat}</td>
                    <td className="text-center">{show.ShowTime}</td>     
                    <td>
                      <div className="flex justify-center gap-4">
                        
                        <Edit2 className="cursor-pointer" color="#FFFF99" onClick={() => navigate(`/admin/EditShowDate/${show.ShowDate_id}`)}/>
                          <Plus
                            size={30}
                            color="SpringGreen"
                            className="cursor-pointer"
                            onClick={() => navigate(`/admin/AddShowDate/${show.ShowDate_id}`)}
                          />
              
                      </div>
                    </td>
                  </tr>
                );
              })}


            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Showdate;
