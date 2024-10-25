const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/BudgetRoutes");

dotenv.config();
connectDB();

const app = express();
// app.use(cors());
app.use(cors({
    origin: 'https://expense-tracker-p3.vercel.app',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    credentials: true  
}));

app.use(express.json());

app.options('*', cors());
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
