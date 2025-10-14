import React, { useEffect, useState } from "react";
import Axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumbs from "../components/Admin/Breadcrumbs";
import { Star } from "lucide-react";


function MyTicket() {
  const memberId = localStorage.getItem("memberId");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!memberId) return;

    Axios.get(`http://localhost:3001/api/Order/MyTicket/${memberId}`, {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          setTickets(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching tickets:", err));
  }, [memberId]);

  const pendingTickets = tickets.filter(
    (t) => t.Status_Name === "ยืนยันคำสั่งซื้อรอการชำระเงิน"
  );
  const paidTickets = tickets.filter(
    (t) =>
      t.Status_Name === "ชำระเงินสำเร็จรอการตรวจสอบ" ||
      t.Status_Name === "ชำระเงินเสร็จสมบูรณ์"
  );

  const cancelTickets = tickets.filter(
    (t) => t.Status_Name === "ยกเลิกคำสั่งซื้อเนื่องจากไม่ชำระเงินตามกำหนด ยกเลิกโดยระบบ" || t.Status_Name === "ยกเลิกคำสั่งซื้อเนื่องจากชำระเงินไม่ถูกต้อง ยกเลิกโดยผู้ดูแลระบบ"

  );


  useEffect(() => {
    if (!memberId) return;
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [memberId]);

  const getTimeLeft = (expireTime) => {
    if (!expireTime) return 0;
    const expire = new Date(expireTime).getTime();
    const diff = Math.floor((expire - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "--:--";
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const navigate = useNavigate();

  const goToPayment = (ticket) => {
    const seats = ticket.Seat_Number.split(", ");
    const pricePerSeat = ticket.Price;
    const totalPrice = seats.length * pricePerSeat;
    navigate(`/Payment/${ticket.ShowDate_id}`, {
      state: {
        Order_id: ticket.Order_id,
        Status_id: ticket.Status_id,
        selectedSeats: ticket.Seat_Number.split(", "),
        totalPrice: totalPrice,
        ConcertName: ticket.ConcertName,
        ShowDate_id: ticket.ShowDate_id,
      },
    });
  };

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshTickets = () => {
    Axios.get(`http://localhost:3001/api/Order/MyTicket/${memberId}`, {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          setTickets(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching tickets:", err));
  };

  const [cancelledOrders, setCancelledOrders] = useState(new Set());

  useEffect(() => {
    if (!memberId) return;

    pendingTickets.forEach(async (ticket) => {
      if (ticket.Status_Name !== "ยืนยันคำสั่งซื้อรอการชำระเงิน") return;

      const timeLeft = getTimeLeft(ticket.expireTime);

      if (timeLeft === 0 && !cancelledOrders.has(ticket.Order_id)) {
        try {
          await Axios.put("http://localhost:3001/api/Order/CancelOrder", {
            Member_id: memberId,
            Order_id: ticket.Order_id,
            Seat_Number: ticket.Seat_Number.split(", "),
            Status_id: ticket.Status_id,
            ShowDate_id: ticket.ShowDate_id,
          });

          Swal.fire({
            title: "หมดเวลาชำระเงิน",
            text: `คำสั่งซื้อ ${ticket.Order_id} ถูกยกเลิกแล้ว`,
            icon: "info",
          });

          setCancelledOrders((prev) => new Set(prev).add(ticket.Order_id));

          refreshTickets();
        } catch (err) {
          console.error("Auto cancel error:", err);
        }
      }
    });
  }, [tick, memberId, pendingTickets, cancelledOrders]);

  const totalPendingAmount = pendingTickets.reduce((sum, ticket) => {
    const seatCount = ticket.Seat_Number.split(", ").filter((s) => s.trim() !== "").length;
    return sum + seatCount * Number(ticket.Price);
  }, 0);

  const totalPaidAmount = paidTickets.reduce((sum, ticket) => {
    const seatCount = ticket.Seat_Number.split(", ").filter((s) => s.trim() !== "").length;
    return sum + seatCount * Number(ticket.Price);
  }, 0);

  const totalAll = totalPendingAmount + totalPaidAmount;


  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="ml-4">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/" },
            { label: "บัตรของฉัน", path: "/Myticket" },
          ]}
        />
      </div>

      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-4xl font-extrabold text-center text-green-600 mb-10 drop-shadow kanit-medium">
          บัตรของฉัน
        </h1>
        <p className="text-xl font-extrabold text-green-700 kanit-medium m-4">
          ยอดรวมทั้งหมด: {totalAll.toLocaleString()} บาท
        </p>
        {/*  ตั๋วที่รอการชำระ */}
        <section className="mb-12 kanit-medium">
          <h2 className="text-2xl font-bold text-yellow-600 mb-6 flex items-center gap-2">
            <span className="text-3xl"></span> บัตรที่รอการชำระเงิน
          </h2>
          {pendingTickets.length === 0 ? (
            <p className="text-gray-500 italic">ไม่มีบัตรที่รอการชำระ</p>
          ) : (
            <div className="grid gap-5">
              {pendingTickets.map((ticket) => (
                <div
                  key={ticket.Order_id}
                  onClick={() => goToPayment(ticket)}
                  className="bg-white p-5 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-xl transition cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-xl text-gray-800">
                      {ticket.ConcertName}
                    </p>
                    <span className="badge badge-warning text-white px-3 py-1">
                      {ticket.Status_Name}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    รอบแสดง:{" "}
                    {dayjs(ticket.ShowDate).locale("th").format("D MMMM YYYY")}{" "}
                    {ticket.ShowStart.slice(0, 5)} น.
                  </p>
                  <p className="text-gray-600"> ที่นั่ง: {ticket.Seat_Number}</p>

                  {/*  แสดง countdown เฉพาะตั๋วที่ยังรอการชำระ */}
                  {ticket.Status_Name === "ยืนยันคำสั่งซื้อรอการชำระเงิน" && (
                    <p className="text-red-500 font-semibold mt-2">
                      กรุณาชำระเงินภายใน: {formatTime(getTimeLeft(ticket.expireTime))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>


        <section className="kanit-medium">
          <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
            <span className="text-3xl"></span> บัตรที่ชำระเงินแล้ว
          </h2>
          {paidTickets.length === 0 ? (
            <p className="text-gray-500 italic">ยังไม่มีบัตรที่ชำระแล้ว</p>
          ) : (
            <div className="grid gap-5">
              {paidTickets.map((ticket) => {
                const showDateTime = dayjs(`${ticket.ShowDateTime}`);
                const durationHours = Number(ticket.ShowTime) || 0;
                const endShowTime = showDateTime.add(durationHours, "hour");
                const canRate = dayjs().isAfter(endShowTime);

                const handleRating = async () => {
                  const { value: rating } = await Swal.fire({
                    title: `ให้คะแนนคอนเสิร์ต "${ticket.ConcertName}"`,
                    html: `
      <div id="star-container" style="font-size: 2rem; color: #ccc; cursor: pointer;">
        <span class="star" data-value="1">★</span>
        <span class="star" data-value="2">★</span>
        <span class="star" data-value="3">★</span>
        <span class="star" data-value="4">★</span>
        <span class="star" data-value="5">★</span>
      </div>
      <p id="rating-text" style="margin-top:10px; font-size:1.2rem; color:#555;">เลือกคะแนนของคุณ</p>
    `,
                    showCancelButton: true,
                    confirmButtonText: "บันทึก",
                    cancelButtonText: "ยกเลิก",
                    preConfirm: () => {
                      const selected = document.querySelector(".star.selected");
                      if (!selected) {
                        Swal.showValidationMessage("กรุณาเลือกคะแนนก่อนบันทึก");
                        return false;
                      }
                      return selected.dataset.value;
                    },
                    didOpen: () => {
                      const stars = Swal.getPopup().querySelectorAll(".star");
                      const ratingText = Swal.getPopup().querySelector("#rating-text");

                      stars.forEach((star) => {
                        star.addEventListener("click", () => {
                          stars.forEach((s) => (s.style.color = "#ccc"));
                          star.style.color = "#f59e0b"; // สีทอง
                          let value = star.dataset.value;
                          ratingText.textContent = `คุณให้คะแนน ${value} ดาว`;
                          stars.forEach((s, i) => {
                            if (i < value) s.style.color = "#f59e0b";
                            else s.style.color = "#ccc";
                          });
                          stars.forEach((s) => s.classList.remove("selected"));
                          star.classList.add("selected");
                        });
                      });
                    },
                  });

                  if (rating) {
                    try {
                      await Axios.put("http://localhost:3001/api/Order/AddRating", {
                        Member_id: memberId,
                        Concert_id: ticket.Concert_id,
                        Rating: rating,
                      });

                      Swal.fire({
                        title: "ขอบคุณสำหรับการให้คะแนน!",
                        text: `คุณให้ ${rating} ดาวแก่คอนเสิร์ต ${ticket.ConcertName}`,
                        icon: "success",
                      });
                      ticket.Rating = rating;
                      setTickets((prev) =>
                        prev.map((t) =>
                          t.Order_id === ticket.Order_id ? { ...t, Rating: rating } : t
                        )
                      );
                    } catch (error) {
                      console.error("Error saving rating:", error);
                      Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "ไม่สามารถบันทึกคะแนนได้",
                        icon: "error",
                      });
                    }
                  }
                };

                return (
                  <div
                    key={ticket.Order_id}
                    className="bg-white p-5 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition cursor-pointer"
                    onClick={() => navigate(`/QrCode/${ticket.Order_id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xl text-gray-800">
                        {ticket.ConcertName}
                      </p>

                      {ticket.Status_Name === "ชำระเงินเสร็จสมบูรณ์" ? (
                        <span className="badge badge-success text-white px-3 py-1">
                          {ticket.Status_Name}
                        </span>
                      ) : (
                        <span className="badge badge-info text-white px-3 py-1">
                          {ticket.Status_Name}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mt-2">
                      รอบแสดง:{" "}
                      {dayjs(ticket.ShowDate).locale("th").format("D MMMM YYYY")}{" "}
                      {ticket.ShowStart.slice(0, 5)} น.
                    </p>
                    <p className="text-gray-600">ที่นั่ง: {ticket.Seat_Number}</p>
                    <p className="text-gray-800 font-bold mt-2">
                      ราคารวม:{" "}
                      {(
                        ticket.Seat_Number.split(", ")
                          .filter((s) => s.trim() !== "").length * Number(ticket.Price)
                      ).toLocaleString("th-TH")}{" "}
                      บาท
                    </p>

                    {/*  แสดงปุ่มให้คะแนนถ้าเลยเวลาแสดงแล้ว */}
                    {/*  ส่วนปุ่มด้านล่าง */}
                    <div className="mt-5 flex justify-between items-center">
                      <div>
                        {/*  ปุ่มให้คะแนน หรือข้อความแทน */}
                        {canRate && !ticket.Rating ? (
                          <button
                            className="btn btn-success btn-sm rounded-full px-6 shadow-md hover:scale-105 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRating();
                            }}
                          >
                            ให้คะแนนคอนเสิร์ต
                          </button>
                        ) : ticket.Rating ? (
                          <p className="text-green-600 font-semibold">
                            คุณให้คะแนนแล้ว: {ticket.Rating} ดาว
                          </p>
                        ) : null}
                      </div>

                      <div>
                        {/* ปุ่มดูใบเสร็จ (เฉพาะสถานะ 'ชำระเงินเสร็จสมบูรณ์') */}
                        {ticket.Status_Name === "ชำระเงินเสร็จสมบูรณ์" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/Receipt/${ticket.Order_id}`);
                            }}
                            className="btn btn-outline btn-primary btn-sm rounded-full px-6 shadow hover:bg-blue-600 hover:text-white transition"
                          >
                            ดูใบเสร็จ
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/*  ตั๋วที่โดนยกเลิก */}
        <section className="kanit-medium">
          <h2 className="text-2xl font-bold  text-red-500 mb-6 flex items-center gap-2 mt-8">
            <span className="text-3xl "></span> บัตรที่ยกเลิก
          </h2>
          {cancelTickets.length === 0 ? (
            <p className="text-gray-500 italic">ยังไม่มีบัตรที่โดนยกเลิก</p>
          ) : (
            <div className="grid gap-5">
              {cancelTickets.map((ticket) => {


                return (
                  <div
                    key={ticket.Order_id}
                    className="bg-white p-5 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xl text-gray-800">
                        {ticket.ConcertName}
                      </p>
                      <span className="badge badge-error text-white px-3 py-1">
                        {ticket.Status_Name}
                      </span>
                    </div>

                    <p className="text-gray-600 mt-2">
                      รอบแสดง:{" "}
                      {dayjs(ticket.ShowDate).locale("th").format("D MMMM YYYY")}{" "}
                      {ticket.ShowStart.slice(0, 5)} น.
                    </p>
                    <p className="text-gray-600">ที่นั่ง: {ticket.Seat_Number}</p>
                    <p className="text-gray-800 font-bold mt-2">
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );

}

export default MyTicket;
