import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';

const SERVICES = [
    'Full Home Interior Design',
    'Living Room / Bedroom Styling',
    'Kitchen Design',
    'Office / Commercial Interiors',
    'Exterior Design',
    'Consultation Only',
    'Other',
];

const ContactForm = () => {
    const [forms, setForms] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const changeHandler = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!forms.name.trim()) {
            toast.error('Please enter your name.');
            return;
        }
        if (!forms.email.trim()) {
            toast.error('Please enter your email.');
            return;
        }
        if (!forms.message.trim()) {
            toast.error('Please enter your message.');
            return;
        }

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'contactMessages'), {
                name: forms.name.trim(),
                email: forms.email.trim(),
                phone: forms.phone.trim(),
                service: forms.service,
                message: forms.message.trim(),
                createdAt: serverTimestamp(),
                status: 'new',
            });
            toast.success("Message sent! We'll get back to you shortly.");
            setForms({ name: '', email: '', phone: '', service: '', message: '' });
        } catch (err) {
            console.error('Contact form error:', err);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={submitHandler} className="contact-validation-active">
            <div className="row">
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.name}
                            type="text"
                            name="name"
                            onChange={changeHandler}
                            placeholder="Your Name *"
                            required
                        />
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.email}
                            type="email"
                            name="email"
                            onChange={changeHandler}
                            placeholder="Your Email *"
                            required
                        />
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.phone}
                            type="tel"
                            name="phone"
                            onChange={changeHandler}
                            placeholder="Your Phone (optional)"
                        />
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <select
                            name="service"
                            value={forms.service}
                            onChange={changeHandler}
                        >
                            <option value="">Choose a Service</option>
                            {SERVICES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col col-lg-12 col-12">
                    <textarea
                        name="message"
                        value={forms.message}
                        onChange={changeHandler}
                        placeholder="Your Message *"
                        required
                    />
                </div>
            </div>
            <div className="submit-area">
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        background: '#7593b4',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        padding: '14px 40px',
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.7 : 1,
                        transition: 'opacity 0.2s',
                    }}
                >
                    {submitting ? 'Sending…' : 'Send Message'}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
