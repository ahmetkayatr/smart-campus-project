const { User, Department, Student, Faculty, Wallet, MealMenu, Event, Schedule } = require('../models');
const { v4: uuidv4 } = require('uuid');

const seedData = async () => {
  try {
    console.log('🌱 Veritabanı tohumlama (seeding) başlatılıyor...');

    // 1. Departmanları Oluştur
    const departments = await Department.bulkCreate([
      { name: 'Bilgisayar Mühendisliği', code: 'CENG', faculty: 'Mühendislik Fakültesi' },
      { name: 'Elektrik-Elektronik Mühendisliği', code: 'EEE', faculty: 'Mühendislik Fakültesi' },
      { name: 'İşletme', code: 'BA', faculty: 'İktisadi ve İdari Bilimler Fakültesi' }
    ]);
    console.log('✅ Departmanlar oluşturuldu.');

    // Yardımcı Fonksiyon: Kullanıcı ve Cüzdan Oluşturma
    const createCampusUser = async (userData, walletData = {}) => {
      const user = await User.create({ ...userData, is_active: true, is_verified: true });
      await Wallet.create({
        user_id: user.id,
        balance: walletData.balance || 100.00,
        is_scholarship: walletData.isScholarship || false
      });
      return user;
    };

    // 2. Admin Oluştur
    await createCampusUser({
      email: 'admin@smartcampus.edu',
      password_hash: 'Admin123!',
      full_name: 'Sistem Admini',
      role: 'admin'
    });
    console.log('✅ Admin ve Cüzdanı oluşturuldu.');

    // 3. Akademisyenleri Oluştur
    const f1 = await createCampusUser({
      email: 'mehmet.yilmaz@smartcampus.edu',
      password_hash: 'Faculty123!',
      full_name: 'Dr. Mehmet Yılmaz',
      role: 'faculty'
    });
    await Faculty.create({
      user_id: f1.id,
      employee_number: 'FAC001',
      department_id: departments[0].id,
      title: 'Dr. Öğretim Üyesi'
    });
    console.log('✅ Akademisyenler oluşturuldu.');

    // 4. Öğrencileri Oluştur
    for (let i = 1; i <= 5; i++) {
      const isScholar = i <= 2; // İlk 2 öğrenci burslu
      const sUser = await createCampusUser({
        email: `student${i}@smartcampus.edu`,
        password_hash: 'Student123!',
        full_name: `Öğrenci ${i}`,
        role: 'student'
      }, { isScholarship: isScholar, balance: isScholar ? 0.00 : 150.00 });

      await Student.create({
        user_id: sUser.id,
        student_number: `20210${i}`,
        department_id: departments[i % 3].id,
        is_scholarship: isScholar
      });
    }
    console.log('✅ Öğrenciler ve Cüzdanları (Burslu/Ücretli) oluşturuldu.');

    // 5. Part 3 Özel: Yemek Menüleri
    const today = new Date().toISOString().split('T')[0];
    await MealMenu.create({
      cafeteriaId: uuidv4(), // Örnek ID
      date: today,
      mealType: 'lunch',
      items: { main: 'Mercimek Çorbası', course: 'Orman Kebabı', side: 'Pirinç Pilavı', dessert: 'Ayran' },
      nutrition: { calories: 850, protein: '30g' },
      isPublished: true
    });
    console.log('✅ Günlük yemek menüsü oluşturuldu.');

    // 6. Part 3 Özel: Derslikler (Scheduling Testi İçin)
    // Not: Eğer Classroom modelin varsa burayı kullan, yoksa ekle.
    /*
    await Classroom.bulkCreate([
      { name: 'A-101', capacity: 40, building: 'Mühendislik-A' },
      { name: 'B-202', capacity: 60, building: 'İİBF-B' }
    ]);
    */

    console.log('\n🎉 Tohumlama başarıyla tamamlandı!');
  } catch (error) {
    console.error('❌ Tohumlama hatası:', error);
  }
};

module.exports = seedData;