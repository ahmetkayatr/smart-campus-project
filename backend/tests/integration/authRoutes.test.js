const request = require('supertest');
const app = require('../../src/app');
const { User, Department, sequelize } = require('../../src/models');

describe('Auth API', () => {
  let departmentId;

  beforeAll(async () => {
    // Create a test department
    const dept = await Department.create({
      name: 'Test Department',
      code: 'TEST',
      faculty: 'Test Faculty'
    });
    departmentId = dept.id;
  });

  afterAll(async () => {
    // Clean up
    await User.destroy({ where: {}, force: true });
    await Department.destroy({ where: {}, force: true });
    await sequelize.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new student', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          full_name: 'Test User',
          role: 'student',
          student_number: '2021001',
          department_id: departmentId
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email', 'test@example.com');
    });

    it('should fail with weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'weak',
          full_name: 'Test User 2',
          role: 'student',
          student_number: '2021002',
          department_id: departmentId
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          full_name: 'Test User',
          role: 'student',
          student_number: '2021003',
          department_id: departmentId
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeAll(async () => {
      // Create and verify a user for login tests
      const user = await User.create({
        email: 'logintest@example.com',
        password_hash: 'Test123!',
        full_name: 'Login Test',
        role: 'student',
        is_active: true,
        is_verified: true
      });
    });

    it('should login successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'Test123!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('tokens');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'WrongPassword123!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});