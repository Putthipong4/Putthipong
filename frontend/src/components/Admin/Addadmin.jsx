import React, { useState } from 'react'
import Axios from "axios";
import SidebarAdmin from './SidebarAdmin';
import Breadcrumbs from './Breadcrumbs';
import { useNavigate } from 'react-router-dom';

function Addadmin() {

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

 
    const handleAddAdmin = async (event) => {
        event.preventDefault();

        if (
            !firstname.trim() ||
            !lastname.trim() ||
            !telephone.trim() ||
            !email.trim() ||
            !password.trim() 
        ) {
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        try {
            await Axios.post("http://localhost:3001/api/admin/Addadmin", {
                Firstname: firstname.trim(),
                Lastname: lastname.trim(),
                Telephone: telephone.trim(),
                Email: email.trim().toLowerCase(),
                Password: password.trim(),
            });

            alert('เพิ่มผู้ดูแลระบบสำเร็จ');

            // รีเซ็ตค่า input
            setFirstname("");
            setLastname("");
            setTelephone("");
            setEmail("");
            setPassword("");
        } catch (err) {
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else {
                alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
            }
            console.error("Error adding admin:", err);
        }
    };

    const Close = () => {
        setFirstname("");
        setLastname("");
        setTelephone("");
        setEmail("");
        setPassword("");
        navigate(-1);
    };

    return (
        <div className="drawer lg:drawer-open">
            <SidebarAdmin />
            <div className="drawer-content flex flex-col p-2">
                <Breadcrumbs
                    items={[
                        { label: "หน้าหลัก", path: "/admin/HomeAdmin" },
                        { label: "รายชื่อผู้ดูแลระบบ", path: "/admin/admin" },
                        { label: "เพิ่มผู้ดูแลระบบ", path: "/admin/Addadmin" },
                    ]}
                />
                <h1 className="kanit-medium text-3xl">เพิ่มผู้ดูแลระบบ</h1>
                
                {/* ✅ ใช้ handleAddAdmin แทน Addadmin */}
                <form onSubmit={handleAddAdmin}>
                    <fieldset className="bg-base-100 mt-8">
                        <div className="mx-auto max-w-xl gap-8">
                            <div className="space-y-6">

                                <div>
                                    <label className="label kanit-medium text-lg">ชื่อ</label>
                                    <input
                                        type="text"
                                        className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="label kanit-medium text-lg">นามสกุล</label>
                                    <input
                                        type="text"
                                        className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="label kanit-medium text-lg">เบอร์โทรศัพท์</label>
                                    <input
                                        type="tel"
                                        className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                                        value={telephone}
                                        onChange={(e) => setTelephone(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="label kanit-medium text-lg">อีเมล</label>
                                    <input
                                        type="email"
                                        className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="label kanit-medium text-lg">รหัสผ่าน</label>
                                    <input
                                        type="text"
                                        className="input input-lg input-bordered kanit-medium w-full shadow-xl"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center gap-8">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg kanit-medium px-10 shadow-xl"
                            >
                                บันทึก
                            </button>
                            <button
                                type="button"
                                className="btn btn-error btn-lg kanit-medium px-10 shadow-xl"
                                onClick={Close}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Addadmin;
