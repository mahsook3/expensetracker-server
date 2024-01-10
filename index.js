require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Replace with your MongoDB Atlas connection string
const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const ExpenseSchema = new mongoose.Schema({
  day: String,
  month: String,
  title: String,
  type: String,
  budget: String
});

const Expenses = mongoose.model('expenses', ExpenseSchema);

app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expenses.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expenses.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const newExpense = new Expenses(req.body);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    const updatedExpense = await Expenses.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    const deletedExpense = await Expenses.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(deletedExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
