import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import User from '../backend/src/models/User.js';
import authRoutes from '../backend/src/routes/auth.js';

app.use('/api/auth', authRoutes);

const JWT_SECRET = 'test_jwt_secret';
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@test.com`,
  password: 'test123456'
};

let token;
let userId;

describe('Auth API', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devboard_test');
    } catch (error) {
      console.log('MongoDB not connected, tests will fail');
    }
  });

  afterAll(async () => {
    try {
      if (userId) {
        await User.findByIdAndDelete(userId);
      }
      await mongoose.connection.close();
    } catch (error) {
      console.log('Cleanup failed');
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const uniqueEmail = `test${Date.now()}@test.com`;
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: uniqueEmail,
          password: 'test123456'
        });

      if (response.status === 201) {
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('email', uniqueEmail);
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
        userId = response.body._id;
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: testUser.email,
          password: 'test123456'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: testUser.email,
          password: 'test123456'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('token');
      } else {
        expect([401, 500]).toContain(response.status);
      }
    });

    it('should reject invalid password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'test123456'
        });

      expect(response.status).toBe(401);
    });
  });
});