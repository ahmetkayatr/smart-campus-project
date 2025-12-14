# 🗄️ Database Schema Update (Part 2)

Part 2 kapsamında, Akademik Yönetim ve Yoklama modüllerini desteklemek için veritabanına aşağıdaki tablolar ve ilişkiler eklenmiştir.

## Yeni Tablolar

### 1. `courses` (Dersler)

Dersin statik bilgilerini tutar.

* `id` (PK): UUID / Serial
* `code`: VARCHAR (Örn: CSE101) - Unique
* `name`: VARCHAR
* `credits`: INTEGER
* `department_id`: FK -> departments.id

### 2. `course_sections` (Şubeler)

Bir dersin o dönem açılan şubelerini ve hocasını tutar.

* `id` (PK): UUID / Serial
* `course_id`: FK -> courses.id
* `instructor_id`: FK -> users.id (Hoca)
* `semester`: VARCHAR
* `capacity`: INTEGER

### 3. `enrollments` (Kayıtlar)

Öğrencilerin hangi derse kayıtlı olduğunu tutar (Çoka-çok ilişki).

* `id` (PK): UUID / Serial
* `student_id`: FK -> users.id
* `section_id`: FK -> course_sections.id
* `enrolled_at`: TIMESTAMP

### 4. `attendance_sessions` (Yoklama Oturumları)

Hoca tarafından başlatılan her bir ders saati.

* `id` (PK): UUID / Serial
* `section_id`: FK -> course_sections.id
* `start_time`: TIMESTAMP
* `end_time`: TIMESTAMP
* `latitude`: DECIMAL (Sınıf konumu)
* `longitude`: DECIMAL (Sınıf konumu)
* `radius_meters`: INTEGER (Geofence yarıçapı)

### 5. `attendance_records` (Yoklama Kayıtları)

Öğrencinin derse katılım kanıtı.

* `id` (PK): UUID / Serial
* `session_id`: FK -> attendance_sessions.id
* `student_id`: FK -> users.id
* `check_in_time`: TIMESTAMP
* `user_latitude`: DECIMAL (Kanıt konumu)
* `user_longitude`: DECIMAL
* `distance_calculated`: DECIMAL (Hesaplanan mesafe)

## İlişkiler (ERD Notları)

* Bir **Course**, birden fazla **Section**'a sahip olabilir (1:N).
* Bir **Student**, birden fazla **Section**'a kayıt olabilir (N:M).
* Bir **Section**, birden fazla **Attendance Session**'a sahip olabilir.
