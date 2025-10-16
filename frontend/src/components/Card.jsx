import React, { useState, useEffect } from "react";
import Axios from "axios";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";

function Card() {
  const navigate = useNavigate();
  const [concerts, setConcerts] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    // ดึงข้อมูลคอนเสิร์ต
    Axios.get("http://localhost:3001/api/concert/ShowdateandConcertCard")
      .then((response) => setConcerts(response.data))
      .catch((err) => console.error("Error fetching concerts:", err));

    // ดึงข้อมูลเรตติ้ง
    Axios.get("http://localhost:3001/api/Order/Rating")
      .then((response) => setRatings(response.data))
      .catch((err) => console.error("Error fetching ratings:", err));
  }, []);

  //  ลบตัวซ้ำ
  const uniqueConcerts = concerts.reduce((acc, curr) => {
    if (!acc.some((c) => c.Concert_id === curr.Concert_id)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const now = dayjs();

  // ตัวกรอง: แสดงเฉพาะคอนเสิร์ตที่ยังไม่เกิน 1 วันหลังรอบสุดท้าย
  const filteredConcerts = uniqueConcerts.filter((concert) => {
    const showDateTime = dayjs(`${concert.ShowDateTime}`);
    const oneDayAfterShow = showDateTime.add(1, "day");
    return now.isBefore(oneDayAfterShow);
  });

  //  แยกเป็น 2 กลุ่ม
  const availableConcerts = filteredConcerts.filter((c) =>
    c.SaleDateTime ? now.isAfter(dayjs(c.SaleDateTime)) : true
  );
  const upcomingConcerts = filteredConcerts.filter(
    (c) => c.SaleDateTime && now.isBefore(dayjs(c.SaleDateTime))
  );

  //  Card UI ใช้ร่วมกัน (mode = "buy" | "upcoming" | "rating")
  const renderCard = (concert, mode) => {
    const availableSeats = concert.AvailableSeats ?? 0;
    const showDateTime = dayjs(concert.ShowDateTime);
    const isShowPassed = now.isAfter(showDateTime);

    return (
      <div
        key={concert.Concert_id}
        className="flex h-full flex-col kanit-medium hover:shadow-lg transition"
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
              <span>{concert.Place}</span>
            </div>
          </div>
        </div>

        {/*  ปุ่มล่าง (เปลี่ยนตาม mode) */}
        <div className="p-2">
          {mode === "rating" ? (
            <div className="btn kanit-medium rounded-full w-full bg-yellow-400 text-black flex items-center justify-center ">
              <Star size={16} className="mr-2 text-yellow-700" />
              <span>{parseFloat(concert.Rating).toFixed(1)}</span>

            </div>
          ) : availableSeats <= 0 || isShowPassed ? (
            <button
              className="btn kanit-medium rounded-full w-full bg-red-500 cursor-not-allowed"
              disabled
            >
              Sold Out
            </button>
          ) : mode === "buy" ? (
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
      {/*  คอนเสิร์ตที่เปิดขายแล้ว */}
      <div className="kanit-medium mx-auto max-w-screen-xl pb-7 text-2xl">
        คอนเสิร์ต
      </div>
      <div className="mx-auto grid max-w-screen-xl grid-cols-6 gap-6">
        {availableConcerts.length > 0 ? (
          availableConcerts.map((concert) => renderCard(concert, "buy"))
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
          upcomingConcerts.map((concert) => renderCard(concert, "upcoming"))
        ) : (
          <p className="col-span-6 text-center text-gray-400 kanit-medium">
            ไม่มีคอนเสิร์ตเร็ว ๆ นี้
          </p>
        )}
      </div>

      {/*  คอนเสิร์ตยอดฮิต */}
      <div className="kanit-medium mx-auto max-w-screen-xl pb-7 text-2xl mt-12">
        คอนเสิร์ตยอดฮิต
      </div>
      <div className="mx-auto grid max-w-screen-xl grid-cols-6 gap-6">
        {ratings.length > 0 ? (
          ratings
            .slice(0, 6) // แสดง 6 อันดับแรก
            .map((item) => renderCard(item, "rating"))
        ) : (
          <p className="col-span-6 text-center text-gray-400 kanit-medium">
            ยังไม่มีข้อมูลการรีวิว
          </p>
        )}
      </div>
    </div>
  );
}

export default Card;
