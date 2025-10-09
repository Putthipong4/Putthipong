import React, { useEffect, useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import Breadcrumbs from "./Breadcrumbs";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditConcert() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/admin/checkAuthAdmin", {
      withCredentials: true,
    })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {});
  });

  const { Concert_id } = useParams();
  const [formData, setFormData] = useState({
    ConcertName: "",
    Price: "",
    OpenSaleDate: "",
    OpenSaleTimes: "",
    Details: "",
    Poster: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, Poster: e.target.files[0] });
  };
  
   useEffect(() => {
    Axios.get(`http://localhost:3001/api/concert/detailsconcert/${Concert_id}`)
      .then((response) => {
        const formattedDate = response.data.OpenSaleDate
        ? new Date(response.data.OpenSaleDate).toISOString().split("T")[0]
        : "";
        setFormData({
        ConcertName: response.data.ConcertName,
        Price: response.data.Price,
        OpenSaleDate: formattedDate,
        OpenSaleTimes: response.data.OpenSaleTimes,
        Details: response.data.Details,
        Poster: null
      });
      })
      .catch((error) => {
        console.error("Error fetching concert:", error);
      });
  }, [Concert_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("Concert_id", Concert_id);
    data.append("ConcertName", formData.ConcertName);
    data.append("Price", formData.Price);
    data.append("OpenSaleDate", formData.OpenSaleDate);
    data.append("OpenSaleTimes", formData.OpenSaleTimes);
    data.append("Details", formData.Details);
    if (formData.Poster) {
      data.append("Poster", formData.Poster);
    }

    try {
      await Axios.put("http://localhost:3001/api/concert/UpdateConcert", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("อัปเดตสำเร็จ");
      navigate('/admin/manage-concert')
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    }
  };
  return (
    <div className="drawer lg:drawer-open">
      <SidebarAdmin />
      <div className="drawer-content flex flex-col p-2">
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/admin/HomeAdmin" },
            { label: "จัดการคอนเสิร์ต", path: "/admin/manage-concert" },
            {
              label: "แก้ไขคอนเสิร์ต",
              path: "/admin/EditConcert/:Concert_id",
            },
          ]}
        />
        <h1 className="kanit-medium mb-4 text-3xl">แก้ไขคอนเสิร์ต</h1>
        <form action="" onSubmit={handleSubmit}>
          <fieldset className="bg-base-100 mx-auto max-w-2xl space-y-4 rounded-xl p-6">
            <div>
              <label className="label kanit-medium text-lg">
                ชื่อคอนเสิร์ต
              </label>
              <input
                type="text"
                name="ConcertName"
                className="input input-lg input-bordered kanit-medium w-full"
                value={formData.ConcertName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label kanit-medium text-lg">ราคา</label>
              <input
                type="text"
                name="Price"
                className="input input-lg input-bordered kanit-medium w-full"
                placeholder="เช่น 1400 "
                value={formData.Price}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="label kanit-medium text-lg">
                  วันเปิดจำหน่าย
                </label>
                <input       
                  type="date"
                  name="OpenSaleDate"
                  className="input input-lg input-bordered kanit-medium w-full"
                  value={formData.OpenSaleDate}
                onChange={handleChange}
                />
              </div>
              <div>
                <label className="label kanit-medium text-lg">
                  เวลาเปิดจำหน่าย
                </label>
                <input
                  type="time"
                  name="OpenSaleTimes"
                  className="input input-lg input-bordered kanit-medium w-full"
                  value={formData.OpenSaleTimes}
                onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="label kanit-medium text-lg">รายละเอียด</label>
              <textarea
                className="textarea textarea-bordered kanit-medium w-full"
                value={formData.Details}
                onChange={handleChange}
                rows="4"
                name="Details"
              ></textarea>
            </div>

            <div>
              <label className="label kanit-medium text-lg">โปสเตอร์</label>
              <input
                type="file"
                name="Poster"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label className="label kanit-medium text-lg">
                รหัสเจ้าหน้าที่
              </label>
              <input
                type="text"
                className="input input-lg input-bordered kanit-medium w-full"
                value={user?.Admin_id || ""}
                readOnly
              />
            </div>

            <div className="flex justify-center gap-12">
              <button
                type="submit"
                className="btn btn-primary btn-lg kanit-medium px-10"
              >
                บันทึก
              </button>
              <button type="reset" className="btn btn-error btn-lg kanit-medium px-10" onClick={() => navigate('/admin/manage-concert')}>
                ยกเลิก
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default EditConcert;
