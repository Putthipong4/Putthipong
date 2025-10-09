import React , { useState , useEffect} from 'react'
import  Axios  from 'axios';
import SidebarAdmin from '../../components/Admin/SidebarAdmin';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import { useNavigate } from "react-router-dom";
import {  Edit2,  Plus,  Trash2 } from "lucide-react";

function Admin() {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    useEffect(() => {
        Axios.get("http://localhost:3001/api/admin/showadmins" , {
            withCredentials: true
        }).then((response) => {
            console.log(response.data);
            setAdmins(response.data)
        });
    }, []);
  return (
    <div className="drawer lg:drawer-open">
      {/* drawer toggle สำหรับ mobile */}
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* Sidebar (ฝั่งซ้าย) */}
      <SidebarAdmin />

      {/* เนื้อหา (ฝั่งขวา) */}
      <div className="drawer-content flex flex-col p-2">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "หน้าหลัก", path: "/admin/HomeAdmin" },
            { label: "รายชื่อผู้ดูแลระบบ", path: "/admin/admin" },
          ]}
        />
        {/* เนื้อหาหลักของหน้านี้ */}
        <h1 className="kanit-medium mb-4 text-3xl">รายชื่อผู้ดูแลระบบ</h1>
        <div className="cursor-pointer ml-auto p-2 " >
          <Plus size={30} color="SpringGreen" onClick={()=> navigate('/admin/Addadmin')}/>
        </div>

        {/* ใส่ตารางหรือ card ที่แสดงคอนเสิร์ตต่างๆ ได้ที่นี่ */}

        <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border kanit-medium">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th><p className="text-center">รหัสผู้ดูแลระบบ</p></th>
                <th><p className="text-center">ชื่อ</p></th>
                <th><p className="text-center">นามสกุล</p></th>
                <th><p className="text-center">เบอร์โทรศัพท์</p></th>
                <th><p className="text-center">อีเมล</p></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {admins.map(user => (
                <tr key={user.Admin_id}>
                  <th><p className="text-center max-w-xs truncate mx-auto">{user.Admin_id}</p></th>
                  <td><p className="max-w-xs truncate mx-auto text-center">{user.Firstname}</p></td>
                  <td><p className="max-w-xs truncate mx-auto text-center">{user.Lastname}</p></td>
                  <td>
                    <p className="text-center max-w-xs truncate mx-auto">
                      {user.Telephone}
                    </p>
                  </td>
                  <td>
                    <p className=" text-center max-w-xs truncate mx-auto">{user.Email}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Admin