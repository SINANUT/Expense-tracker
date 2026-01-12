// Expense Tracker Application
class ExpenseTracker {
    constructor() {
        this.expenses = this.loadExpenses();
        this.currentEditId = null;
        this.sortConfig = { column: null, direction: 'asc' };
        this.charts = {};
        this.currentFilter = '';
        
        this.initializeForm();
        this.renderExpenses();
        this.updateAnalytics();
        this.setDefaultDate();
    }

    // Load expenses from localStorage
    loadExpenses() {
        const stored = localStorage.getItem('expenses');
        return stored ? JSON.parse(stored) : [];
    }

    // Save expenses to localStorage
    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    // Set default date to today
    setDefaultDate() {
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Initialize form handlers
    initializeForm() {
        const form = document.getElementById('expenseForm');
        const cancelBtn = document.getElementById('cancelBtn');
        const filterCategory = document.getElementById('filterCategory');

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        cancelBtn.addEventListener('click', () => this.cancelEdit());
        filterCategory.addEventListener('change', (e) => this.filterExpenses(e.target.value));

        // Prevent form submission on Enter key in text inputs
        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type !== 'submit') {
                e.preventDefault();
                if (form.checkValidity()) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();

        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        const expense = {
            id: this.currentEditId || Date.now(),
            category,
            amount,
            description,
            date
        };

        if (this.currentEditId) {
            // Update existing expense
            const index = this.expenses.findIndex(exp => exp.id === this.currentEditId);
            if (index !== -1) {
                this.expenses[index] = expense;
            }
            this.cancelEdit();
        } else {
            // Add new expense
            this.expenses.push(expense);
        }

        // Sort by date (newest first) after adding
        this.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        this.saveExpenses();
        this.renderExpenses();
        this.updateAnalytics();
        document.getElementById('expenseForm').reset();
        this.setDefaultDate();
    }

    // Cancel edit mode
    cancelEdit() {
        this.currentEditId = null;
        document.getElementById('expenseForm').reset();
        document.getElementById('cancelBtn').style.display = 'none';
        document.getElementById('submitBtn').textContent = 'Add Expense';
        this.setDefaultDate();
    }

    // Edit expense
    editExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (!expense) return;

        document.getElementById('category').value = expense.category;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description;
        document.getElementById('date').value = expense.date;

        this.currentEditId = id;
        document.getElementById('cancelBtn').style.display = 'inline-block';
        document.getElementById('submitBtn').textContent = 'Update Expense';
        document.getElementById('expenseForm').scrollIntoView({ behavior: 'smooth' });
    }

    // Delete expense
    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(exp => exp.id !== id);
            this.saveExpenses();
            this.renderExpenses();
            this.updateAnalytics();
        }
    }

    // Filter expenses by category
    filterExpenses(category) {
        this.currentFilter = category;
        this.renderExpenses();
    }

    // Sort expenses
    sortExpenses(column) {
        if (this.sortConfig.column === column) {
            this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortConfig.column = column;
            this.sortConfig.direction = 'asc';
        }

        this.expenses.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            if (column === 'date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (column === 'amount') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            } else {
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
            }

            if (aVal < bVal) return this.sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        this.renderExpenses();
    }

    // Render expenses table
    renderExpenses() {
        const tbody = document.getElementById('expensesTableBody');
        const noExpenses = document.getElementById('noExpenses');
        const table = document.getElementById('expensesTable');

        let filteredExpenses = this.currentFilter
            ? this.expenses.filter(exp => exp.category === this.currentFilter)
            : this.expenses;

        // Update sort indicators
        document.querySelectorAll('.sortable').forEach(th => {
            const col = th.getAttribute('data-sort');
            if (col === this.sortConfig.column) {
                th.textContent = th.textContent.replace(/\s↕|↕/g, '') + 
                    (this.sortConfig.direction === 'asc' ? ' ↑' : ' ↓');
            } else {
                th.textContent = th.textContent.replace(/\s[↕↑↓]/g, '') + ' ↕';
            }
        });

        if (filteredExpenses.length === 0) {
            tbody.innerHTML = '';
            noExpenses.style.display = 'block';
            table.style.display = 'none';
            return;
        }

        noExpenses.style.display = 'none';
        table.style.display = 'table';

        tbody.innerHTML = filteredExpenses.map(expense => {
            const date = new Date(expense.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `
                <tr>
                    <td>${date}</td>
                    <td><span class="category-badge category-${expense.category}">${expense.category}</span></td>
                    <td>${expense.description}</td>
                    <td>₹${expense.amount.toFixed(2)}</td>
                    <td class="actions">
                        <button class="btn-edit" onclick="expenseTracker.editExpense(${expense.id})">Edit</button>
                        <button class="btn-delete" onclick="expenseTracker.deleteExpense(${expense.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Add sort event listeners
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.getAttribute('data-sort');
                this.sortExpenses(column);
            });
        });
    }

    // Get expenses for current month
    getCurrentMonthExpenses() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        return this.expenses.filter(expense => {
            const expDate = new Date(expense.date);
            return expDate >= startOfMonth && expDate <= endOfMonth;
        });
    }

    // Get week-wise expenses
    getWeekWiseExpenses() {
        const weeks = [];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get first Monday of the month or start of month
        const firstDay = startOfMonth.getDay();
        const firstMonday = firstDay === 0 
            ? new Date(startOfMonth.getTime() + 1 * 24 * 60 * 60 * 1000)
            : firstDay === 1 
                ? startOfMonth
                : new Date(startOfMonth.getTime() + (8 - firstDay) * 24 * 60 * 60 * 1000);

        let currentWeekStart = firstMonday > startOfMonth ? startOfMonth : firstMonday;
        let weekNum = 1;

        while (currentWeekStart <= endOfMonth) {
            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weekEnd.setHours(23, 59, 59);

            if (weekEnd > endOfMonth) {
                weekEnd.setTime(endOfMonth.getTime());
            }

            const weekExpenses = this.expenses.filter(expense => {
                const expDate = new Date(expense.date);
                return expDate >= currentWeekStart && expDate <= weekEnd;
            });

            const weekTotal = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);

            weeks.push({
                week: weekNum,
                start: new Date(currentWeekStart),
                end: new Date(weekEnd),
                total: weekTotal,
                label: `Week ${weekNum}`
            });

            currentWeekStart = new Date(weekEnd);
            currentWeekStart.setDate(currentWeekStart.getDate() + 1);
            currentWeekStart.setHours(0, 0, 0, 0);
            weekNum++;
        }

        return weeks;
    }

    // Get daily expenses for current month
    getDailyExpenses() {
        const monthExpenses = this.getCurrentMonthExpenses();
        const dailyData = {};

        monthExpenses.forEach(expense => {
            const date = expense.date;
            if (!dailyData[date]) {
                dailyData[date] = 0;
            }
            dailyData[date] += expense.amount;
        });

        return Object.entries(dailyData)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Update analytics dashboard
    updateAnalytics() {
        const monthExpenses = this.getCurrentMonthExpenses();
        const totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysPassed = Math.min(now.getDate(), daysInMonth);
        const avgDaily = daysPassed > 0 ? monthTotal / daysPassed : 0;

        // Update summary cards
        document.getElementById('monthTotal').textContent = `₹${monthTotal.toFixed(2)}`;
        document.getElementById('avgDaily').textContent = `₹${avgDaily.toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = `₹${totalExpenses.toFixed(2)}`;

        // Update charts
        this.renderCategoryChart(monthExpenses);
        this.renderWeekChart();
        this.renderDailyChart();
    }

    // Render category pie chart
    renderCategoryChart(expenses) {
        const ctx = document.getElementById('categoryChart');
        const categoryTotals = {};

        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);

        const colors = {
            fuel: '#fbbf24',
            food: '#10b981',
            travel: '#3b82f6',
            shopping: '#ec4899',
            bills: '#6366f1',
            entertainment: '#f97316',
            other: '#6b7280'
        };

        const backgroundColors = categories.map(cat => colors[cat] || colors.other);

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        this.charts.category = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
                datasets: [{
                    data: amounts,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Render week-wise bar chart
    renderWeekChart() {
        const ctx = document.getElementById('weekChart');
        const weeks = this.getWeekWiseExpenses();

        const labels = weeks.map(w => w.label);
        const totals = weeks.map(w => w.total);

        if (this.charts.week) {
            this.charts.week.destroy();
        }

        this.charts.week = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Spending (₹)',
                    data: totals,
                    backgroundColor: '#4f46e5',
                    borderColor: '#4338ca',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Spending: ₹${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    // Render daily spending line chart
    renderDailyChart() {
        const ctx = document.getElementById('dailyChart');
        const dailyExpenses = this.getDailyExpenses();

        const labels = dailyExpenses.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const amounts = dailyExpenses.map(d => d.amount);

        if (this.charts.daily) {
            this.charts.daily.destroy();
        }

        this.charts.daily = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Spending (₹)',
                    data: amounts,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Spending: ₹${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize the application
let expenseTracker;
document.addEventListener('DOMContentLoaded', () => {
    expenseTracker = new ExpenseTracker();
});
