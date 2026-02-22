# Waste Zero Initiative ♻️

**Join the Recycling Revolution.**

Waste Zero is a next-generation digital platform designed to help communities schedule waste pickups, categorize recyclables responsibly, and promote sustainable waste management habits. By connecting residents with intelligent pickup agents and providing transparent impact statistics, we aim to eliminate waste and protect our environment.

## 🚀 Project Overview

Waste Zero streamlines the lifecycle of waste management through a professional, secure, and user-centric platform.

**Key Outcomes**

- **Intelligent Pickups**: Effortlessly schedule waste collections using our dynamic backend.
- **Smart Categorization**: Sort waste into **Plastic, Organic, E-waste**, and more for optimal recycling.
- **Dynamic agent assignment**: Pickup agents are assigned intelligently based on location for maximum efficiency.
- **Impact Tracking**: Users receive notifications and can track their environmental contribution through detailed statistics.
- **Role-Based Access**: Specialized dashboards for **Users**, **Pickup Agents**, and **Administrators**.

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS (Premium UI/UX with Glassmorphism)
- **Icons**: Lucide-React
- **State Management**: React Context API (Auth & Theme)
- **Routing**: React Router DOM

### Backend

- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Authentication & Bcrypt password hashing
- **Validation**: Validator.js

## 📁 Project Structure

- `/Backend`: Express server, MongoDB models, and authentication logic.
- `/Frontend/Waste-Zero`: Premium React application featuring the "Recycling Revolution" landing page and role-based dashboards.

## ⚙️ Getting Started

### Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   npm install
   ```
2. Create a `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `Frontend/Waste-Zero` directory:
   ```bash
   cd Frontend/Waste-Zero
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Access the platform at `http://localhost:5173`.
