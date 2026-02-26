# Yisu Hotel Booking System (Xiecheng Bootcamp Project)

## 1. Project Overview
A frontend project for hotel reservations built with React and Node.js.

## 2. Feature Overview

### 2.1 Mobile 
- Home search entry (city, date, keyword, filters)
- Hotel list (city/price/star/sort)
- Infinite scroll loading
- Hotel detail (gallery, facilities, nearby attractions, room types)
- Date range selection with night count adjustment

### 2.2 PC Admin 
- Merchant hotel creation, editing, and review submission
- Admin approve/reject actions
- Hotel online/offline management

### 2.3 Backend Server
- JWT-based authentication
- RBAC permission control (admin / merchant)
- Hotel lifecycle management (draft/pending/approved/rejected/offline)
- Hotel list/search/detail/room APIs

## 3. Tech Stack
- Frontend: React, Redux Toolkit, Axios
- UI: Ant Design Mobile, Ant Design
- Backend: Express.js
- Auth: JWT
- Data: In-memory data + mock initialization

## 4. Project Structure
```text
Xiecheng/
├── README.md
├── mobile/                               
│   ├── package.json
│   └── src/
│       ├── pages/                     
│       │   ├── Home/
│       │   ├── HotelList/
│       │   └── HotelDetail/
│       ├── components/                   
│       │   ├── CitySelectorPopup/
│       │   ├── DatePickerPopup/
│       │   ├── OptionSelectorPopup/
│       │   └── DateRangePicker/
│       ├── store/                      
│       │   ├── index.js
│       │   └── slices/
│       │       └── hotelSlice.js
│       ├── api/                          
│       │   └── axios.js
│       ├── App.jsx                    
│       └── main.jsx                      
├── admin/                               
│   ├── package.json
│   └── src/
│       ├── pages/                    
│       ├── api/                          
│       ├── router/                        
│       └── main.jsx
└── server/                           
    ├── app.js                      
    ├── routes/                        
    │   ├── auth.js
    │   ├── categories.js
    │   └── hotels.js
    ├── middleware/
    │   └── auth.js                      
    ├── mocks/                          
    │   ├── hotels.js
    │   └── index.js
    └── package.json

```

## 5. Quick Start

### 5.1 Start Backend
```bash
cd server
npm install
npm run dev
```
Default port: `3000`

### 5.2 Start Mobile Client
```bash
cd mobile
npm install
npm run dev
```
Default port: `3002`

### 5.3 Start PC Admin Panel
```bash
cd admin
npm install
npm run dev
```
Default port: `3001`