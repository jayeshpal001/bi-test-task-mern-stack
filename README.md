# Bl Test Task – MERN Stack

This is a MERN Stack expense-sharing application developed as part of the Brain Inventory proficiency task.

## 🔧 Tech Stack

- **MongoDB**
- **Express.js**
- **React.js**
- **Node.js**

## 📌 Features Implemented

- ✅ User Registration & Login
- ✅ Group Creation
- 🔄 Group Member Invitation (In Progress)
- 🔄 Expense Management (In Progress)
- 🔄 OAuth 2.0 API Security (In Progress)

## 📂 Project Structure

client/ # React Frontend
server/ # Express Backend
├── models/ # Mongoose Models
├── routes/ # API Routes
├── controllers/
├── middleware/

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Bl-Test-Task-MERN-Stack.git
   cd Bl-Test-Task-MERN-Stack
  
2.    Install dependencies:

Frontend:

bash
Copy
Edit
cd client
npm install

Backend:

bash
Copy
Edit
cd ../server
npm install

3. Set up .env files for backend with:

ini
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4. Run the application:

bash
Copy
Edit
# Terminal 1
cd backend
npm run server

# Terminal 2
cd client
npm run dev
