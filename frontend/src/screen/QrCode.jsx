import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import Navbar from "../components/Navbar";

function QrCode() {
    const [orders, setOrders] = useState([]);
    const { Order_id } = useParams();

    useEffect(() => {

  Axios.get(`http://localhost:3001/api/Order/OrderQrcode/${Order_id}`, {
    withCredentials: true, 
  })
    .then((res) => setOrders(res.data))
    .catch((err) => console.error("Error fetching orders:", err));
}, [Order_id]);

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 p-6">

                <h2 className="text-4xl font-extrabold text-green-600 mb-10 text-center drop-shadow kanit-medium">
                    บัตรคอนเสิร์ตของคุณ
                </h2>

                <div className="grid gap-8 max-w-5xl mx-auto">
                    {orders.map((order, index) => (
                        <div
                            key={index}
                            className="relative bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200 flex flex-col md:flex-row"
                        >
                            {/*  Poster ด้านซ้าย */}
                            <div className="md:w-1/3 bg-gray-100 flex items-center justify-center">
                                <img
                                    src={`http://localhost:3001/uploads/poster/${order.Poster}`}
                                    alt="Concert Poster"
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/*  รายละเอียดบัตร */}
                            <div className="md:w-2/3 p-6 flex flex-col justify-between kanit-medium">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        {order.ConcertName}
                                    </h3>
                                    <p className="text-gray-600">
                                        {" "}
                                        {new Date(order.ShowDate).toLocaleDateString("th-TH", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}{" "}
                                        เวลา {order.ShowStart.slice(0, 5)} น.
                                    </p>
                                    <p className="text-gray-600">ที่นั่ง: {order.Seat_Number}</p>
                                    <p className="text-gray-600">ราคา: {order.Price} บาท</p>
                                    <div className="mt-2 text-gray-600">
                                        <p>สถานะ:</p>
                                        {order.Status_Name === "ชำระเงินเสร็จสมบูรณ์" ? (
                                            <div>
                                                <span className="badge badge-success text-white px-3 py-1">
                                                    {order.Status_Name}
                                                </span>
                                                <div className="flex justify-center md:justify-end mt-6">
                                                    <div className="bg-white p-3 rounded-xl shadow">
                                                        <QRCode
                                                            value={JSON.stringify({
                                                                orderId: order.Order_id,
                                                                concert: order.ConcertName,
                                                                seat: order.Seat_Number,
                                                                date: order.ShowDate,
                                                                time: order.ShowStart.slice(0, 5),
                                                                price: order.Price,
                                                            })}
                                                            size={160}
                                                            bgColor="#FFFFFF"
                                                            fgColor="#000000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="badge badge-warning text-white px-3 py-1">
                                                {order.Status_Name}
                                            </span>
                                        )}
                                    </div>

                                </div>

                                {/* 📱 QR Code */}

                            </div>

                            {/* เส้นประเหมือนตั๋ว */}
                            <div className="absolute top-0 bottom-0 left-1/3 w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QrCode;
