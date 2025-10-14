import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/Admin/SidebarAdmin";
import Axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function HomeAdmin() {
  const [concert, setConcert] = useState({});
  const [member, setMember] = useState({});
  const [order, setOrder] = useState({});
  const [ordercon, setOrdercon] = useState([]);
  const [concertList, setConcertList] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState("ทั้งหมด");
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("ทั้งหมด");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  
  const monthNames = [
    { key: "2025-01", name: "ม.ค." }, { key: "2025-02", name: "ก.พ." },
    { key: "2025-03", name: "มี.ค." }, { key: "2025-04", name: "เม.ย." },
    { key: "2025-05", name: "พ.ค." }, { key: "2025-06", name: "มิ.ย." },
    { key: "2025-07", name: "ก.ค." }, { key: "2025-08", name: "ส.ค." },
    { key: "2025-09", name: "ก.ย." }, { key: "2025-10", name: "ต.ค." },
    { key: "2025-11", name: "พ.ย." }, { key: "2025-12", name: "ธ.ค." },
  ];

  useEffect(() => {
    Axios.get("http://localhost:3001/api/dashboard/concert").then((res) =>
      setConcert(res.data)
    );
    Axios.get("http://localhost:3001/api/dashboard/member").then((res) =>
      setMember(res.data)
    );
    Axios.get("http://localhost:3001/api/dashboard/order").then((res) =>
      setOrder(res.data)
    );
    Axios.get("http://localhost:3001/api/dashboard/order/concert").then((res) =>
      setOrdercon(res.data.data || [])
    );
    Axios.get("http://localhost:3001/api/concert/ShowdateandConcert").then((res) =>
      setConcertList(res.data)
    );
  }, []);

  const fetchChartData = async () => {
    try {
      const res = await Axios.get(
        `http://localhost:3001/api/dashboard/order/chart/monthly?start=${startDate}&end=${endDate}`
      );
      const apiData = res.data.data;

      // แปลงวันที่เริ่มและสิ้นสุดเป็นเดือน (YYYY-MM)
      const startMonth = startDate.slice(0, 7);
      const endMonth = endDate.slice(0, 7);

      // ✅ กรอง monthNames ให้อยู่ในช่วงที่เลือก
      const filteredMonths = monthNames.filter(
        (m) => m.key >= startMonth && m.key <= endMonth
      );

      // ✅ รวมข้อมูลที่อยู่ในช่วงเดือนที่เลือก
      const merged = filteredMonths.map((m) => {
        const found = apiData.find((d) => d.month === m.key);
        return { month: m.name, totalprice: found ? found.totalprice : 0 };
      });

      setData(merged);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };


  useEffect(() => {
    fetchChartData();
  }, []);

  const filteredData =
    selectedMonth === "ทั้งหมด"
      ? data
      : data.filter((d) => d.month === selectedMonth);

  const totalFromGraph = filteredData.reduce(
    (sum, item) => sum + (item.totalprice || 0),
    0
  );
  const fetchConcertSales = async (concertId) => {
    try {
      const res = await Axios.get(
        `http://localhost:3001/api/dashboard/order/concert${concertId && concertId !== "ทั้งหมด" ? `?Concert_id=${concertId}` : ""
        }`
      );
      setOrdercon(res.data.data || []);
    } catch (error) {
      console.error("Error fetching concert sales:", error);
    }
  };


  //  หายอดขายสูงสุดต่อคอนเสิร์ต
  const totalSales = ordercon.reduce((sum, c) => sum + (c.totalprice || 0), 0);

  useEffect(() => {
    fetchConcertSales(selectedConcert);
  }, [selectedConcert]);

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <SidebarAdmin />
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col p-4 mt-12">
          <h1 className="kanit-medium mb-4 text-3xl">แดชบอร์ดผู้ดูแลระบบ</h1>

          {/* 🔹 Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <div className="card bg-white p-4 shadow">
              <h2 className="kanit-medium text-xl text-black">จำนวนคอนเสิร์ต</h2>
              <p className="text-2xl font-bold text-green-600">
                {concert.totalconcert}
              </p>
            </div>
            <div className="card bg-white p-4 shadow">
              <h2 className="kanit-medium text-xl text-black">จำนวนสมาชิก</h2>
              <p className="text-2xl font-bold text-green-600">
                {member.totalmember}
              </p>
            </div>
            <div className="card bg-white p-4 shadow">
              <h2 className="kanit-medium text-xl text-black">ยอดขายรวม</h2>
              <p className="text-2xl font-bold text-green-600">
                {order.totalprice
                  ? Number(order.totalprice).toLocaleString("th-TH")
                  : 0}{" "}
                บาท
              </p>
            </div>
          </div>

          {/* 🔹 ตัวกรอง */}
          <div className=" p-4 rounded-xl shadow mb-6 kanit-medium">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="kanit-medium mr-2 ">เลือกเดือน:</label>
                <select
                  className="border p-2 rounded bg-base-100"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {monthNames.map((m) => (
                    <option key={m.key} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="kanit-medium mr-2 ">วันที่เริ่มต้น:</label>
                <input
                  type="date"
                  className="border p-2 rounded "
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="kanit-medium mr-2 ">วันที่สิ้นสุด:</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <button
                onClick={fetchChartData}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                ดูข้อมูล
              </button>
            </div>
          </div>

          {/* 🔹 กราฟยอดขาย */}
          <div className="bg-white p-6 rounded-xl shadow-md kanit-medium mb-6">
            <h2 className="kanit-medium text-xl mb-4 text-black">
              ยอดขายระหว่าง {startDate} ถึง {endDate}
            </h2>

            <p className="text-lg mb-4 text-black kanit-medium">
              ยอดขายรวมในช่วงนี้:{" "}
              <span className="text-green-600 font-bold text-2xl">
                {totalFromGraph.toLocaleString("th-TH")} บาท
              </span>
            </p>

            <ResponsiveContainer width="100%" height={380}>
              <LineChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
              >
                {/* พื้นหลังและเส้นตาราง */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                {/* ชื่อแกน X / Y */}
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#334155", fontSize: 14 }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  tick={{ fill: "#334155", fontSize: 14 }}
                  tickFormatter={(v) => v.toLocaleString("th-TH")}
                  axisLine={{ stroke: "#cbd5e1" }}
                />

                {/* Tooltip สวยๆ */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                  wrapperStyle={{ color: "#2563eb" }} 
                  formatter={(value) => [`${value.toLocaleString("th-TH")} บาท`, "ยอดขาย"]}
                />

                {/* Legend */}
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 10, color: "#0f172a", }}
                />

                {/* เส้นหลัก */}
                <Line
                  type="monotone"
                  dataKey="totalprice"
                  name="ยอดขายรายเดือน"
                  color="#0f172a"
                  stroke="url(#colorGradient)"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    stroke: "#ffffff",
                    strokeWidth: 2,
                    fill: "#22c55e",
                  }}
                  activeDot={{
                    r: 9,
                    fill: "#16a34a",
                    stroke: "#065f46",
                    strokeWidth: 2,
                  }}
                  animationDuration={1200}
                />

                {/* ✅ กำหนด gradient ให้เส้นกราฟ */}
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>

          </div>
          {/*  Dropdown เลือกคอนเสิร์ต */}
          <div className=" p-4 rounded-xl shadow mb-6 kanit-medium ">
            <label className="mr-2">เลือกคอนเสิร์ต:</label>
            <select
              className="border p-2 rounded bg-base-100"
              value={selectedConcert}
              onChange={(e) => setSelectedConcert(e.target.value)}
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              {concertList.map((c) => (
                <option key={c.Concert_id} value={c.Concert_id}>
                  {c.ConcertName}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 ตารางยอดขายต่อคอนเสิร์ต */}
          <div className="bg-white p-6 rounded-xl shadow-md kanit-medium">
            <h2 className="kanit-medium text-xl mb-4 text-black">
              ยอดขาย{selectedConcert === "ทั้งหมด" ? "รวมทุกคอนเสิร์ต" : "ของคอนเสิร์ตที่เลือก"}
            </h2>
            <table className="table-auto w-full text-left border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-black">ชื่อคอนเสิร์ต</th>
                  <th className="border border-gray-300 px-3 py-2 text-right text-black">ยอดขาย (บาท)</th>
                  <th className="border border-gray-300 px-3 py-2 text-right text-black">จำนวนออเดอร์</th>
                </tr>
              </thead>
              <tbody>
                {ordercon.length > 0 ? (
                  ordercon.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-3 py-2 text-black">{item.ConcertName}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-black">
                        {Number(item.totalprice).toLocaleString("th-TH")}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-black">
                        {item.totalorders}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <p className="mt-4 text-black text-lg">
              ยอดขายรวมทั้งหมด:{" "}
              <span className="font-bold text-green-700">
                {totalSales.toLocaleString("th-TH")} บาท
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
