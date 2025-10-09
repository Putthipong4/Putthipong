import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

function ModalRegister() {

    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);
    const [ConfirmPassword, setConfirmPassword] = useState('');

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const [al ,setAl] = useState('');

    useEffect(() => {
    if (error || al ) {
      setIsVisible(true);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2500);

      const clearTimer = setTimeout(() => {
        setError('');
        setAl('');
      }, 3000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [error, al]);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);


    const register = async (event) => {
        event.preventDefault();

        if (
            !firstname.trim() ||
            !lastname.trim() ||
            !telephone.trim() ||
            !email.trim() ||
            !password.trim() ||
            !ConfirmPassword.trim()
        ) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }
        // เช็ครหัสผ่านตรงกันไหม
        if (password !== ConfirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await Axios.post("http://localhost:3001/api/member/register", {
                Firstname: firstname.trim(),
                Lastname: lastname.trim(),
                Telephone: telephone.trim(),
                Email: email.trim().toLowerCase(),
                Password: password.trim(),
            });

            setAl('สมัครสมาชิกสำเร็จ')

            // รีเซ็ตค่า input
            setFirstname("");
            setLastname("");
            setTelephone("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
            }
            console.error("Error adding member:", err);
        } finally {
            setLoading(false);
        }
    };

    const CloseModal = () => {
            setFirstname("");
            setLastname("");
            setTelephone("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
    }
    return (
        <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
                <form method="dialog">

                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={CloseModal}>✕</button>
                </form>
                <form action="" onSubmit={register}>
                    <h2 className=" text-3xl kanit-medium flex justify-center mb-5" >Concert Ticket</h2>
                    <fieldset className="fieldset bg-base-100 rounded-box w-xs p-4 mx-auto">
                        <legend className="fieldset-legend kanit-medium text-center text-xl">สมัครสมาชิก</legend>

                        <label className="label kanit-medium text-sm">ชื่อ</label>
                        <label className="input">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </g>
                            </svg>
                            <input
                                type="text"
                                required
                                placeholder="กรอกชื่อ"
                                minLength="3"
                                maxLength="30"
                                title="Only letters, numbers or dash"
                                className="kanit-medium"
                                value={firstname}
                                onChange={(event) => {
                                    setFirstname(event.target.value)
                                }}
                            />
                        </label>

                        <label className="label kanit-medium text-sm">นามสกุล</label>
                        <label className="input">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </g>
                            </svg>
                            <input
                                type="text"
                                required
                                placeholder="กรอกนามสกุล"
                                minLength="3"
                                maxLength="30"
                                title="Only letters, numbers or dash"
                                className="kanit-medium"
                                value={lastname}
                                onChange={(event) => {
                                    setLastname(event.target.value)
                                }}
                            />
                        </label>

                        <label className="label kanit-medium text-sm">เบอร์โทรศัพท์</label>
                        <label className="input">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <g fill="none">
                                    <path
                                        d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                                        fill="currentColor"
                                    ></path>
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                                        fill="currentColor"
                                    ></path>
                                </g>
                            </svg>
                            <input
                                type="tel"
                                className="tabular-nums kanit-medium"
                                required
                                placeholder="กรอกเบอร์โทรศัพท์"
                                pattern="[0-9]*"
                                minLength="10"
                                maxLength="10"
                                title="Must be 10 digits"
                                value={telephone}
                                onChange={(event) => {
                                    setTelephone(event.target.value)
                                }}

                            />
                        </label>

                        <label className="label kanit-medium text-sm">อีเมล</label>
                        <label className="input  kanit-medium">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input type="email"
                                required className="kanit-medium" placeholder="กรอกอีเมล"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                }}

                            />
                        </label>
                        <label className="label kanit-medium text-sm">รหัสผ่าน</label>
                        <label className="input  kanit-medium">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>

                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="kanit-medium"
                                placeholder="กรอกรหัสผ่าน"
                                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute right-3 text-gray-500"
                            >
                                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </button>
                        </label>

                        <label className="label kanit-medium text-sm">ยืนยันรหัสผ่าน</label>
                        <label className="input kanit-medium">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>

                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="kanit-medium"
                                placeholder="กรุณายืนยันรหัสผ่าน"
                                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                value={ConfirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                required
                            />
                            <button
                        type="button"
                        onClick={toggleConfirmPassword}
                        className="absolute right-3 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                      </button>
                        </label>
                        <button type="submit" className="btn mt-4 btn-primary kanit-medium text-sm" disabled={loading} >{loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}</button>

                        <label className="kanit-medium text-center text-sm mt-2">หากท่านเป็นสมาชิกแล้ว</label>
                        <a className="kanit-medium text-center text-red-500 text-sm cursor-pointer" onClick={() => document.getElementById('my_modal_2').close()}>เข้าสู่ระบบ</a>

                        {error && (
                            <div
                                role="alert"
                                className={`alert alert-warning mt-3 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className='kanit-medium'>{error}</span>
                            </div>
                        )}

                        {al && (
                            <div
                                role="alert"
                                className={`alert alert-success mt-3 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className='kanit-medium'>{al}</span>
                            </div>
                        )}

                    </fieldset>
                </form>
            </div>
        </dialog>
    )
}

export default ModalRegister