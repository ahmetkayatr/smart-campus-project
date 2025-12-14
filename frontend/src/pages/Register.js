import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'student',
        student_number: '',
        department_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' // Your test department ID
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>🎓 Smart Campus</h1>
                <h2>Kayıt Ol</h2>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ad Soyad</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            placeholder="Ahmet Yılmaz"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="ornek@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Şifre</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Min 8 karakter, büyük harf, rakam"
                        />
                    </div>

                    <div className="form-group">
                        <label>Öğrenci Numarası</label>
                        <input
                            type="text"
                            name="student_number"
                            value={formData.student_number}
                            onChange={handleChange}
                            required
                            placeholder="2024001"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                    </button>
                </form>

                <p className="auth-footer">
                    Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;