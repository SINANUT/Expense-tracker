# Expense Tracker

A simple, elegant expense tracking web application built with vanilla JavaScript, HTML, and CSS. Track your daily expenses by category with beautiful analytics and charts.

## Features

- **Add Expenses**: Record expenses with category, amount, description, and date
- **Edit & Delete**: Modify or remove expenses as needed
- **Category Management**: Organize expenses into categories (Fuel, Food, Travel, Shopping, Bills, Entertainment, Other)
- **Expenses Table**: View all expenses in a sortable table format
- **Category Filtering**: Filter expenses by category
- **Analytics Dashboard**: 
  - This Month Summary: Total expenses and average daily spending
  - Week-wise Breakdown
  - Visual Charts:
    - Pie Chart: Expenses by category (this month)
    - Bar Chart: Week-wise spending comparison
    - Line Chart: Daily spending trend (this month)
- **Local Storage**: All data is stored in your browser's localStorage (no backend required)

## Setup

1. Clone or download this repository
2. Open `index.html` in a web browser
3. Start tracking your expenses!

No build process or server required - just open the HTML file in any modern web browser.

## Usage

### Adding an Expense

1. Select a category from the dropdown
2. Enter the amount spent
3. Add a description (optional but recommended)
4. Select the date (defaults to today)
5. Click "Add Expense"

### Editing an Expense

1. Click the "Edit" button next to any expense in the table
2. The form will be populated with the expense details
3. Make your changes
4. Click "Update Expense" or "Cancel" to discard changes

### Deleting an Expense

1. Click the "Delete" button next to any expense
2. Confirm the deletion in the popup dialog

### Filtering Expenses

- Use the "Filter by Category" dropdown above the expenses table to view expenses from a specific category
- Select "All Categories" to view all expenses

### Sorting Expenses

- Click on any column header (Date, Category, Description, Amount) to sort the table
- Click again to reverse the sort order
- The arrow indicator (↑ ↓) shows the current sort direction

## Categories

- **Fuel**: Gas, petrol, diesel, etc.
- **Food**: Restaurants, groceries, snacks, etc.
- **Travel**: Flights, hotels, taxis, etc.
- **Shopping**: Clothes, electronics, etc.
- **Bills**: Utilities, subscriptions, etc.
- **Entertainment**: Movies, games, hobbies, etc.
- **Other**: Miscellaneous expenses

## Analytics

The analytics dashboard provides:

- **This Month Total**: Sum of all expenses in the current month
- **Average Daily**: Average spending per day in the current month
- **Total Expenses**: Sum of all expenses across all time
- **Charts**: Visual representations of your spending patterns

## Data Storage

All expenses are stored in your browser's localStorage. This means:
- Data persists across browser sessions
- Data is stored locally on your device
- No internet connection required after initial page load
- Data is private to your browser

**Note**: Clearing your browser's cache/localStorage will delete all expenses. Consider exporting your data regularly if needed.

## Browser Compatibility

This application works in all modern browsers that support:
- ES6 JavaScript features
- LocalStorage API
- HTML5 date input
- CSS Grid and Flexbox

Tested and works in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Technologies Used

- **HTML5**: Structure
- **CSS3**: Styling with modern features (Grid, Flexbox, CSS Variables)
- **Vanilla JavaScript (ES6+)**: Application logic
- **Chart.js**: Beautiful, responsive charts
- **LocalStorage API**: Data persistence

## License

Free to use and modify for personal or commercial purposes.
