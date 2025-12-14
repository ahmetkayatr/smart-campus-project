import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import './Profile.css';

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        phone: user?.phone || ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await userAPI.updateProfile(formData);
            setMessage('Profil başarıyla güncellendi!');
            setEditing(false);
            // Refresh page to update user data
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setMessage('Profil güncellenirken hata oluştu!');
        }

        setLoading(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="profile-container">
            <nav className="navbar">
                <h1>🎓 Smart Campus</h1>
                <div className="nav-right">
                    <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                        Dashboard
                    </button>
                    <button onClick={handleLogout} className="btn-logout">
                        Çıkış
                    </button>
                </div>
            </nav>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <h2>{user?.full_name}</h2>
                        <p className="profile-role">{user?.role}</p>
                    </div>

                    {message && (
                        <div className={message.includes('başarıyla') ? 'success-message' : 'error-message'}>
                            {message}
                        </div>
                    )}

                    {!editing ? (
                        <div className="profile-info">
                            <div className="info-row">
                                <strong>Email:</strong>
                                <span>{user?.email}</span>
                            </div>
                            <div className="info-row">
                                <strong>Ad Soyad:</strong>
                                <span>{user?.full_name}</span>
                            </div>
                            <div className="info-row">
                                <strong>Telefon:</strong>
                                <span>{user?.phone || 'Belirtilmemiş'}</span>
                            </div>
                            <div className="info-row">
                                <strong>Rol:</strong>
                                <span className="badge">{user?.role}</span>
                            </div>
                            <div className="info-row">
                                <strong>Durum:</strong>
                                <span className={user?.is_active ? 'badge-success' : 'badge-danger'}>
                                    {user?.is_active ? 'Aktif' : 'Pasif'}
                                </span>
                            </div>
                            <div className="info-row">
                                <strong>Email Doğrulandı:</strong>
                                <span className={user?.is_verified ? 'badge-success' : 'badge-warning'}>
                                    {user?.is_verified ? 'Evet' : 'Hayır'}
                                </span>
                            </div>

                            <button onClick={() => setEditing(true)} className="btn-primary">
                                Profili Düzenle
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>Ad Soyad</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Telefon</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="5551234567"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" disabled={loading} className="btn-primary">
                                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="btn-cancel"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;