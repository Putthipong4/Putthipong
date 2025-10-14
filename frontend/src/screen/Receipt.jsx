import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Admin/Breadcrumbs";

function Receipt() {
  const { id } = useParams(); // ดึง Order_id จาก URL
  const [receipt, setReceipt] = useState(null);
  

  useEffect(() => {
    if (!id) return;

    Axios.get(`http://localhost:3001/api/Order/Receipt/${id}`, {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          setReceipt(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching receipt:", err);
      });
  }, [id]);

  if (!receipt) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        กำลังโหลดข้อมูลใบเสร็จ...
      </div>
    );
  }

  const {
    Order_id,
    ConcertName,
    MemberName,
    Email,
    Telephone,
    ShowDate,
    ShowStart,
    Seat_Number,
    Price,
    Receipt_Date,
    TotalPrice,
    Slip_time
  } = receipt;

  return (
    <div className="min-h-screen  ">
      <Navbar />
      <div className="ml-4">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/" },
            { label: "บัตรของฉัน", path: "/MyTicket" },
            { label: "ใบเสร็จ", path: `/Receipt/${Order_id}` },
          ]}
        />
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-10 my-10">
        {/* Header */}
        <div className="flex justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-700">Concert Ticket</h1>
            <p className="text-sm text-gray-600">Address: Kasetsart University</p>
            <p className="text-sm text-gray-600">Sakon Nakhon, Thailand</p>
          </div>

          <div className="text-right text-sm text-gray-700">
            <p className="font-semibold">Contact Us</p>
            <p>support@concertsystem.com</p>
            <p>Phone: 090-123-4567</p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold tracking-widest mt-6 mb-4 text-gray-700">
          ใบเสร็จ
        </h2>

        {/* Customer Details */}
        <div className="border rounded-lg p-5 mb-6">
          <h3 className="text-lg font-semibold text-emerald-700 mb-3">
            รายละเอียดผู้ซื้อ
          </h3>
          <div className="grid grid-cols-2 gap-x-10 text-sm text-gray-700">
            <p>
              <span className="font-medium">ชื่อ:</span> {MemberName}
            </p>
            <p>
              <span className="font-medium">อีเมล:</span> {Email}
            </p>
            <p>
              <span className="font-medium">เบอร์โทรศัพท์:</span> {Telephone}
            </p>
            <p>
              <span className="font-medium">รหัสคำสั่งซื้อ:</span> #{Order_id}
            </p>
            <p>
              <span className="font-medium">วันที่ชำระ:</span>{" "}
              {dayjs(Receipt_Date).locale("th").format("D MMMM YYYY ")}
              {(Slip_time).slice(0, 5)}
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="border rounded-lg p-5 mb-6">
          <h3 className="text-lg font-semibold text-emerald-700 mb-3">
            รายละเอียดคอนเสิร์ต
          </h3>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-emerald-700 text-white">
                <th className="border px-3 py-2">คอนเสิร์ต</th>
                <th className="border px-3 py-2">วันที่แสดง</th>
                <th className="border px-3 py-2">ที่นั่ง</th>
                <th className="border px-3 py-2">ราคาต่อบัตร</th>
                <th className="border px-3 py-2">รวม</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-700 text-center">
                <td className="border px-3 py-2">{ConcertName}</td>
                <td className="border px-3 py-2">
                  {dayjs(ShowDate).locale("th").format("D MMMM YYYY")} <br />
                  {ShowStart?.slice(0, 5)} น.
                </td>
                <td className="border px-3 py-2">{Seat_Number}</td>
                <td className="border px-3 py-2">
                  {Number(Price).toLocaleString()} บาท
                </td>
                <td className="border px-3 py-2 font-semibold text-emerald-700">
                  {Number(TotalPrice).toLocaleString()} บาท
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="text-right mb-10 text-gray-700 text-sm">
          <p>รวมทั้งหมด: {Number(TotalPrice).toLocaleString()} บาท</p>
          <h3 className="text-lg font-semibold text-emerald-700 mt-2">
            GRAND TOTAL:{" "}
            <span className="text-black font-bold">
              ฿{Number(TotalPrice).toLocaleString()}
            </span>
          </h3>
        </div>

        {/* Signature */}
        <div className="text-center mt-10">
          <p className="text-gray-700 text-sm">Authorized Stamp & Signature</p>
          <div className="border-b border-black w-52 mx-auto my-3"></div>
          <p className="text-gray-700 text-sm font-medium">Concert Ticket System</p>
        </div>

      </div>
    </div>
  );
}

export default Receipt;
