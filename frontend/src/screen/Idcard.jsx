import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Swal from "sweetalert2";
import Breadcrumbs from "../components/Admin/Breadcrumbs";

function Idcard() {
  const navigate = useNavigate();
  const { ShowDate_id } = useParams();
  const location = useLocation();
  const { selectedSeats, totalPrice} = location.state || {
    selectedSeats: [],
    totalPrice: 0,
  };


  const [seats, setSeats] = useState([]);
  const [idcards, setIdcards] = useState(Array(selectedSeats.length).fill(""));

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/api/concert/ShowDateandConcert/${ShowDate_id}`,
      { withCredentials: true },
    ).then((response) => {
      setSeats(response.data);
    });
  }, [ShowDate_id]);


  const handleInputChange = (index, value) => {
    const newIdcards = [...idcards];
    newIdcards[index] = value;
    setIdcards(newIdcards);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (idcards.some((id) => id.trim().length !== 13)) {
    Swal.fire({
      title: "กรุณากรอกเลขบัตรประชาชนให้ครบทุกที่นั่ง (13 หลัก)",
      icon: "warning",
    });
    return;
  }

  const uniqueIdcards = new Set(idcards);
  if (uniqueIdcards.size !== idcards.length) {
    Swal.fire({
      title: "ห้ามกรอกเลขบัตรประชาชนซ้ำกัน",
      icon: "error",
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
    try {
      const response = await Axios.post(
        `http://localhost:3001/api/Order/AcceptIdcard`,
        {
          Seat_Number: selectedSeats,
          IDCARD: idcards,
          ShowDate_id 
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate(`/Payment/${ShowDate_id}`, {
          state: { selectedSeats, totalPrice, idcards, Order_id: response.data.orderId , Status_id: response.data.statusId},
        });
      } else {
        Swal.fire({
          title: response.data.message || "เกิดข้อผิดพลาด",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "ไม่สามารถบันทึกข้อมูลได้",
        text: error.message,
        icon: "error",
      });
    }
  }
};

const CancelPayment = async () => {
  try {
    Swal.fire({
      title: "ยกเลิกการซื้อบัตรใช่ไหม?",
      icon: "question", 
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่",
    }).then(async (result) => {
      if (result.isConfirmed) {
    
        Swal.fire({
          title: "ยกเลิกคำสั่งซื้อเรียบร้อย",
          icon: "success",
        }).then(() => navigate(-1)); 
      }
    });
  } catch (err) {
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: err.response?.data?.message || err.message,
      icon: "error",
    });
  }
};



  return (
    <div>
      <Navbar />
      <div className="ml-4">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/" },
            { label: "ข้อมูลคอนเสิร์ต", path: `/Detail/${seats[0]?.Concert_id || ""}` },
            { label: "เลือกที่นั่ง", path: `/seats/${ShowDate_id}` },
            { label: "กรอกเลขบัตรประชาชน", path: `/Idcard/${ShowDate_id}` },
          ]}
        />
      </div>
      {/* ข้อมูลคอนเสิร์ต */}
      <div className="grid grid-rows-2 justify-center gap-6 p-4">
        <h1 className="kanit-medium text-center text-4xl">
          {seats.length > 0 ? seats[0].ConcertName : "Loading..."}
        </h1>
        <p className="kanit-medium text-center text-xl">
          รอบการแสดง :{" "}
          {seats.length > 0
            ? dayjs(seats[0].ShowDate).locale("th").format("D MMMM YYYY")
            : "Loading..."}
        </p>
        <p className="kanit-medium text-center text-xl">
          ที่นั่งที่คุณเลือก : {selectedSeats.join(", ")}
        </p>
        <p className="kanit-medium text-center text-xl">
          ราคารวม : {Number(totalPrice).toLocaleString()}บาท
        </p>
      </div>

      {/* อธิบาย */}
      <div className="grid grid-rows-1 justify-center gap-4 p-8">
        <p className="kanit-medium text-center text-xl">กรุณากรอกรายละเอียด</p>
        <p className="kanit-medium text-center text-lg">
          ท่านต้องระบุเลขที่บัตรประชาชน ของผู้ชมทุกที่นั่งเมื่อซื้อบัตร
          ซึ่งจะถูกพิมพ์ลงบนบัตร
        </p>
      </div>

      {/* ฟอร์มลงทะเบียน */}
      <div className="grid justify-center gap-2">
        <form onSubmit={handleSubmit}>
          <label className="kanit-medium mb-4 block text-center text-xl">
            ลงทะเบียนที่นั่ง
          </label>

          {selectedSeats.map((seat, index) => (
            <div key={index} className="mb-4">
              <label className="kanit-medium mb-2 block text-lg">
                ลำดับที่ {index + 1} (ที่นั่ง {seat})
              </label>
              <input
                type="tel"
                className="kanit-medium w-80 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                placeholder="กรอกเลขบัตรประจำตัวประชาชน"
                pattern="[0-9]*"
                minLength="13"
                maxLength="13"
                title="กรุณากรอกตัวเลข 13 หลัก"
                value={idcards[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          ))}
        <div className="flex justify-center gap-6">
          <button className="btn btn-primary kanit-medium" type="submit">
            ยืนยัน
          </button>
          <button className="btn btn-error kanit-medium" type="reset" onClick={() => CancelPayment()}>
            ยกเลิก
          </button>
        </div>
          
        </form>
      </div>
    </div>
  );
}

export default Idcard;
