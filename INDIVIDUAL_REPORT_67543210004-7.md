# INDIVIDUAL_REPORT_[รหัสเพื่อน].md
## ข้อมูลผู้จัดทำ

ชื่อ-นามสกุล: นายพิชิรกร ชาติปิระ
รหัสนักศึกษา: 67543210004-7
กลุ่ม: S1-4

# ขอบเขตงานที่รับผิดชอบ

- รับผิดชอบพัฒนา backend ของระบบ เช่น Auth Service, Task Service และตั้งค่า API Gateway รวมถึง deploy ระบบขึ้น Railway
- สิ่งที่ได้ดำเนินการด้วยตนเอง
- เขียน API สำหรับ register และ login
- ทำระบบ JWT สำหรับ authentication
- เขียน API สำหรับจัดการ task เช่น create และ get task
- เชื่อมต่อ database และออกแบบ table
- ตั้งค่า API Gateway ให้เชื่อมไปแต่ละ service
- deploy ระบบขึ้น Railway

# ปัญหาที่พบและวิธีการแก้ไข

## ปัญหา 1: database ใช้ไม่ได้

- เกิดจากตั้งค่า DATABASE_URL ผิด
- แก้โดยตรวจสอบค่าใหม่และเชื่อมต่อใหม่

## ปัญหา 2: token ใช้งานไม่ได้

- ลืมส่ง Authorization header
- แก้โดยเพิ่ม Bearer token ตอนเรียก API

# สิ่งที่ได้เรียนรู้จากงานนี้

- เข้าใจการแยกระบบเป็นหลาย service
- เรียนรู้การใช้ JWT
- ได้ลอง deploy ระบบจริง
- เข้าใจการตั้งค่า environment variables

# แนวทางการพัฒนาต่อไปใน Set 2

- เพิ่ม service อื่น ๆ เช่น logging
- ปรับระบบให้รองรับผู้ใช้มากขึ้น
- เพิ่ม security และ performance
