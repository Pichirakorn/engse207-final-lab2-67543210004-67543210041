# TEAM_SPLIT.md
## ข้อมูลกลุ่ม

- กลุ่มที่: S1-4
- รายวิชา: ENGSE207 Software Architecture

## รายชื่อสมาชิก

- 67543210004-7 นายพิชิรกร ชาติปิระ
- 67543210041-9 นายพัชรพล สืบทายาท

การแบ่งงานหลัก
สมาชิกคนที่ 1: นายพิชิรกร ชาติปิระ

- รับผิดชอบงานหลักดังต่อไปนี้
- พัฒนา Auth Service (ระบบสมัครสมาชิกและเข้าสู่ระบบ)
- พัฒนา Task Service (ระบบจัดการงาน)
- ออกแบบและเชื่อมต่อฐานข้อมูล (PostgreSQL) ของแต่ละ service
- ตั้งค่า Environment Variables และ configuration ของแต่ละ service
- ดูแลด้าน security เช่น JWT Authentication
- Deploy services ขึ้น Railway

สมาชิกคนที่ 2: นายพัชรพล สืบทายาท

- รับผิดชอบงานหลักดังต่อไปนี้
- ทำหน้าที่ Tester (ทดสอบระบบ)
- ทดสอบ API ด้วย curl
- ตรวจสอบการทำงานของแต่ละ endpoint (register, login, create task, get tasks)
- ทดสอบการทำงานร่วมกันระหว่าง services (integration testing)
- จัดทำ README.md
- เขียนเอกสารอธิบายระบบ
- จัดทำ Screenshots
- ตรวจสอบความถูกต้องของระบบก่อนส่งงาน
- ปรับปรุงและแก้ไข bug ร่วมกัน

## เหตุผลในการแบ่งงาน

การแบ่งงานใช้แนวคิด แบ่งตามหน้าที่ (Role-based Responsibility) และ Service Boundary โดย:

- สมาชิกคนที่ 1 เน้นด้าน Backend Development และ System Setup
- สมาชิกคนที่ 2 เน้นด้าน Testing, Documentation และ Validation

## วิธีนี้ช่วยให้:

- งานไม่ซ้ำซ้อน
- ทำงานได้เร็วขึ้น
- แต่ละคนโฟกัสในสิ่งที่ถนัด
- สรุปการเชื่อมโยงงานของสมาชิก

# งานของสมาชิกทั้งสองมีความเชื่อมโยงกันดังนี้:

สมาชิกคนที่ 1 พัฒนา services และ deploy ระบบ

สมาชิกคนที่ 2 ทำการทดสอบ services เหล่านั้นผ่าน API Gateway

- หากพบข้อผิดพลาด จะ feedback กลับไปให้แก้ไข
- ทั้งสองฝ่ายต้องประสานงานกันในส่วน:
- API contract (endpoint, request/response)
- การเชื่อมต่อระหว่าง services
- การทดสอบระบบแบบ end-to-end
