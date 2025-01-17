import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import '../css/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);
            navigate('/');
        } else {
            setError('ایمیل یا رمز عبور اشتباه است');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>ورود به حساب کاربری</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ایمیل"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="رمز عبور"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">ورود</button>
                </form>
                <div className="auth-links">
                    <Link to="/register">ثبت‌نام نکرده‌اید؟</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
