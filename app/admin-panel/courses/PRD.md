You are a senior fullstack engineer and system architect.

I am currently developing a CMS backend system for a website called MCNID (mcnid.net). The system is already running well for content management such as:

- News (Berita)
- MCN Play (Video-based news)

Both of these modules are completed and ready for production use. DO NOT modify or break any existing functionality in the CMS.

Current focus:
I am now starting to build a new module called **MCN Academy (E-Learning System)**, and I want to start from the CMS/backend side first.

---

## 🧱 Current Tech Stack

- Database: PostgreSQL
- ORM: Prisma
- Backend: Node.js
- CMS Frontend: Next.js

---

## 🎯 MAIN GOAL

Design and implement a **Course / Content Management System (LMS module)** inside the CMS, and integrate it with **Supabase** (as backend service for scalability and clean architecture).

---

## ⚠️ IMPORTANT RULES

- Do NOT modify or interfere with existing CMS modules (News & MCN Play)
- Focus ONLY on MCN Academy module
- Follow scalable and clean architecture
- Prioritize API-first design

---

## 🧩 FEATURES REQUIRED

### 1. USER INTEGRATION

- Course participants must use the existing MCNID user system
- No separate user system
- Must align with current authentication & user flow
- Use shared user_id reference

---

### 2. COURSE MODEL

Each course must support:

- Title
- Slug
- Description
- Category
- Cover Image
- Duration (total learning time)
- Price (can be 0 for free)
- Certificate (boolean: has_certificate or not)

Content types inside course:

- Video (URL or embedded)
- Text (rich content)
- PDF / document
- Multi-lesson (course can have multiple modules/lessons)

---

### 3. COURSE STRUCTURE

Design relational structure:

- Course
- Module (optional grouping)
- Lesson
  - type: video / text / pdf
  - content / video_url / file_url

---

### 4. INSTRUCTOR (PENGAJAR)

- Instructor is a CMS user (role-based)

- Can login to CMS

- Can CREATE and MANAGE their own courses

- Allowed fields:
  - title
  - category
  - description
  - duration
  - price
  - certificate flag

- Cannot manage system-level configs

---

### 5. STUDENT TRACKING (IMPORTANT)

Implement simple tracking system:

- Track:
  - courses enrolled by user
  - lesson progress
  - completion percentage
  - total learning time (approximation is OK)

If Supabase has built-in capability, use it.
If not, create a simple custom tracking system.

---

### 6. ENROLLMENT SYSTEM

- User can enroll in course

- Course can be:
  - FREE
  - PAID

- CMS only stores:
  - payment_status (pending / paid)

- Payment (Midtrans) will be handled later in frontend

---

### 7. SUPABASE INTEGRATION

Use Supabase for:

- Database (optional sync or main storage)
- Auth (if possible, but must align with existing user system)
- Storage (for files / PDFs if needed)

If full Supabase adoption is not possible:

- Use hybrid approach:
  - Prisma (PostgreSQL) as main DB
  - Supabase for supporting services

---

## 🧠 WHAT I NEED FROM YOU

Provide:

### ✅ 1. Database Schema (Prisma)

- Full schema for LMS module
- Relations between:
  - User
  - Course
  - Module
  - Lesson
  - Enrollment
  - Progress

---

### ✅ 2. Supabase Integration Strategy

- How Supabase should be used in this architecture
- When to use Supabase vs PostgreSQL (Prisma)

---

### ✅ 3. API Design (Node.js)

- REST API structure:
  - create course
  - enroll course
  - track progress
  - get course detail
  - list courses

---

### ✅ 4. CMS Feature Structure (Next.js)

- Pages needed:
  - Course list
  - Create/Edit Course
  - Lesson management
  - Enrollment view (optional)

---

### ✅ 5. Tracking Logic

- How progress is calculated
- How learning time is approximated

---

### ✅ 6. Clean Architecture Suggestion

- Folder structure (backend)
- Separation of concern (service / controller / repository)

---

## 🚀 OUTPUT FORMAT

- Structured explanation
- Code snippets (Prisma + API)
- Clear architecture diagram (text-based is fine)
- Practical and ready to implement

---

## 🔥 FINAL NOTE

This system must be:

- Scalable
- Clean
- Maintainable
- Ready for future features like:
  - certificates (PDF)
  - quizzes
  - AI-generated learning

Focus on building a solid foundation first.
