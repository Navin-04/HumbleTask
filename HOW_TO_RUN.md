# 🚀 How to Run the E-Commerce Application

## Prerequisites
- Node.js installed (v14 or higher)
- npm installed
- MongoDB Atlas account (already configured)

## Step-by-Step Instructions

### Option 1: Run Backend and Frontend Together (Recommended)

#### Step 1: Install All Dependencies
Open your terminal in the project root directory (`D:\ecom`) and run:

```bash
npm run install:all
```

This will install dependencies for both backend and frontend.

#### Step 2: Verify Environment Variables
Make sure your `.env` file exists in the root directory with:
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT secret key
- `PORT` - Server port (default: 5000)

#### Step 3: Start Both Servers
Run this command to start both backend and frontend simultaneously:

```bash
npm run dev:all
```

This will:
- Start backend server on `http://localhost:5000`
- Start frontend React app on `http://localhost:3000`

The frontend will automatically open in your browser.

---

### Option 2: Run Backend and Frontend Separately

#### Running the Backend Server

**Step 1:** Open a terminal in the project root (`D:\ecom`)

**Step 2:** Start the backend server:

```bash
# For production mode
npm start

# OR for development mode (with auto-reload)
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected successfully
📦 Database: ecommerce
Server running on port 5000
```

**Step 3:** Keep this terminal open. The backend is now running on `http://localhost:5000`

#### Running the Frontend

**Step 1:** Open a NEW terminal window/tab

**Step 2:** Navigate to the project root (if not already there)

**Step 3:** Start the frontend:

```bash
npm run client
```

**Expected Output:**
```
Compiled successfully!

You can now view ecommerce-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Step 4:** The React app will automatically open in your browser at `http://localhost:3000`

---

## ✅ Verification Steps

### Check Backend is Running:
1. Open browser and go to: `http://localhost:5000/api/products`
2. You should see a JSON response (empty array `[]` if no products yet)

### Check Frontend is Running:
1. Open browser and go to: `http://localhost:3000`
2. You should see the e-commerce homepage

### Test API Connection:
1. Open browser console (F12)
2. Check Network tab for API calls
3. All API calls should go to `http://localhost:5000/api/*`

---

## 🛠️ Troubleshooting

### Backend Issues:

**Problem:** MongoDB connection error
- **Solution:** Check your `.env` file has correct `MONGO_URI`
- **Solution:** Verify MongoDB Atlas network access allows your IP

**Problem:** Port 5000 already in use
- **Solution:** Change `PORT` in `.env` file to another port (e.g., 5001)
- **Solution:** Or stop the process using port 5000

**Problem:** Module not found errors
- **Solution:** Run `npm install` in the root directory

### Frontend Issues:

**Problem:** Port 3000 already in use
- **Solution:** React will automatically ask to use port 3001
- **Solution:** Or manually set port: `set PORT=3001 && npm run client`

**Problem:** Cannot connect to backend
- **Solution:** Make sure backend is running on port 5000
- **Solution:** Check `frontend/package.json` has `"proxy": "http://localhost:5000"`

**Problem:** Module not found errors
- **Solution:** Run `cd frontend && npm install`

---

## 📝 Quick Commands Reference

```bash
# Install all dependencies
npm run install:all

# Run both backend and frontend together
npm run dev:all

# Run backend only (production)
npm start

# Run backend only (development with auto-reload)
npm run dev

# Run frontend only
npm run client
```

---

## 🎯 Next Steps After Running

1. **Register a new user** at `/register`
2. **Login** with your credentials
3. **Browse products** at `/products`
4. **Add items to cart** and test the shopping flow
5. **Create orders** and view order history

---

## 📌 Important Notes

- **Backend must be running** before frontend can make API calls
- **Keep both terminals open** when running separately
- **MongoDB Atlas** must be accessible (check network settings)
- **First run** may take longer as dependencies are installed

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the terminal output for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas cluster is running
4. Check that required ports (5000, 3000) are not blocked

