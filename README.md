
# Personal Expense Tracker

# Overview

The Personal Expense Tracker is a web application built
using JavaScript, HTML, and CSS. It allows users to record
their daily expenses, organize spending by category, and
view a summary of their financial activities.

The application supports adding and deleting expenses,
filtering transactions, calculating totals and averages,
and visualizing spending using a doughnut chart.
Expense records are saved in the browser using localStorage.

My purpose for creating this software is to strengthen my
understanding of JavaScript programming concepts and
explore how they can be applied to practical problems.
I wanted to improve my ability to work with ES6 array
methods, recursion, exception handling, DOM manipulation,
and external JavaScript libraries.

[Software Demo Video](https://youtu.be/WdreS2hYFjg)

# Development Environment

I developed this application using the following tools:

- Visual Studio Code for writing and organizing code.
- Google Chrome for running and testing the application.
- Chrome Developer Tools for debugging.
- Git and GitHub for version control and project hosting.
- Chart.js for visualizing expense data.

The main programming language is JavaScript (ES6+).
HTML5 provides the structure of the application, while
CSS3 handles styling and responsive layouts.

The application uses vanilla JavaScript without a frontend
framework. Browser localStorage is used for data persistence.

# Features

- Add new expenses with descriptions, amounts, categories,
  and dates.
- View total expenses, expense count, and average spending.
- Filter expenses by category.
- Delete individual expenses.
- Clear all saved expenses.
- View a doughnut chart of spending by category.
- Save and retrieve expenses using localStorage.
- Validate inputs and handle errors.

# JavaScript Concepts Demonstrated

## ES6 Array Methods

The application uses map(), filter(), reduce(),
some(), sort(), and forEach() to process expense records.

## Recursion

The calculateNestedTotal() function recursively calculates
the total amount of expenses in a nested category structure.

## Exception Handling

The validateExpense() function throws errors for invalid
expense data. These errors are handled using try...catch.

## External JavaScript Library

Chart.js is used to display spending information in a
doughnut chart.

## DOM Manipulation

JavaScript dynamically creates and updates expense elements
on the webpage.

# Running the Application

1. Clone or download the GitHub repository.
2. Open the project folder in Visual Studio Code.
3. Open index.html using a browser or a local development
   server such as VS Code Live Server.
4. Enter an expense description, amount, category, and date.
5. Click "Add Expense" to save the record.
6. View expense totals, charts, and transaction history.

An internet connection is required to load Chart.js from
the CDN.

# Useful Websites

* [MDN JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [MDN Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
* [MDN Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)
* [MDN Error Handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
* [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
* [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

# Future Work

- Add expense editing functionality.
- Implement monthly spending reports.
- Add budgeting limits for different categories.
- Support exporting expenses to CSV files.
- Add more advanced spending analytics.
