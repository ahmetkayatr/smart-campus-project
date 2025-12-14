# 📚 Part 2 API Documentation

## Base URL

`http://localhost:5000/api/v1`

## Authentication

Tüm endpointler **Bearer Token** (JWT) gerektirir. Header'da `Authorization: Bearer <token>` gönderilmelidir.
---

## 1. Academic Management Endpoints

### Get All Courses (Dersleri Listele)

Kullanıcının kayıtlı olduğu veya sistemdeki aktif dersleri listeler.

* **URL:** `/courses`
* **Method:** `GET`
* **Response (200 OK):**
  
  ```json
  {
  "success": true,
  "data": [
  {
  "id": 1,
  "code": "CSE101",
  "name": "Computer Engineering 101",
  "instructor": "Dr. Mehmet Sevri",
  "schedule": "Monday 09:00"
  }
  ]
  }
  ```
  
  ### Get Course Details (Ders Detayı)
* **URL:** `/courses/:id`
* **Method:** `GET`

---

## 2. Attendance (Yoklama) Endpoints

### GPS Check-in (Yoklama Ver)

Öğrencinin anlık konumu ile derse katılım isteği gönderir.

* **URL:** `/attendance/checkin`
* **Method:** `POST`
* **Request Body:**
  
  ```json
  {
  "sessionId": 1,
  "studentLatitude": 41.008237,
  "studentLongitude": 28.978358
  }
  ```
* **Success Response (200 OK):**
  
  ```json
  {
  "success": true,
  "message": "Yoklama Başarılı! Sınıfa 12.5 metre uzaklıktasınız.",
  "data": {
  "checkInTime": "2025-12-14T19:30:00.000Z"
  }
  }
  ```
* **Error Response (400 Bad Request):**
  
  ```json
  {
  "success": false,
  "message": "Çok uzaksınız! Sınıfa mesafeniz: 150.2 metre."
  }
  ```
  
  ### Create Session (Oturum Başlat - Instructor Only)
  
  Hocanın ders için yoklamayı aktif etmesini sağlar.
* **URL:** `/attendance/sessions`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
  "sectionId": 1,
  "durationMinutes": 45,
  "radius": 50
  }
