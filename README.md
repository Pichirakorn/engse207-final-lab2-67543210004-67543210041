# ENGSE207 – Microservices Final Project (Set 1 + Set 2)

## 1. Student Information



- 67543210004-7 ชื่อ นายพิชิรกร  ชาติปิระ 
- 67543210041-9 ชื่อ นายพัชรพล  สืบทายาท 

Course: ENGSE207 Software Architecture  
Instructor: อ.ธนิต เกตุแก้ว

---

# 2. Cloud Service URLs (Railway)

ระบบถูก deploy บน Railway Cloud

Auth Service  
https://auth-service-production-0277.up.railway.app/api/

User Service  
https://user-service-production-5148.up.railway.app/api/

Task Service  
https://task-service-production-cec8.up.railway.app/api/

---

# 3. Architecture Overview

ระบบนี้ออกแบบโดยใช้ **Microservices Architecture** ซึ่งแยก service ตาม domain

- Auth Service → จัดการ authentication และ JWT
- User Service → จัดการ profile ผู้ใช้
- Task Service → จัดการ tasks

แต่ละ service มี database ของตัวเองตามหลัก **Database per Service Pattern**

---

# 4. Architecture Diagram (Cloud)

```
Browser / Postman
        │
        │ HTTPS (Railway จัดการให้อัตโนมัติ)
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Railway Project                                      │
│                                                                          │
│  Auth Service                Task Service         User Service           │
│  https://auth-xxx.railway.app   https://task-xxx…  https://user-xxx…     │
│       │                            │                    │                │
│       ▼                            ▼                    ▼                │
│   auth-db (PostgreSQL)        task-db (PostgreSQL)  user-db (PostgreSQL) │
│   [Railway Plugin]            [Railway Plugin]      [Railway Plugin]     │
│                                                                          │
│  Frontend เรียกแต่ละ service โดยตรงผ่าน config.js                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# 5. Gateway Strategy

เลือกใช้ Option A: Frontend เรียก URL ของแต่ละ Microservice โดยตรง

Frontend จะติดต่อกับแต่ละ Service โดยตรงผ่าน URL ที่กำหนดไว้ในไฟล์ config.js แทนการใช้ API Gateway หรือ Reverse Proxy

```
const CONFIG = {
  AUTH_API: "https://auth-service-production-0277.up.railway.app/api",
  USER_API: "https://user-service-production-5148.up.railway.app/api",
  TASK_API: "https://task-service-production-cec8.up.railway.app/api"
};
```
Frontend จะใช้ค่าเหล่านี้เพื่อเรียก API ของแต่ละ service

ตัวอย่าง

Login
```
fetch(`${AUTH}/api/auth/login`)
```
Load tasks
```
fetch(`${TASK}/api/tasks`)
```
Load profile
```
fetch(`${USER}/api/users/me`)
```

วิธีนี้ทำให้ Frontend สามารถติดต่อกับแต่ละ Microservice ได้โดยตรงผ่าน Cloud URL ที่ deploy บน
Railway

### เหตุผลที่เลือก

1. โครงสร้างระบบง่ายและเข้าใจง่าย

Option A ไม่ต้องสร้าง API Gateway เพิ่ม ทำให้โครงสร้างระบบมีเพียง

- Frontend
- Auth Service
- User Service
- Task Service

ช่วยลดความซับซ้อนของระบบและเหมาะสำหรับงานทดลองหรือโปรเจกต์การเรียน

2. Deploy บน Cloud ได้เร็ว

การ deploy บน Railway สามารถ deploy แต่ละ service แยกกันได้ทันที และ frontend สามารถเรียก service ผ่าน URL ได้โดยตรง

ไม่จำเป็นต้องตั้งค่าเพิ่มเติมเช่น

- Reverse Proxy
- API Gateway
- Load Balancer

ทำให้ขั้นตอน deploy ง่ายและรวดเร็ว

3. ลดความเสี่ยงของปัญหาระบบ

ถ้าใช้ Option B หรือ Option C จะต้องมี Gateway เพิ่มเข้ามาในระบบ เช่น

Nginx หรือ API Gateway ที่สร้างด้วย Express.js ซึ่งอาจเกิดปัญหา
- routing ผิด 
- service ติดต่อกันไม่ได้
- gateway crash

Option A ตัดส่วนนี้ออกไป ทำให้ระบบมีโอกาสเกิด error น้อยลง

4. เหมาะสำหรับระบบขนาดเล็ก

สำหรับระบบที่มีจำนวน service ไม่มาก (เช่น 3 services ใน lab นี้)
การเรียก service โดยตรงจาก frontend เป็นแนวทางที่เหมาะสมและใช้งานได้จริง

---

# 6. Set 2 ต่อยอดจาก Set 1 อย่างไร

Set 1
- สร้าง Microservices 3 ตัว
- Auth Service
- User Service
- Task Service
- แยก database ต่อ service
- Deploy บน Railway

Set 2 เพิ่มฟีเจอร์

- Role-based authorization (admin / member)
- Security test cases
- Rate limiting
- Logging service
- Integration ระหว่าง services

Set 2 จึงเป็นการ **เพิ่ม security และ integration layer** ให้กับระบบที่สร้างใน Set 1

---

# 7. วิธีรัน Local ด้วย Docker Compose

ติดตั้ง

- Docker
- Docker Compose

รันระบบ
```
docker compose up --build
```
หลังจากนั้น service จะเปิดที่

Auth  
http://localhost:3001

User  
http://localhost:3002

Task  
http://localhost:3003

---

# 8. Environment Variables

Auth Service
```
PORT=3001
JWT_SECRET=123456
DATABASE_URL=postgresql://postgres:WvOPiNGVHpnxNseURYohBakdqUsfyIPX@postgres-zauv.railway.internal:5432/railway
```
User Service
```
PORT=3002
DATABASE_URL=postgresql://postgres:NMsSLflsDLmzdrgZsyTDYPxagaUBqqQe@postgres-omhh.railway.internal:5432/railway
```
Task Service
```
PORT=3003
DATABASE_URL=postgresql://postgres:DRoPjXsQJNWKndjtKOMfaEJImGXDHeKI@postgres.railway.internal:5432/railway
```
---

# 9. API Testing (curl Example)

Register

curl -X POST https://auth-service-production.up.railway.app/api/auth/register

-H "Content-Type: application/json"
-d '{"email":"test@test.com
","password":"123456"}'

Login

curl -X POST https://auth-service-production.up.railway.app/api/auth/login

-H "Content-Type: application/json"
-d '{"email":"test@test.com
","password":"123456"}'

Get profile

curl https://user-service-production.up.railway.app/api/users/me

-H "Authorization: Bearer TOKEN"

Create task

curl -X POST https://task-service-production.up.railway.app/api/tasks

-H "Authorization: Bearer TOKEN"
-H "Content-Type: application/json"
-d '{"title":"Finish assignment"}'