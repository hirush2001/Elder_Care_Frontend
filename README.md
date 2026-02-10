# 🧓 Smart Elder Care System – Frontend

## 📌 Project Overview

The **Smart Elder Care System Frontend** is a modern web application built using **React (Vite)** and **Tailwind CSS** to provide a user-friendly interface for managing elderly care services.

This frontend interacts with the **Smart Elder Care System Backend** through secure RESTful APIs, enabling **Admins, Elders, and Caregivers** to manage health records, medication schedules, and caregiving activities efficiently.

---

## 🎯 Objectives

* Provide a clean and intuitive user interface for elderly care management
* Enable role-based access for Admins, Elders, and Caregivers
* Ensure seamless communication with backend APIs
* Deliver a responsive and accessible user experience

---

## 🏗️ System Architecture

* **Client:** Web Browser
* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Backend Communication:** RESTful APIs
* **Authentication:** JWT-based authentication (via backend)
* **Deployment:** Local / Cloud-based hosting

---

## ⚙️ Technologies Used

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **API Handling:** Axios
* **State Management:** React Hooks / Context API
* **Build Tool:** Vite
* **Version Control:** Git & GitHub

---

## 🔑 User Roles

### 👨‍💼 Admin

* Manage system users


### 🧓 Elder

* Add and view health records
* Manage medication schedules (reminders)
* Request caregivers
* View assigned caregivers,health records and schedules

### 👩‍⚕️ Caregiver

* View elder care requests
* Accept or reject caregiving requests

---

## 🧩 Core Features

* Role-based dashboards and navigation
* Secure login and authentication UI
* Form validation and error handling
* API integration with backend services
* Alerts  messages
* Reusable and modular UI components

---

## 🔗 API Integration

* Backend base URL is configured using environment variables
* Axios is used for HTTP requests
* JWT tokens are handled for authenticated API access

Example `.env` configuration:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🎨 Styling

* Tailwind CSS is used for all UI styling
* Utility-first approach for faster development
* Responsive layouts using Flexbox and Grid
* Consistent design system across the application

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js (v18 or later)
* npm or yarn
* Backend server running

### Steps

```bash
git clone https://github.com/hirush2001/Elder_Care_Frontend.git
cd elder-care-frontend
npm install
```

### Run the Application

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🧪 Testing

* Manual UI testing
* API integration testing with backend
* Validation and error state testing

---

## 🛡️ Security Considerations

* JWT-based authentication handling
* Protected routes based on user roles
* Secure API communication

---

## 📈 Future Enhancements

* Real-time notifications
* Dark mode support
* Improved accessibility (ARIA compliance)
* Mobile application integration
* Performance optimizations

---

## 📄 License

This project is developed for **academic purposes** and is open for learning and improvements.

---


