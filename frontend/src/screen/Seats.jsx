import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Axios from "axios";
import { Armchair } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Admin/Breadcrumbs";

function Seats() {
  const navigate = useNavigate();
  const { ShowDate_id } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const memberId = localStorage.getItem("memberId");
  const [alreadyBooked, setAlreadyBooked] = useState(0);

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/api/concert/ShowDateandConcert/${ShowDate_id}`,
      {
        withCredentials: true,
      },
    ).then((response) => {
      setSeats(response.data);
    });
  }, [ShowDate_id]);

  useEffect(() => {
    if (!memberId) return;
    Axios.get(`http://localhost:3001/api/Order/MemberSeats/${memberId}/${ShowDate_id}`,
      {
        withCredentials: true,
      },
    )

      .then((res) => {
        if (res.data.success) {
          setAlreadyBooked(res.data.count);
        }
      })
      .catch((err) => console.error("Error fetching booked seats:", err));
  }, [memberId, ShowDate_id]);

  const rows = {};

  seats.forEach((s) => {
    if (!s.Seat_Number) return; // กัน null

    const seatCode = s.Seat_Number; // เช่น "A1"
    const row = seatCode.charAt(0); // A, B, C...
    const seatNum = parseInt(seatCode.slice(1), 10); // 1,2,10...

    if (!rows[row]) rows[row] = [];
    rows[row].push({ ...s, seatNum });
  });

  Object.keys(rows).forEach((row) => {
    rows[row].sort((a, b) => a.seatNum - b.seatNum);
  });

  const toggleSeat = (seatNumber, status) => {
    if (status !== "ว่าง") return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
      return;
    }

    if (selectedSeats.length >= 4) {
      Swal.fire({
        title: "คุณจองครบ 4 ที่นั่งแล้ว",
        text: "ไม่สามารถจองเพิ่มในรอบนี้ได้",
        icon: "warning",
      });
      return;
    }

    if (!selectedSeats.includes(seatNumber) && selectedSeats.length + alreadyBooked >= 4) {
      Swal.fire({
        title: "จำกัดที่นั่ง",
        text: "คุณสามารถจองได้ไม่เกิน 4 ที่นั่งต่อรอบการแสดง",
        icon: "warning",
      });
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const pricePerSeat = seats.length > 0 ? seats[0].Price : 0;
  const totalPrice = pricePerSeat * selectedSeats.length;



  const handleSubmit = async () => {
    if (selectedSeats.length === 0) {
      Swal.fire({
        title: "กรุณาเลือกที่นั่งก่อน",
        icon: "warning",
      });
      return;
    }

    const result = await Swal.fire({
      title: "ต้องการยืนยันที่นั่งหรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่",
    });

    if (result.isConfirmed) {
      navigate(`/Idcard/${ShowDate_id}`, {
        state: { selectedSeats, totalPrice, pricePerSeat },
      });
    }
  };
  return (
    <div className="bg-base-100 flex min-h-screen flex-col">
      <Navbar />
      <div className="ml-4">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/" },
            { label: "ข้อมูลคอนเสิร์ต", path: `/Detail/${seats[0]?.Concert_id || ""}` },
            { label: "เลือกที่นั่ง", path: `/seats/${ShowDate_id}` },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-4  items-start">

        <div className="mt-10">
          <h1 className="kanit-medium mt-5 text-center text-xl font-bold">
            {seats.length > 0 ? seats[0].ConcertName : "Loading..."}
          </h1>
          <p className="kanit-medium mt-5 text-center text-gray-300 text-lg">
            รอบการแสดง :{" "}
            {seats.length > 0
              ? dayjs(seats[0].ShowDate).locale("th").format("D MMMM YYYY")
              : "Loading..."}{" "}
            {seats.length > 0 ? seats[0].ShowStart.slice(0, 5) : "Loading..."} น.
          </p>
          {seats.length > 0 && (
            <figure className="h-[250px] md:h-[350px] mx-auto flex justify-center mt-5">
              <img
                src={`http://localhost:3001/uploads/poster/${seats[0].Poster}`}
                alt="Poster"
                className="h-full object-contain rounded-xl shadow-lg"
              />
            </figure>
          )}

          <p className="text-center text-red-500 font-bold mt-2">
            คุณจองแล้ว {alreadyBooked} ที่นั่ง
            {alreadyBooked < 4
              ? ` | ยังสามารถเลือกได้อีก ${4 - alreadyBooked} ที่นั่ง`
              : " | คุณจองครบ 4 ที่แล้ว"}
          </p>
        </div>


        <div className="mx-auto max-w-5xl w-full">

          <div className="flex justify-center mb-6 mt-5">
            <div className="bg-gray-800 text-white rounded-xl shadow-lg text-lg font-bold h-[60px] md:h-[80px] w-[250px] md:w-[400px] flex items-center justify-center">
              <p className="text-center">Stage</p>
            </div>
          </div>


          {Object.keys(rows)
            .sort()
            .map((row) => (
              <div
                key={row}
                className="mb-3 flex items-center justify-center text-sm md:text-base"
              >
                <span className="mr-2 w-6 font-bold">{row}</span>
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${rows[row].length}, 1fr)`,
                  }}
                >
                  {rows[row].map((s, index) => {
                    const isSelected = selectedSeats.includes(s.Seat_Number);
                    return (
                      <div
                        key={index}
                        className="flex cursor-pointer flex-col items-center"
                        onClick={() => toggleSeat(s.Seat_Number, s.Status)}
                      >
                        <Armchair
                          size={18}
                          className={`${s.Status !== "ว่าง"
                            ? "text-gray-600"
                            : isSelected
                              ? "text-red-500"
                              : "text-green-400"
                            }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

        </div>
        <div className="w-full md:w-90 bg-white rounded-2xl shadow-lg self-start mx-auto mt-50">
          <div>
            <h1 className="kanit-medium text-xl font-bold text-black p-2 bg-green-400 rounded-t-2xl">
              รายละเอียดการซื้อ
            </h1>
          </div>
          <div className="mx-auto p-6 space-y-3">
            {/* ที่นั่ง */}
            <div className="flex justify-between border-b pb-2">
              <span className="kanit-medium text-lg text-gray-700">
                ที่นั่งที่คุณเลือก
              </span>
              <span className="kanit-medium text-lg text-black">
                {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "-"}
              </span>
            </div>


            <div className="flex justify-between border-b pb-2">
              <span className="kanit-medium text-lg text-gray-700">
                รอบการแสดง
              </span>
              <span className="kanit-medium text-lg text-black">
                {seats.length > 0
                  ? dayjs(seats[0].ShowDate)
                    .locale("th")
                    .format("D MMMM YYYY")
                  : "Loading..."}{" "}
                {seats.length > 0
                  ? seats[0].ShowStart.slice(0, 5)
                  : "Loading..."}{" "}
                น.
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="kanit-medium text-lg text-gray-700">ราคาบัตร ( 1 บัตร )</span>
              <span className="kanit-medium text-lg text-black">
                {seats.length > 0 ? `${seats[0].Price} บาท` : "-"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="kanit-medium text-lg text-gray-700">ราคารวม</span>
              <span className="kanit-medium text-lg text-black">
                {seats.length > 0 ? `${totalPrice} บาท` : "-"}
              </span>
            </div>


            <div className="flex justify-between">
              <span className="kanit-medium text-lg text-gray-700">
                จำนวนที่นั่ง
              </span>
              <span className="kanit-medium text-lg text-black">
                {selectedSeats.length > 0 ? selectedSeats.length : "0"} ที่นั่ง
              </span>
            </div>
          </div>
          <div className="flex justify-center pb-4">
            <button className="btn btn-primary kanit-medium" onClick={() => handleSubmit()}>เลือกที่นั่ง</button>
          </div>
        </div>


      </div>

    </div>

  );
}

export default Seats;
