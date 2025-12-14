# 📍 GPS Based Attendance System Implementation Guide

## 1. Genel Bakış

Smart Campus projesinin en kritik modülü olan "GPS Tabanlı Yoklama Sistemi", öğrencilerin fiziksel olarak derslikte bulunduklarını doğrulamak için geliştirilmiştir. Sistem, tarayıcı tabanlı Geolocation API ve sunucu tarafı matematiksel doğrulama algoritmaları kullanır.

## 2. Teknik Mimari

Sistem şu bileşenlerden oluşur:

* **Client (Frontend):** `navigator.geolocation.getCurrentPosition()` ile yüksek doğruluklu (high accuracy) koordinat verisi alır.
* **Server (Backend):** İstemciden gelen koordinatları, dersliğin veritabanındaki sabit koordinatlarıyla karşılaştırır.
* **Database:** Dersliklerin `latitude`, `longitude` ve `radius` (izin verilen yarıçap) bilgilerini saklar.

## 3. Mesafe Hesaplama Algoritması (Haversine Formülü)

Dünya'nın küresel yapısı nedeniyle iki GPS noktası arasındaki mesafe Pisagor teoremiyle değil, **Haversine Formülü** ile hesaplanmıştır.

### Formülün Matematiksel Gösterimi:

$$
a = \sin^2(\frac{\Delta\phi}{2}) + \cos \phi_1 \cdot \cos \phi_2 \cdot \sin^2(\frac{\Delta\lambda}{2})
$$

$$
c = 2 \cdot \text{atan2}( \sqrt{a}, \sqrt{1-a} )
$$

$$
d = R \cdot c
$$

### Backend Implementasyonu (JavaScript):

```javascript
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  var R = 6371; // Dünya'nın yarıçapı (km)
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Mesafe km
  return d * 1000; // Metreye çevir
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

## 4. Güvenlik ve Spoofing (Sahte Konum) Önlemleri

Sistemin manipüle edilmesini önlemek için şu kontroller uygulanır:

1. **Geofence Kontrolü:** Öğrenci ile sınıf merkezi arasındaki mesafe, belirlenen yarıçaptan (varsayılan 50m) büyükse istek reddedilir.

2. **Zaman Kontrolü:** İstek, dersin aktif olduğu saat aralığında (Session Time) gelmelidir.

3. **Accuracy (Doğruluk) Kontrolü:** GPS sinyal kalitesi (accuracy) 100 metreden kötüyse veri güvenilmez kabul edilir.





## 5. Test Senaryoları

| **Senaryo**                           | **Beklenen Sonuç**           | **Durum** |
| ------------------------------------- | ---------------------------- | --------- |
| Öğrenci sınıfın içinde (Mesafe < 50m) | ✅ Başarılı                   | Passed    |
| Öğrenci kampüs dışında (Mesafe > 50m) | ❌ Hata: "Çok uzaksınız"      | Passed    |
| GPS izni verilmedi                    | ❌ Hata: "Konum izni gerekli" | Passed    |
