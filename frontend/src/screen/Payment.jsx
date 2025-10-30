import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Breadcrumbs from "../components/Admin/Breadcrumbs";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ShowDate_id } = useParams();
  const memberId = localStorage.getItem("memberId");

  const { selectedSeats, totalPrice, Order_id, Status_id, ConcertName } =
    location.state || {
      selectedSeats: [],
      totalPrice: 0,
      Order_id: null,
      Status_id: null,
      ConcertName,
    };

  const [paymentSlip, setPaymentSlip] = useState(null);
  const [concert, setConcert] = useState(null);
  const [order, setOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [qrImage, setQrImage] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const isPaidRef = useRef(isPaid);

  
  console.log("Order ID:", Order_id);
  useEffect(() => {
  isPaidRef.current = isPaid;
}, [isPaid]);

  // โหลดข้อมูล concert
  useEffect(() => {
    Axios.get(
      `http://localhost:3001/api/concert/ShowDateandConcert/${ShowDate_id}`,
      { withCredentials: true },
    )
      .then((res) => setConcert(res.data[0]))
      .catch((err) => console.error(err));
  }, [ShowDate_id]);

  
  // โหลด order + นับถอยหลัง
  useEffect(() => {
    if (!Order_id || isPaid) return; // ✅ ถ้า isPaid=true จะไม่ตั้ง timer แล้วนะ
    
    let timer;
    Axios.get(`http://localhost:3001/api/Order/Order/${Order_id}`, {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          console.log(order)
          setOrder(data);

          if (data.expireTime) {
            const expireTime = new Date(data.expireTime).getTime();
            timer = setInterval(() => {
              const now = Date.now();
              const diff = Math.floor((expireTime - now) / 1000);

              if (diff <= 0) {
                clearInterval(timer);

                // ✅ เช็คก่อนว่าจ่ายแล้วหรือยัง
                if (!isPaidRef.current) {
        autoCancel();
        setTimeLeft(0);
      }
              } else {
                setTimeLeft(diff);
              }
            }, 1000);
          }
        }
      })
      .catch((err) => console.error(err));

    return () => clearInterval(timer);
  }, [Order_id, isPaid]); // ✅ ใส่ isPaid ใน dependency

  // โหลด QR Code
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:3001/api/Order/GenerateQR/${totalPrice}`,
        );
        setQrImage(response.data.qrImage);
      } catch (error) {
        console.error("Error fetching QR:", error);
      }
    };

    if (totalPrice > 0) {
      fetchQR();
    }
  }, [totalPrice]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "--:--";
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const autoCancel = async () => {
    try {
      await Axios.put("http://localhost:3001/api/Order/CancelOrder", {
        Member_id: memberId,
        Seat_Number: selectedSeats,
        Order_id,
        Status_id,
        ShowDate_id,
      });

      Swal.fire({
        title: "หมดเวลาการชำระเงิน",
        text: "คำสั่งซื้อถูกยกเลิกแล้ว",
        icon: "info",
      }).then(() => navigate("/MyTicket"));
    } catch (err) {
      console.error("Auto cancel error:", err);
    }
  };

  const handleFileChange = (e) => setPaymentSlip(e.target.files[0]);

  // state
  const [slipDate, setSlipDate] = useState("");
  const [slipTime, setSlipTime] = useState("");

  const handlePayment = async () => {
    if (!paymentSlip) {
      Swal.fire({ title: "กรุณาอัปโหลดสลิปการโอนเงิน", icon: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("Slip", paymentSlip);
    formData.append("Order_id", Order_id);
    formData.append("Slip_date", slipDate);
    formData.append("Slip_time", slipTime);
    formData.append("Status_id", Status_id);

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/Order/Payment",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.success) {
        setIsPaid(true);
        setTimeLeft(0);
        if (window.paymentTimer) {
          clearInterval(window.paymentTimer);
        }
        await Swal.fire({ title: "ชำระเงินเรียบร้อย", icon: "success" });
        navigate("/MyTicket");
      } else {
        Swal.fire({
          title: response.data.message || "เกิดข้อผิดพลาด",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.message,
        icon: "error",
      });
    }
  };


  return (
    <div className="kanit-medium bg-base-100 flex min-h-screen flex-col">
      <Navbar />
      <div className="ml-4">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/" },
            { label: "ข้อมูลคอนเสิร์ต", path: `/Detail/${concert?.Concert_id || ""}` },
            { label: "เลือกที่นั่ง", path: `/seats/${ShowDate_id}` },
            { label: "กรอกเลขบัตรประชาชน", path: `/Idcard/${ShowDate_id}` },
            { label: "ชำระเงิน", path: `/Payment/${ShowDate_id}` },
          ]}
        />
      </div>
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="w-full max-w-5xl md:p-12">
          {/* Header */}
          <h1 className="mb-4 text-center text-3xl font-bold text-green-600 md:text-4xl">
            การชำระเงิน
          </h1>

          {/* QR + Info Section */}
          <div className="mb-10 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            {/* Left: Concert Info */}
            <div className="bg-base-200 rounded-xl p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-green-600">
                รายละเอียดคอนเสิร์ต
              </h2>
              <p className="text-base-content mb-2 text-lg">
                <span className="font-semibold">ชื่อคอนเสิร์ต:</span>{" "}
                {concert?.ConcertName || ConcertName}
              </p>
              <p className="text-base-content mb-2 text-lg">
                <span className="font-semibold">รอบการแสดง:</span>{" "}
                {dayjs(concert?.ShowDate).locale("th").format("D MMMM YYYY")}{" "}
                {concert?.ShowStart?.slice(0, 5)} น.
              </p>
              <p className="text-base-content mb-2 text-lg">
                <span className="font-semibold">ที่นั่ง:</span>{" "}
                {selectedSeats.join(", ")}
              </p>
              <p className="mt-4 text-lg font-bold text-green-600">
                <span className="font-semibold">ราคารวม:</span> {totalPrice} บาท
              </p>
            </div>

            {/* Right: QR Code */}
            <div className="flex flex-col items-center">
              <img
                src="https://www.bot.or.th/content/dam/bot/icons/icon-thaiqr.png"
                alt="PromptPay Logo"
                className="mb-4 w-32"
              />
              {qrImage && (
                <div className="bg-base-100 border-base-300 w-fit rounded-2xl border p-4 shadow-xl">
                  <img
                    src={qrImage}
                    alt="PromptPay QR"
                    className="h-64 w-64 object-contain"
                  />
                </div>
              )}
              <p className="text-base-content mt-4 text-lg">
                สแกนเพื่อชำระเงินผ่าน{" "}
                <span className="font-bold text-blue-600">PromptPay</span>
              </p>
              <p className="text-md text-gray-500">
                จำนวนเงิน:{" "}
                <span className="font-bold text-green-600">
                  {Number(totalPrice).toLocaleString()} บาท
                </span>
              </p>
              {/* Countdown */}
              {!isPaid && (
                <p className="mb-8 text-center text-lg font-bold text-red-500">
                  เวลาที่เหลือในการชำระเงิน: {formatTime(timeLeft)}
                </p>
              )}
            </div>
          </div>

          {/* Upload Slip */}
          <div className="mb-8">
            <label className="text-base-content mb-2 block text-lg">
              อัปโหลดสลิปการโอนเงิน
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border-base-300 text-base-content bg-base-100 w-full cursor-pointer rounded-lg border p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />

            {/* วันที่โอน */}
            <label className="text-base-content mt-4 mb-2 block text-lg">
              วันที่โอนเงิน
            </label>
            <input
              type="date"
              value={slipDate}
              onChange={(e) => setSlipDate(e.target.value)}
              className="border-base-300 text-base-content bg-base-100 w-full cursor-pointer rounded-lg border p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />

            {/* เวลาโอน */}
            <label className="text-base-content mt-4 mb-2 block text-lg">
              เวลาโอนเงิน
            </label>
            <input
              type="time"
              value={slipTime}
              onChange={(e) => setSlipTime(e.target.value)}
              className="border-base-300 text-base-content bg-base-100 w-full cursor-pointer rounded-lg border p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div>
            <button
              onClick={handlePayment}
              className="btn btn-success w-full rounded-xl py-3 text-white shadow-lg "
            >
              ยืนยันการชำระเงิน
            </button>
          </div>

          <p className="text-base-content mt-6 text-center text-sm">
            กรุณาตรวจสอบข้อมูลก่อนทำการยืนยัน
          </p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
