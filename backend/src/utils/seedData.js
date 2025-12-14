const { User, Department, Student, Faculty } = require('../models');

// Seed initial data for testing
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create departments
    const departments = await Department.bulkCreate([
      {
        name: 'Bilgisayar Mühendisliği',
        code: 'CENG',
        faculty: 'Mühendislik Fakültesi',
        description: 'Bilgisayar mühendisliği bölümü'
      },
      {
        name: 'Elektrik-Elektronik Mühendisliği',
        code: 'EEE',
        faculty: 'Mühendislik Fakültesi',
        description: 'Elektrik-elektronik mühendisliği bölümü'
      },
      {
        name: 'İşletme',
        code: 'BA',
        faculty: 'İktisadi ve İdari Bilimler Fakültesi',
        description: 'İşletme bölümü'
      }
    ]);

    console.log('✅ Departments created');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@smartcampus.edu',
      password_hash: 'Admin123!',
      full_name: 'Admin Kullanıcı',
      role: 'admin',
      is_active: true,
      is_verified: true
    });

    console.log('✅ Admin user created (Email: admin@smartcampus.edu, Password: Admin123!)');

    // Create faculty users
    const facultyUser1 = await User.create({
      email: 'mehmet.yilmaz@smartcampus.edu',
      password_hash: 'Faculty123!',
      full_name: 'Dr. Mehmet Yılmaz',
      role: 'faculty',
      is_active: true,
      is_verified: true
    });

    await Faculty.create({
      user_id: facultyUser1.id,
      employee_number: 'FAC001',
      department_id: departments[0].id,
      title: 'Dr. Öğretim Üyesi',
      office_location: 'A201'
    });

    const facultyUser2 = await User.create({
      email: 'ayse.demir@smartcampus.edu',
      password_hash: 'Faculty123!',
      full_name: 'Prof. Dr. Ayşe Demir',
      role: 'faculty',
      is_active: true,
      is_verified: true
    });

    await Faculty.create({
      user_id: facultyUser2.id,
      employee_number: 'FAC002',
      department_id: departments[1].id,
      title: 'Profesör',
      office_location: 'B105'
    });

    console.log('✅ Faculty users created');

    // Create student users
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const studentUser = await User.create({
        email: `student${i}@smartcampus.edu`,
        password_hash: 'Student123!',
        full_name: `Öğrenci ${i}`,
        role: 'student',
        is_active: true,
        is_verified: true
      });

      await Student.create({
        user_id: studentUser.id,
        student_number: `20210${i.toString().padStart(3, '0')}`,
        department_id: departments[i % 3].id,
        admission_year: 2021,
        current_semester: 5,
        is_scholarship: i <= 2 // First 2 students have scholarship
      });

      students.push(studentUser);
    }

    console.log('✅ Student users created');
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin:');
    console.log('   Email: admin@smartcampus.edu');
    console.log('   Password: Admin123!');
    console.log('\n👨‍🏫 Faculty:');
    console.log('   Email: mehmet.yilmaz@smartcampus.edu');
    console.log('   Password: Faculty123!');
    console.log('   Email: ayse.demir@smartcampus.edu');
    console.log('   Password: Faculty123!');
    console.log('\n👨‍🎓 Students:');
    for (let i = 1; i <= 5; i++) {
      console.log(`   Email: student${i}@smartcampus.edu`);
      console.log(`   Password: Student123!`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

module.exports = seedData;

// Run if called directly
if (require.main === module) {
  const { testConnection } = require('../config/database');
  const { syncDatabase } = require('../models');
  
  (async () => {
    await testConnection();
    await syncDatabase();
    await seedData();
    process.exit(0);
  })();
}