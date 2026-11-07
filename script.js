
"use strict";

// CSE 310 - JavaScript Module #1
// Personal Expense Tracker

// Store all expense records in this array.
let expenses = [];

// Store the Chart.js instance so it can be updated.
let expenseChart = null;

// Browser storage key.
const STORAGE_KEY = "cse310_personal_expenses";

// Supported categories.
const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Other",
];

// Get HTML elements.
const form = document.getElementById("expenseForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const expenseList = document.getElementById("expenseList");
const filterCategory = document.getElementById("filterCategory");
const formMessage = document.getElementById("formMessage");

// Format numbers as Nigerian Naira.
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

// Generate a unique ID for every expense.
function generateId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

// Validate expense information.
// This demonstrates THROWING JavaScript exceptions.
function validateExpense(description, amount, category, date) {
  if (!description || description.trim().length < 2) {
    throw new Error(
      "Description must contain at least two characters."
    );
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      "Expense amount must be greater than zero."
    );
  }

  if (!CATEGORIES.includes(category)) {
    throw new Error("Please select a valid category.");
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Please provide a valid date.");
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getFullYear() !== Number(date.slice(0, 4)) ||
    parsedDate.getMonth() + 1 !== Number(date.slice(5, 7)) ||
    parsedDate.getDate() !== Number(date.slice(8, 10))
  ) {
    throw new Error("The selected date does not exist.");
  }
}

// Display a message to the user.
function showMessage(message, type = "success") {
  formMessage.textContent = message;
  formMessage.className = `message ${type}`;
}

// Save expenses to localStorage.
function saveExpenses() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(expenses)
    );
  } catch (error) {
    console.error("Storage error:", error);
    showMessage("Unable to save expenses.", "error");
  }
}

// Load existing expenses from localStorage.
function loadExpenses() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      expenses = [];
      return;
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      throw new Error("Stored expenses must be an array.");
    }

    expenses = parsedData.filter((expense) => {
      return (
        expense &&
        typeof expense.id === "string" &&
        typeof expense.description === "string" &&
        Number.isFinite(expense.amount) &&
        expense.amount > 0 &&
        CATEGORIES.includes(expense.category) &&
        typeof expense.date === "string"
      );
    });
  } catch (error) {
    console.error("Failed to load expenses:", error);
    expenses = [];
    showMessage("Could not load saved data.", "error");
  }
}

// Add an expense to the application.
function addExpense(description, amount, category, date) {
  // Validation can throw an exception.
  validateExpense(description, amount, category, date);

  const expense = {
    id: generateId(),
    description: description.trim(),
    amount,
    category,
    date,
  };

  expenses.push(expense);

  saveExpenses();
  renderDashboard();

  return expense;
}

// Remove an expense using the ES6 filter() method.
function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);

  saveExpenses();
  renderDashboard();

  showMessage("Expense deleted successfully.");
}

// Calculate total expenses using reduce().
function calculateTotal(expenseArray) {
  return expenseArray.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);
}

// Calculate average expense.
function calculateAverage(expenseArray) {
  if (expenseArray.length === 0) {
    return 0;
  }

  return calculateTotal(expenseArray) / expenseArray.length;
}

// Group expenses by category using reduce().
function groupExpensesByCategory(expenseArray) {
  return expenseArray.reduce((groups, expense) => {
    if (!groups[expense.category]) {
      groups[expense.category] = [];
    }

    groups[expense.category].push(expense);

    return groups;
  }, {});
}

// RECURSION EXAMPLE
// Recursively calculate the total of a nested category tree.
//
// Each node may contain its own expenses and child nodes.
// The function calls itself for every child category.
function calculateNestedTotal(node) {
  const ownTotal = calculateTotal(node.expenses || []);

  const childrenTotal = (node.children || []).reduce(
    (total, child) => total + calculateNestedTotal(child),
    0
  );

  return ownTotal + childrenTotal;
}

// Build a category tree for the recursion example.
function buildCategoryTree(expenseArray) {
  const grouped = groupExpensesByCategory(expenseArray);

  return {
    name: "All Expenses",
    expenses: [],
    children: Object.entries(grouped).map(
      ([category, categoryExpenses]) => ({
        name: category,
        expenses: categoryExpenses,
        children: [],
      })
    ),
  };
}

// Get expenses matching the selected category.
function getFilteredExpenses() {
  const selectedCategory = filterCategory.value;

  if (selectedCategory === "All") {
    return [...expenses];
  }

  return expenses.filter(
    (expense) => expense.category === selectedCategory
  );
}

// Update the summary cards.
function renderSummary() {
  const categoryTree = buildCategoryTree(expenses);

  // The dashboard total uses our recursive function.
  const total = calculateNestedTotal(categoryTree);
  const average = calculateAverage(expenses);

  document.getElementById("totalExpenses").textContent =
    formatCurrency(total);

  document.getElementById("expenseCount").textContent =
    expenses.length;

  document.getElementById("averageExpense").textContent =
    formatCurrency(average);
}

// Create an HTML expense item dynamically.
function createExpenseElement(expense) {
  const item = document.createElement("article");
  item.className = "expense-item";

  const details = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = expense.description;

  const metadata = document.createElement("p");
  metadata.textContent =
    `${expense.category} • ${expense.date}`;

  details.append(title, metadata);

  const actions = document.createElement("div");
  actions.className = "expense-actions";

  const amount = document.createElement("strong");
  amount.textContent = formatCurrency(expense.amount);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute(
    "aria-label",
    `Delete ${expense.description}`
  );

  deleteButton.addEventListener("click", () => {
    deleteExpense(expense.id);
  });

  actions.append(amount, deleteButton);
  item.append(details, actions);

  return item;
}

// Display expense records on the screen.
function renderExpenseList() {
  expenseList.replaceChildren();

  const filteredExpenses = getFilteredExpenses();

  // ES6 sort() creates a newest-first expense list.
  filteredExpenses.sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  if (filteredExpenses.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No expenses found.";
    expenseList.appendChild(empty);
    return;
  }

  // ES6 forEach() processes each expense.
  filteredExpenses.forEach((expense) => {
    expenseList.appendChild(createExpenseElement(expense));
  });
}

// Display category totals.
function renderCategoryTotals() {
  const container = document.getElementById("categoryTotals");
  container.replaceChildren();

  const grouped = groupExpensesByCategory(expenses);

  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    container.textContent = "No category data available.";
    return;
  }

  categories.forEach((category) => {
    const row = document.createElement("div");
    row.className = "category-row";

    const name = document.createElement("span");
    name.textContent = category;

    const amount = document.createElement("strong");
    amount.textContent = formatCurrency(
      calculateTotal(grouped[category])
    );

    row.append(name, amount);
    container.appendChild(row);
  });
}

// Display a doughnut chart using the external Chart.js library.
function renderChart() {
  const canvas = document.getElementById("expenseChart");

  if (expenseChart) {
    expenseChart.destroy();
    expenseChart = null;
  }

  if (typeof Chart === "undefined") {
    console.warn("Chart.js could not be loaded.");
    return;
  }

  const grouped = groupExpensesByCategory(expenses);
  const labels = Object.keys(grouped);

  const values = labels.map((category) => {
    return calculateTotal(grouped[category]);
  });

  if (labels.length === 0) {
    return;
  }

  expenseChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          label: "Expenses",
          data: values,
          backgroundColor: [
            "#2563eb",
            "#10b981",
            "#f59e0b",
            "#8b5cf6",
            "#ef4444",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// Update all dashboard sections.
function renderDashboard() {
  renderSummary();
  renderExpenseList();
  renderCategoryTotals();
  renderChart();
}

// Handle form submission.
// This demonstrates CATCHING JavaScript exceptions.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const description = descriptionInput.value;
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    addExpense(description, amount, category, date);

    form.reset();
    setTodayAsDefault();

    showMessage("Expense added successfully!");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

// Update list when the category filter changes.
filterCategory.addEventListener("change", () => {
  renderExpenseList();
});

// Clear all saved expenses.
document.getElementById("clearAllBtn").addEventListener(
  "click",
  () => {
    // some() demonstrates another ES6 array method.
    const hasExpenses = expenses.some(
      (expense) => expense.amount > 0
    );

    if (!hasExpenses) {
      showMessage("There are no expenses to clear.", "error");
      return;
    }

    const confirmed = confirm(
      "Are you sure you want to delete all expenses?"
    );

    if (confirmed) {
      expenses = [];
      saveExpenses();
      renderDashboard();
      showMessage("All expenses have been cleared.");
    }
  }
);

// Set today's date as the default.
function setTodayAsDefault() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  dateInput.value = `${year}-${month}-${day}`;
}

// Start the application.
function initializeApp() {
  loadExpenses();
  setTodayAsDefault();
  renderDashboard();

  console.log("Personal Expense Tracker initialized.");
  console.log("Loaded expenses:", expenses.length);
}

initializeApp();
