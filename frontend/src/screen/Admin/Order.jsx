import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/Admin/SidebarAdmin";
import Breadcrumbs from "../../components/Admin/Breadcrumbs";
import Axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


function Order() {
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState(["ทั้งหมด"]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Order/AllOrder", {
            withCredentials: true,
        }).then((response) => {
      console.log(response.data);
      setOrder(response.data);
    });
  }, []);

   const filteredOrders =
    filterStatus.includes("ทั้งหมด")
      ? order
      : order.filter((ord) => filterStatus.includes(ord.Status_Name));


  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <SidebarAdmin />

      <div className="drawer-content flex flex-col p-2">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/admin/HomeAdmin" },
            { label: "คำสั่งซื้อ", path: "/admin/order" },
          ]}
        />

        <h1 className="kanit-medium mb-4 text-3xl">จัดการคำสั่งซื้อ</h1>

        {/*  ปุ่ม Filter */}
        <div className="flex gap-3 mb-4 kanit-medium">
          <button
            className={`btn ${filterStatus === "ทั้งหมด" ? "btn-primary" : ""}`}
            onClick={() => setFilterStatus("ทั้งหมด")}
          >
            ทั้งหมด
          </button>
          <button
            className={`btn ${filterStatus === "ชำระเงินสำเร็จรอการตรวจสอบ"
                ? "btn-info"
                : ""
              }`}
            onClick={() => setFilterStatus("ชำระเงินสำเร็จรอการตรวจสอบ")}
          >
            รอการตรวจสอบ
          </button>
          <button
            className={`btn ${filterStatus === "ชำระเงินเสร็จสมบูรณ์" ? "btn-success" : ""
              }`}
            onClick={() => setFilterStatus("ชำระเงินเสร็จสมบูรณ์")}
          >
            ชำระเงินแล้ว
          </button>
          <button
            className={`btn ${
              filterStatus.includes(
                "ยกเลิกคำสั่งซื้อเนื่องจากไม่ชำระเงินตามกำหนด ยกเลิกโดยระบบ"
              ) ||
              filterStatus.includes(
                "ยกเลิกคำสั่งซื้อเนื่องจากชำระเงินไม่ถูกต้อง ยกเลิกโดยผู้ดูแลระบบ"
              )
                ? "btn-error"
                : ""
            }`}
            onClick={() =>
              setFilterStatus([
                "ยกเลิกคำสั่งซื้อเนื่องจากไม่ชำระเงินตามกำหนด ยกเลิกโดยระบบ",
                "ยกเลิกคำสั่งซื้อเนื่องจากชำระเงินไม่ถูกต้อง ยกเลิกโดยผู้ดูแลระบบ",
              ])
            }
          >
            ยกเลิกการจอง
          </button>

        </div>

        {/* ✅ ตาราง */}
        <div className="rounded-box border-base-content/5 bg-base-100 kanit-medium overflow-x-auto border">
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">รหัสคำสั่งซื้อ</th>
                <th className="text-center">ชื่อคอนเสิร์ต</th>
                <th className="text-center">วันที่แสดง</th>
                <th className="text-center">เวลาที่เริ่ม</th>
                <th className="text-center">อีเมลผู้ใช้</th>
                <th className="text-center">ชื่อ</th>
                <th className="text-center">เบอร์โทรศัพท์</th>
                <th className="text-center">จำนวนที่นั่ง</th>
                <th className="text-center">ราคารวม</th>
                <th className="text-center">สถานะคำสั่งซื้อ</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {order && filteredOrders.map((ord) => (
                <tr key={ord.Order_id}>
                  <td className="text-center">{ord.Order_id}</td>
                  <td className="text-center">{ord.ConcertName}</td>
                  <td className="text-center">
                    {dayjs(ord.ShowDate).locale("th").format("D MMMM YYYY")}
                  </td>
                  <td className="text-center">
                    {ord.ShowStart.slice(0, 5)}
                  </td>
                  <td className="text-center">{ord.Email}</td>
                  <td className="text-center">{ord.Firstname}</td>
                  <td className="text-center">{ord.Telephone}</td>
                  <td className="text-center">{ord.totalseat}</td>
                  <td className="text-center">{ord.totalprice}</td>
                  <td className="text-center p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md
                        ${ord.Status_Name === "ชำระเงินสำเร็จรอการตรวจสอบ"
                          ? "badge badge-info"
                          : ord.Status_Name === "ชำระเงินเสร็จสมบูรณ์"
                            ? "badge badge-success"
                            : ord.Status_Name === "ยกเลิกคำสั่งซื้อเนื่องจากไม่ชำระเงินตามกำหนด ยกเลิกโดยระบบ" || ord.Status_Name === "ยกเลิกคำสั่งซื้อเนื่องจากชำระเงินไม่ถูกต้อง ยกเลิกโดยผู้ดูแลระบบ"
                              ? "badge badge-error"
                              : "bg-gray-100 border border-gray-300 text-gray-700"
                        }`}
                    >
                      {ord.Status_Name}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-4">
                      {ord.Status_Name === "ชำระเงินสำเร็จรอการตรวจสอบ" && (
                        <>
                          <Edit2
                            className="cursor-pointer"
                            color="#FFFF99"
                            onClick={() =>
                              navigate(`/admin/CheckOrder/${ord.Order_id}`)
                            }
                          />
                          
                        </>
                      )}
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

export default Order