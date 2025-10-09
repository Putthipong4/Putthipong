import React, { useEffect, useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import Breadcrumbs from "./Breadcrumbs";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CheckOrder() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [order, setOrder] = useState([]);

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
            .finally(() => { });
    });

    const { Order_id } = useParams();
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

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/Order/DetailOrder/${Order_id}`,
            {
            withCredentials: true,
        }
        )
            .then((response) => {
                setOrder(response.data)
                setFormData({
                    Status_id: response.data.Status_id,
                });
            })
            .catch((error) => {
                console.error("Error fetching concert:", error);
            });
    }, [Order_id]);

    const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await Axios.put("http://localhost:3001/api/Order/ChangeOrder", {
      Order_id: order.Order_id,
      Status_id: formData.Status_id,
      Admin_id: user?.Admin_id || ""
    }, {
      withCredentials: true,
    });

    alert("เปลี่ยนแปลงสถานะคำสั่งซื้อสำเร็จ");
    navigate('/admin/Order');
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
                        { label: "จัดการคำสั่งซื้อ", path: "/admin/order" },
                        {
                            label: "เปลี่ยนแปลงสถานะคำสั่งซื้อ",
                            path: "/admin/CheckOrder/:Order_id",
                        },
                    ]}
                />
                <h1 className="kanit-medium mb-4 text-3xl">เปลี่ยนแปลงสถานะคำสั่งซื้อ</h1>
                <form action="" onSubmit={handleSubmit}>
                    <fieldset className="bg-base-100 mx-auto max-w-2xl space-y-4 rounded-xl p-6">
                        <div>
                            <label className="label kanit-medium text-lg">
                                รหัสคำสั่งซื้อ
                            </label>
                            <input
                                type="text"
                                className="input input-lg input-bordered kanit-medium w-full"
                                value={order.Order_id}
                            />
                        </div>

                        <div>
                            <label className="label kanit-medium text-lg">
                                ชื่อคอนเสิร์ต
                            </label>
                            <input
                                type="text"
                                className="input input-lg input-bordered kanit-medium w-full"
                                value={order.ConcertName}
                            />
                        </div>
                        <div>
                            <label className="label kanit-medium text-lg">ราคารวม</label>
                            <input
                                type="text"
                                className="input input-lg input-bordered kanit-medium w-full"
                                placeholder="เช่น 1400 "
                                value={order.totalprice}
                            />
                        </div>

                        <div>
                            <label className="label kanit-medium text-lg">หลักฐานการโอนเงิน</label>
                            <div className="flex justify-center">
                                <img
                                    src={`http://localhost:3001/uploads/payment/${order.Slip_file}`}
                                    alt="สลิปโอนเงิน"
                                    className="cursor-pointer rounded-md shadow-md hover:shadow-lg transition"
                                    width="150"
                                    onClick={() =>
                                        document.getElementById("slip_modal").showModal()
                                    }
                                />
                            </div>

                            <dialog id="slip_modal" className="modal">
                                <div className="modal-box">
                                    <img
                                        src={`http://localhost:3001/uploads/payment/${order.Slip_file}`}
                                        alt="สลิปโอนเงิน"
                                        className="mx-auto rounded-lg"
                                        width="350"
                                    />
                                    <div className="modal-action modal-backdrop">
                                        <form method="dialog">
                                            <button className="btn kanit-medium">ปิด</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>

                        <div>
                            <label className="label kanit-medium text-lg">สถานะคำสั่งซื้อ</label>
                            <select
                                name="Status_id"
                                className="select select-lg select-bordered kanit-medium w-full"
                                value={formData.Status_id}
                                onChange={handleChange}
                            >
                                <option value="">-</option>
                                <option value="S003">ชำระเงินเสร็จสมบูรณ์</option>
                                <option value="S005">ยกเลิกคำสั่งซื้อเนื่องจากชำระเงินไม่ถูกต้อง ยกเลิกโดยผู้ดูแลระบบ</option>
                            </select>
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
                            <button type="reset" className="btn btn-error btn-lg kanit-medium px-10" onClick={() => navigate(-1)}>
                                ยกเลิก
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default CheckOrder;
