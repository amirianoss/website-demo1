import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import '../css/Contact.css';

// EmailJS configuration
const SERVICE_ID = "service_62jn618";
const TEMPLATE_ID = "template_7lkeqnf";
const PUBLIC_KEY = "tdeiyjUT65UJnXKIl";

function Contact() {
    const form = useRef();
    
    useEffect(() => {
        try {
            emailjs.init(PUBLIC_KEY);
            // Verify EmailJS configuration
            console.log('Verifying EmailJS configuration:', {
                serviceId: SERVICE_ID,
                templateId: TEMPLATE_ID,
                publicKey: PUBLIC_KEY ? 'Present' : 'Missing'
            });
        } catch (error) {
            console.error('EmailJS initialization error:', error);
        }
    }, []);

    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        message: ''
    });
    const [status, setStatus] = useState({
        message: '',
        isError: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: 'Sending...', isError: false });

        // Create template parameters explicitly
        const templateParams = {
            from_name: formData.user_name,
            from_email: formData.user_email,
            message: formData.message,
        };

        try {
            console.log('Attempting to send email with params:', templateParams);
            
            // Try using send method instead of sendForm
            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                templateParams,
                PUBLIC_KEY
            );
            
            console.log('EmailJS Response:', response);
            setStatus({ message: 'Message sent successfully!', isError: false });
            setFormData({
                user_name: '',
                user_email: '',
                message: ''
            });
        } catch (err) {
            console.error('EmailJS Error Details:', {
                message: err.message,
                name: err.name,
                text: err.text,
                stack: err.stack
            });
            setStatus({ 
                message: `Failed to send message: ${err.message}. Please check console for details.`,
                isError: true 
            });
        }
    };

    return (
        <div className="contact-container">
            <h1>ارتباط با ما</h1>
            <form className="contact-form" ref={form} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">نام:</label>
                    <input
                        type="text"
                        id="name"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">ایمیل:</label>
                    <input
                        type="email"
                        id="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">پیام:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">ارسال پیام</button>
                {status.message && (
                    <div className={`status-message ${status.isError ? 'error' : 'success'}`}>
                        {status.message}
                    </div>
                )}
            </form>
        </div>
    );
}

export default Contact;
