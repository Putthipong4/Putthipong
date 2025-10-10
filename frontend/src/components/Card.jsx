import React, { useState, useEffect } from "react";
import Axios from "axios";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";

function Card() {
  const navigate = useNavigate();
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/concert/ShowdateandConcert")
      .then((response) => {
        setConcerts(response.data);
      })
      .catch((err) => console.error("Error fetching concerts:", err));
  }, []);

  // 🔹 ลบตัวซ้ำ
  const uniqueConcerts = concerts.reduce((acc, curr) => {
    if (!acc.some((c) => c.Concert_id === curr.Concert_id)) {
      acc.push(curr);
    }
    return acc;
  }, []);

 
  // ✅ ตัวกรอง: แสดงเฉพาะคอนเสิร์ตที่ยังไม่เกิน 1 วันหลังรอบสุดท้าย
const now = dayjs();
const filteredConcerts = uniqueConcerts.filter((concert) => {
  const showDateTime = dayjs(`${concert.ShowDateTime}`);
  const oneDayAfterShow = showDateTime.add(1, "day");
  return now.isBefore(oneDayAfterShow);
});


  // ✅ แยกเป็น 2 กลุ่ม
  const availableConcerts = filteredConcerts.filter((c) =>
    c.SaleDateTime ? now.isAfter(dayjs(c.SaleDateTime)) : true
  );
  const upcomingConcerts = filteredConcerts.filter(
    (c) => c.SaleDateTime && now.isBefore(dayjs(c.SaleDateTime))
  );

  // ✅ Card UI
  const renderCard = (concert, isSaleOpen) => {
    const availableSeats = concert.AvailableSeats ?? 0;
    const showDateTime = dayjs(concert.ShowDateTime);
    const isShowPassed = now.isAfter(showDateTime);

    return (
      <div
        key={concert.Concert_id}
        className="flex h-full flex-col kanit-medium"
        onClick={() => navigate(`/Detail/${concert.Concert_id}`)}
      >
        <figure className="duration-150 ease-in-out hover:scale-105 h-full">
          <img
            src={`http://localhost:3001/uploads/poster/${concert.Poster}`}
            width="175"
            className="object-contain mx-auto rounded-sm cursor-pointer"
            alt={concert.ConcertName}
          />
        </figure>

        <div className="card-body flex flex-grow flex-col p-4">
          <h2 className="card-title kanit-medium link link-hover text-base">
            {concert.ConcertName}
          </h2>
          <div className="mt-auto">
            <p className="kanit-medium">
              {dayjs(concert.ShowDate).locale("th").format("D MMMM YYYY")}
            </p>
            <div className="kanit-medium flex items-center text-gray-400">
              <MapPin size={15} className="mr-1" />
              <span>อิมแพค อารีน่า</span>
            </div>
          </div>
        </div>

        <div className="p-2">
          {availableSeats <= 0 || isShowPassed ? (
            <button
              className="btn kanit-medium rounded-full w-full bg-red-500 cursor-not-allowed"
              disabled
            >
              Sold Out
            </button>
          ) : isSaleOpen ? (
            <button className="btn kanit-medium rounded-full w-full bg-green-500">
              ซื้อบัตร
            </button>
          ) : (
            <button
              className="btn kanit-medium rounded-full w-full bg-gray-400 cursor-not-allowed"
              disabled
            >
              เร็ว ๆ นี้
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 🎟 คอนเสิร์ตที่เปิดขายแล้ว */}
      <div className="kanit-medium mx-auto max-w-screen-xl pb-7 text-2xl">
        คอนเสิร์ต
      </div>
      <div className="mx-auto grid max-w-screen-xl grid-cols-6 gap-6">
        {availableConcerts.length > 0 ? (
          availableConcerts.map((concert) => renderCard(concert, true))
        ) : (
          <p className="col-span-6 text-center text-gray-400">
            ไม่มีคอนเสิร์ตที่เปิดขาย
          </p>
        )}
      </div>

      {/* ⏳ เร็ว ๆ นี้ */}
      <div className="kanit-medium mx-auto max-w-screen-xl pb-7 text-2xl mt-12">
        เร็ว ๆ นี้
      </div>
      <div className="mx-auto grid max-w-screen-xl grid-cols-6 gap-6">
        {upcomingConcerts.length > 0 ? (
          upcomingConcerts.map((concert) => renderCard(concert, false))
        ) : (
          <p className="col-span-6 text-center text-gray-400 kanit-medium">
            ไม่มีคอนเสิร์ตเร็ว ๆ นี้
          </p>
        )}
      </div>
    </div>
  );
}

export default Card;
