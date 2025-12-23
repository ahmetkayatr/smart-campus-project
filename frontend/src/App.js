import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import Wallet from './pages/Wallet';        // Part 3
import MealMenu from './pages/MealMenu';    // Part 3
// Eðer Event ve Schedule sayfalarýný oluþturduysan bunlarý da import et:
// import Events from './pages/Events'; 
// import Schedule from './pages/Schedule'; 

// Protected Route Component
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <h2>Yükleniyor...</h2>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes - Herkes eriþebilir */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes - Sadece giriþ yapanlar eriþebilir */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* PART 2 ROTASI: DERSLER ve YOKLAMA */}
                    <Route
                        path="/courses"
                        element={
                            <ProtectedRoute>
                                <Courses />
                            </ProtectedRoute>
                        }
                    />

                    {/* YENÝ EKLENEN PART 3 ROTALARI */}

                    {/* Cüzdan ve Ödeme Ýþlemleri */}
                    <Route
                        path="/wallet"
                        element={
                            <ProtectedRoute>
                                <Wallet />
                            </ProtectedRoute>
                        }
                    />

                    {/* Yemekhane Menü ve Rezervasyon */}
                    <Route
                        path="/meals"
                        element={
                            <ProtectedRoute>
                                <MealMenu />
                            </ProtectedRoute>
                        }
                    />

                    {/* Kampüs Etkinlikleri (Opsiyonel/Geliþtirilecek) */}
                    {/* <Route
                        path="/events"
                        element={
                            <ProtectedRoute>
                                <Events />
                            </ProtectedRoute>
                        }
                    /> 
                    */}

                    {/* Haftalýk Ders Programý (Scheduling) */}
                    {/* <Route
                        path="/schedule"
                        element={
                            <ProtectedRoute>
                                <Schedule />
                            </ProtectedRoute>
                        }
                    /> 
                    */}

                    {/* Varsayýlan Yönlendirme */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;