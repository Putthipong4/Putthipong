import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './screen/Home';
import Detail from './screen/Detail';
import Profile from './screen/Profile';
import HomeAdmin from './screen/Admin/HomeAdmin';
import AddConcert from './components/Admin/AddConcert';
import ManageConcert from './screen/Admin/Manage-concert';
import EditConcert from './components/Admin/EditConcert';
import Member from './screen/Admin/Member';
import Seat from './screen/Admin/Seat';
import AddShowDate from './components/Admin/AddShowDate';
import Seats from './screen/Seats';
import Idcard from './screen/Idcard';
import Payment from './screen/Payment';
import MyTicket from './screen/MyTicket';
import Order from './screen/Admin/Order';
import CheckOrder from './components/Admin/CheckOrder';
import QrCode from './screen/QrCode';
import Showdate from './screen/Admin/showdate';
import Admin from './screen/Admin/Admin';
import Addadmin from './components/Admin/Addadmin';
import ProfileAdmin from './screen/Admin/ProfileAdmin';
import EditShowDate from './components/Admin/EditShowDate';


function App() {
  return (
    <BrowserRouter basename='/ConcertTicket/'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Detail/:id" element={<Detail />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/admin/HomeAdmin" element={<HomeAdmin/>} />
        <Route path="/admin/manage-concert" element={<ManageConcert/>} />
        <Route path="/admin/AddConcert" element={<AddConcert />}/>
        <Route path="/admin/EditConcert/:Concert_id" element={<EditConcert/>}/>
        <Route path="/admin/member" element={<Member />}/>
        <Route path='/admin/showdate' element={ <Showdate/>}/>
        <Route path='/admin/seat' element={<Seat />}/>
        <Route path='/admin/AddShowDate/:ShowDate_id' element={<AddShowDate />}/>
        <Route path='/seats/:ShowDate_id' element={<Seats/>}/>
        <Route path='/Idcard/:ShowDate_id' element={<Idcard />} />
        <Route path='/Payment/:ShowDate_id' element={<Payment />} />
        <Route path='/MyTicket' element={<MyTicket />} />
        <Route path='/admin/order' element={<Order />} />
        <Route path='/admin/CheckOrder/:Order_id' element={<CheckOrder />} />
        <Route path='/QrCode/:Order_id' element={<QrCode />} />
        <Route path="/admin/admin" element={<Admin />}/>
        <Route path="/admin/Addadmin" element={<Addadmin />}/>
        <Route path="/admin/ProfileAdmin" element={<ProfileAdmin />} />
        <Route path="/admin/EditShowdate/:ShowDate_id" element={<EditShowDate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App