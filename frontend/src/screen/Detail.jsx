import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import Axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";

import {
  Calendar,
  CalendarClock,
  CircleDollarSign,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Admin/Breadcrumbs";

function Detail() {
  const { id } = useParams(); // รับ ID จาก URL
  const [concert, setConcert] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const refreshUser = () => {
    setIsAuthLoading(true);
    Axios.get("http://localhost:3001/api/member/checkAuth", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  };

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    window.refreshNavbarUser = refreshUser;
    return () => {
      delete window.refreshNavbarUser;
    };
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/concert/detailsconcert/${id}`)
      .then((response) => {
        setConcert(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching concert:", error);
      });
  }, [id]);




  if (!concert) return <div>Loading...</div>;

  return (
    <div className="bg-base-100 flex min-h-screen flex-col">
      <div>
        <Navbar />
        <div className="ml-4">
          <Breadcrumbs
            items={[
              { label: "หน้าหลัก", path: "/" },
              { label: "ข้อมูลคอนเสิร์ต", path: `/Detail/${concert.Concert_id}` },
            ]}
          />
        </div>
      </div>

      <div className="kanit-medium">
        <div className="p-4">
          <h1 className="kanit-medium text-center text-2xl">
            {concert.ConcertName}
          </h1>
        </div>

        <div className="shadow:lg flex w-full flex-col bg-gray-950 p-5 sm:flex-row">
          <div className="grid h-full grow place-items-center">
            <figure className="h-[350px]">
              <img
                src={`http://localhost:3001/uploads/poster/${concert.Poster}`}
                alt="Poster"
                className="h-full object-contain"
              />
            </figure>
          </div>
          <div className="grid h-full grow">
            <div className="grid grid-rows-1 gap-4 p-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar size={50} />
                <div className="flex flex-col p-4">
                  <p className="text-lg text-gray-500">วันที่แสดง</p>
                  <span>
                    {dayjs(concert.ShowDate).locale("th").format("D MMMM YYYY")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarClock size={50} />
                <div className="flex flex-col p-4">
                  <p className="text-lg text-gray-500">วันเปิดจำหน่าย</p>
                  <span>
                    {dayjs(concert.OpenSaleDate)
                      .locale("th")
                      .format("D MMMM YYYY")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={50} />
                <div className="flex flex-col p-4">
                  <p className="text-lg text-gray-500">เวลาเปิดจำหน่าย</p>
                  <span>{concert.OpenSaleTimes.slice(0, 5)} น.</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CircleDollarSign size={50} />
                <div className="flex flex-col p-4">
                  <p className="text-lg text-gray-500">ราคาบัตร</p>
                  <span>{concert.Price.toLocaleString("th-TH")} บาท</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={50} />
                <div className="flex flex-col p-4">
                  <p className="text-lg text-gray-500">สถานที่แสดง</p>
                  <span>อิมแพค อารีน่า</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ticket size={50} />
                <div className="flex flex-col p-4">
                  <p className="text-lg text-gray-500">สถานะของบัตร</p>
                  {/* คำนวณสถานะรวมของทุก ShowRound */}
                  {concert.ShowRounds && (() => {
                    const now = dayjs();

                    const saleStart = dayjs(concert.SaleDateTime);
                    const isComingSoon = now.isBefore(saleStart); // ยังไม่เปิดขาย

                    const isAllSoldOut = concert.ShowRounds.every((r) => {
                      const showDateTime = dayjs(r.ShowDateTime);
                      const isShowPassed = now.isAfter(showDateTime);
                      return r.AvailableSeats <= 0 || isShowPassed;
                    });

                    let statusText = "เปิดขาย";
                    let statusColor = "badge badge-success";

                    if (isComingSoon) {
                      statusText = "เร็ว ๆ นี้";
                      statusColor = "badge badge-warning"; 
                    } else if (isAllSoldOut) {
                      statusText = "Sold Out";
                      statusColor = "badge badge-error"; 
                    }

                    return (
                      <span className={`font-bold ${statusColor}`}>
                        {statusText}
                      </span>
                    );
                  })()}


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="kanit-medium">
        <h2 className="m-5 mx-auto max-w-screen-xl text-2xl">
          ผังที่นั่งและรอบการแสดง
        </h2>
        <div className="card bg-base-300 card-xl mx-auto  max-w-screen-xl shadow-sm">
          <div className="card-body">
            <div className="flex gap-4">
              <img
                src="../assets/image/stage.png"
                alt="stage"
                height={50}
                width={150}
              />
              <div className="flex flex-col gap-12">
                <div className="flex items-center gap-2">
                  <MapPin size={25} />
                  <h2 className="text-2xl">อิมแพ็ค อารีน่า</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-lg text-gray-500">ราคาบัตร</p>
                  <p className="badge badge-primary text-lg"> {concert.Price.toLocaleString("th-TH")}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-250">
              <p>วันที่แสดง</p>
              <p>เวลา</p>
            </div>
            {isAuthLoading ? (
              <div className="loading loading-spinner text-white"></div>
            ) : (
              concert.ShowRounds &&
              concert.OpenSaleDate &&
              concert.OpenSaleTimes &&
              concert.ShowRounds.map((round) => {
                const saleStart = dayjs(concert.SaleDateTime);

                const showDateTime = dayjs(round.ShowDateTime);
                const now = dayjs();
                const isSaleOpen = now.isAfter(saleStart);
                const isShowPassed = now.isAfter(showDateTime);
                const availableSeats = round.AvailableSeats ?? 0;
                return (
                  <div key={round.ShowDate_id} className="h-full w-full border border-gray-500">
                    <div className="flex items-center justify-between gap-180 p-4">
                      <p className="text-lg">
                        {dayjs(round.ShowDate).locale("th").format("D MMMM YYYY")}
                      </p>
                      {availableSeats <= 0 || isShowPassed ? (
                        <button className="btn rounded-full bg-red-500 cursor-not-allowed" disabled>
                          Sold Out
                        </button>
                      ) : isSaleOpen ? (
                        <button
                          className={`btn rounded-full ${user ? "bg-green-500" : "bg-blue-500"}`}
                          onClick={() => {
                            if (!user) {
                              document.getElementById("my_modal_1").showModal();
                            } else {
                              navigate(`/seats/${round.ShowDate_id}`);
                            }
                          }}
                        >
                          {round.ShowStart.slice(0, 5)} น.
                        </button>
                      ) : (
                        <button className="btn rounded-full bg-gray-400 cursor-not-allowed" disabled>
                          เร็ว ๆ นี้
                        </button>
                      )}
                    </div>
                  </div>
                );
              })

            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
