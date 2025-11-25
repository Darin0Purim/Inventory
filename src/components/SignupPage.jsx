import "./SignupPage.css";
import { useState } from "react";


const SignupPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit =  async (e) => {
        e.preventDefault();
        try {
            const res = await fetch ("http://localhost:5000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),

            });
            const data = await res.json();
            alert(data.message);
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        }

    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2 className="signup-title">สมัครสมาชิก</h2>

                <div className="name-fields">
                    <input type="text" placeholder="ชื่อ*" required 
                    value={firstName} onChange={ (e) => setFirstName(e.target.value)} />
                    <input type="text" placeholder="นามสกุล*" required 
                    value={lastName} onChange={ (e) => setLastName(e.target.value)} />
                </div>
                <input type="email" placeholder="อีเมลแอดเดรส" required 
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="รหัสผ่าน" required 
                value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="submit" className="signup-button">
                    สมัครสมาชิก
                </button>
                

            </form>
        </div>
    );
};

export default SignupPage;