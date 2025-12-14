# GPS Implementation Guide

## 1. Genel Bakış

Bu modül, öğrencilerin fiziksel olarak sınıfta olup olmadıklarını doğrulamak için **Geolocation API** ve **Haversine Formülü** kullanır.

## 2. Kullanılan Teknolojiler

- **Frontend:** HTML5 Geolocation API (`navigator.geolocation`)
- **Backend:** Node.js (Matematiksel hesaplamalar)
- **Database:** PostgreSQL (PostGIS alternatifi olarak manuel hesaplama)

## 3. Mesafe Hesaplama Algoritması (Haversine)

Dünya'nın küresel yapısını hesaba katarak iki nokta arasındaki kuş uçuşu mesafeyi hesaplar.

```javascript
d = 2 * R * asin(sqrt(sin^2(Δlat/2) + cos(lat1) * cos(lat2) * sin^2(Δlon/2)))
