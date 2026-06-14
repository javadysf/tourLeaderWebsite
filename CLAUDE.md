# CLAUDE.md

## Project Overview

این پروژه یک پلتفرم حرفه‌ای مدیریت و فروش تورهای مسافرتی است.

هدف پروژه ایجاد یک سامانه کامل برای مدیریت تورهای داخلی و خارجی، رزرو آنلاین، پرداخت، مدیریت مسافران، مدیریت راهنماها و گزارش‌گیری مدیریتی است.

تمام کدهای تولید شده باید Production Ready باشند.

---

# Tech Stack

## Frontend

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Query (TanStack Query)
* Zustand
* React Hook Form
* Zod

## Backend

* Node.js
* NestJS
* TypeScript

## Database

* PostgreSQL

## ORM

* Prisma

## Authentication

* JWT
* Refresh Token
* Role Based Access Control (RBAC)

## Storage

* S3 Compatible Storage

---

# Development Rules

## General

* Use TypeScript everywhere.
* Never use JavaScript.
* Follow Clean Architecture.
* Follow SOLID principles.
* Generate reusable code.
* Avoid duplicate code.
* Use meaningful naming conventions.
* Write scalable and maintainable code.

## Frontend

* Use App Router.
* Use Server Components whenever possible.
* Use Client Components only when necessary.
* Use Server Actions when appropriate.
* Use shadcn/ui components.
* Use Tailwind CSS.
* Use responsive design.
* Use Persian language for all UI texts.
* Optimize SEO.

## Backend

* Use NestJS Modules.
* Use DTO validation.
* Use Prisma ORM.
* Implement proper error handling.
* Implement logging.
* Implement audit logs.

---

# User Roles

## Admin

Full access to system.

Permissions:

* Manage users
* Manage tours
* Manage bookings
* Manage payments
* Manage guides
* Manage organizers
* Manage reviews
* Manage reports
* Manage coupons
* Manage settings

---

## Organizer

Permissions:

* Create tours
* Update tours
* Delete tours
* View bookings
* Manage capacities
* Manage schedules

---

## Guide

Permissions:

* View assigned tours
* View passengers
* Send announcements
* Manage attendance
* Submit trip reports

---

## Traveler

Permissions:

* Register
* Login
* Book tours
* Manage profile
* Manage bookings
* Submit reviews
* Use wallet

---

# Main Features

## Authentication

* Register
* Login
* Logout
* OTP Login
* Forgot Password
* Reset Password
* Two Factor Authentication

---

## User Management

Fields:

* First Name
* Last Name
* Mobile
* Email
* National ID
* Passport Number
* Avatar

---

## Tours

Fields:

* Title
* Slug
* Description
* Images
* Video
* Country
* City
* Start Date
* End Date
* Capacity
* Remaining Capacity
* Price
* Discount
* Status

Tour Status:

* Draft
* Published
* Finished
* Cancelled

---

## Tour Categories

* Domestic
* International
* Adventure
* Nature
* Cultural
* Pilgrimage
* Luxury
* Family
* Educational

---

## Itinerary

Each tour contains daily schedules.

Fields:

* Day Number
* Title
* Description
* Location
* Time

---

## Booking System

Booking Flow:

1. Select Tour
2. Enter Travelers
3. Confirm Information
4. Payment
5. Voucher Generation

Booking Status:

* Pending
* Paid
* Cancelled
* Refunded

---

## Payments

Features:

* Online Payment
* Wallet Payment
* Installment Payment
* Refund Requests
* Transaction History
* Invoice Generation

---

## Wallet

Features:

* Deposit
* Withdraw
* Transaction History
* Bonus Credits

---

## Hotels

Fields:

* Name
* Rating
* Images
* Address
* Amenities

---

## Transportation

Types:

* Flight
* Train
* Bus
* Ship

Fields:

* Origin
* Destination
* Departure Time
* Arrival Time

---

## Reviews

Features:

* Rating
* Comment
* Upload Images
* Admin Replies

---

## Coupons

Types:

* Percentage
* Fixed Amount

Fields:

* Code
* Expiration Date
* Usage Limit
* Status

---

## Notifications

Channels:

* SMS
* Email
* Push Notification
* In-App Notification

---

## Support System

Features:

* Tickets
* Live Chat
* FAQ

---

## Reports

Admin Reports:

* Revenue
* Profit
* Bookings
* Users
* Most Popular Tours
* Refund Statistics
* Customer Satisfaction

---

# Database Entities

User

Role

Permission

Organizer

Guide

Tour

TourCategory

TourImage

Itinerary

Booking

Traveler

Payment

Transaction

Wallet

WalletTransaction

Hotel

Transportation

Review

Coupon

Notification

Ticket

AuditLog

Setting

---

# API Structure

/api/auth

/api/users

/api/tours

/api/categories

/api/bookings

/api/payments

/api/wallet

/api/reviews

/api/coupons

/api/hotels

/api/transports

/api/guides

/api/organizers

/api/tickets

/api/notifications

/api/reports

/api/settings

---

# Admin Dashboard

Pages:

* Dashboard
* Users
* Tours
* Bookings
* Payments
* Wallets
* Reviews
* Guides
* Organizers
* Reports
* Coupons
* Settings

Dashboard Metrics:

* Total Users
* Active Users
* Total Tours
* Total Revenue
* Total Bookings
* Conversion Rate
* Top Selling Tours

---

# User Dashboard

Pages:

* Overview
* My Tours
* My Bookings
* Wallet
* Notifications
* Profile
* Security Settings

---

# SEO Requirements

* Server Side Rendering
* Dynamic Metadata
* Sitemap
* Robots.txt
* Open Graph
* Structured Data
* Fast Loading

---

# Security Requirements

* JWT Authentication
* Refresh Tokens
* RBAC Authorization
* Rate Limiting
* CSRF Protection
* XSS Protection
* SQL Injection Protection
* Secure File Uploads
* Audit Logging

---

# Coding Standards

Always:

* Create reusable components.
* Use TypeScript strict mode.
* Use clean folder structures.
* Separate business logic from UI.
* Create loading states.
* Create error states.
* Create empty states.
* Write scalable code.

Never:

* Generate placeholder code.
* Generate mock implementations unless requested.
* Use inline styles.
* Use any.
* Use duplicated code.

---

# UI Style

Theme:

* Modern
* Professional
* Luxury Travel Style
* Persian RTL
* Mobile First

Design Preferences:

* Clean Layout
* Smooth Animations
* Accessible Components
* High Readability
* Premium Feel

---

# Final Goal

Build a complete enterprise-grade travel and tour management platform capable of handling thousands of users, hundreds of tours, online bookings, secure payments, advanced reporting, and multi-role management while maintaining high performance, security, and scalability.
