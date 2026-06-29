// Demo account details
const demoAccount = {
  email: "demo@fintrack.com",
  password: "password123",
};

// Storage key for accounts in localStorage
const accountStorage = "fintrackAccounts";

// Selecting DOM Elements
const loginForm = document.querySelector("form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const errorBox = document.querySelector("#errorBox");
const errorMessage = errorBox.querySelector("p");
const submitButton = document.querySelector("#submitButton");
const signupField = document.querySelector(".signup-field");
const tabButtons = document.querySelectorAll("[data-tab]");
const successModal = document.querySelector("#successModal");
const successOkButton = document.querySelector("#successOkButton");

let currentMode = "login";

// Toggle between Login and Signup modes
function setMode(mode) {
  currentMode = mode;
  hideError();
  
  // Clear input fields
  emailInput.value = "";
  passwordInput.value = "";
  confirmPasswordInput.value = "";

  // Update active tab styling
  tabButtons.forEach(function (button) {
    if (button.dataset.tab === mode) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  // Show/Hide fields based on mode
  if (mode === "signup") {
    signupField.hidden = false;
    submitButton.textContent = "Create Account";
  } else {
    signupField.hidden = true;
    submitButton.textContent = "Log In";
  }
}

// Attach event listeners to tab buttons
tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setMode(button.dataset.tab);
  });
});

// Hide error message when user starts typing
[emailInput, passwordInput, confirmPasswordInput].forEach(function (input) {
  input.addEventListener("input", hideError);
});

// Handle form submission
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  hideError();

  const enteredEmail = emailInput.value.trim().toLowerCase();
  const enteredPassword = passwordInput.value;
  const confirmedPassword = confirmPasswordInput.value;

  // LOGIN MODE
  if (currentMode === "login") {
    if (checkLogin(enteredEmail, enteredPassword)) {
      localStorage.setItem("fintrackLoggedInUser", enteredEmail);
      openWebsite(enteredEmail);
    } else {
      showError("Please check your email or password. It is wrong.");
      passwordInput.value = "";
      passwordInput.focus();
    }
  }
  // SIGNUP MODE
  else {
    if (enteredEmail === "" || enteredPassword === "") {
      showError("Please fill in all fields.");
    } else if (enteredPassword !== confirmedPassword) {
      showError("Passwords do not match.");
    } else if (accountExists(enteredEmail)) {
      showError("An account with this email already exists.");
    } else {
      saveAccount(enteredEmail, enteredPassword);
      successModal.hidden = false;
    }
  }
});

// Handle OK button in success modal
successOkButton.addEventListener("click", function () {
  successModal.hidden = true;
  setMode("login");
  emailInput.focus();
});

// Helper: Show error box
function showError(message) {
  errorMessage.textContent = message;
  errorBox.hidden = false;
}

// Helper: Hide error box
function hideError() {
  errorBox.hidden = true;
}

// Helper: Save account to localStorage
function saveAccount(email, password) {
  const accounts = getSavedAccounts();
  accounts.push({ email: email, password: password });
  localStorage.setItem(accountStorage, JSON.stringify(accounts));
}

// Helper: Get all saved accounts from localStorage
function getSavedAccounts() {
  const savedAccounts = localStorage.getItem(accountStorage);
  if (!savedAccounts) {
    return [];
  }
  return JSON.parse(savedAccounts);
}

// Helper: Check if account exists
function accountExists(email) {
  if (email === demoAccount.email) {
    return true;
  }
  const accounts = getSavedAccounts();
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email === email) {
      return true;
    }
  }
  return false;
}

// Helper: Validate login credentials
function checkLogin(email, password) {
  if (email === demoAccount.email && password === demoAccount.password) {
    return true;
  }
  const accounts = getSavedAccounts();
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email === email && accounts[i].password === password) {
      return true;
    }
  }
  return false;
}

// Helper: Simple HTML injection to escape tags
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Redirect to successful login landing page
function openWebsite(userEmail) {
  const safeEmail = escapeHtml(userEmail);
  const userKey = "transactions_" + userEmail;
  const settingsKey = "settings_" + userEmail;

  // Load transactions and settings from storage
  let transactions = JSON.parse(localStorage.getItem(userKey)) || [];
  let appSettings = JSON.parse(localStorage.getItem(settingsKey)) || { currency: "â‚¹" };
  if (!appSettings.displayName) {
    appSettings.displayName = safeEmail.split('@')[0];
  }
  if (appSettings.expenseLimit === undefined) {
    appSettings.expenseLimit = 1000;
  }
  if (appSettings.darkMode === undefined) {
    appSettings.darkMode = false;
  }

  // Apply initial theme theme
  if (appSettings.darkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  let activeFilterType = "all"; // 'all', 'income', 'expense'

  // Hide the Login container and display the Dashboard container
  const authView = document.querySelector("#authView");
  const dashboardLayout = document.querySelector("#dashboardLayout");
  
  authView.style.display = "none";
  dashboardLayout.style.display = "flex";

  // Set the dynamic user greeting
  document.querySelector("#usernameDisplay").textContent = appSettings.displayName;

  // Get DOM element references
  const tabDashboardBtn = document.querySelector("#tabDashboardBtn");
  const tabSettingsBtn = document.querySelector("#tabSettingsBtn");
  const dashboardView = document.querySelector("#dashboardView");
  const settingsView = document.querySelector("#settingsView");
  const openAddModalBtn = document.querySelector("#openAddModalBtn");
  const addTransactionModal = document.querySelector("#addTransactionModal");
  const modalCloseBtn = document.querySelector("#modalCloseBtn");
  const modalCancelBtn = document.querySelector("#modalCancelBtn");
  const addTransactionForm = document.querySelector("#addTransactionForm");
  const logoutBtn = document.querySelector("#logoutBtn");
  const tabBadge = document.querySelector("#tabBadge");

  // Filters inputs
  const searchDescription = document.querySelector("#searchDescription");
  const filterCategory = document.querySelector("#filterCategory");
  const filterAllBtn = document.querySelector("#filterAllBtn");
  const filterIncomeBtn = document.querySelector("#filterIncomeBtn");
  const filterExpenseBtn = document.querySelector("#filterExpenseBtn");
  const exportCsvBtn = document.querySelector("#exportCsvBtn");

  // Settings inputs
  const settingsDisplayName = document.querySelector("#settingsDisplayName");
  const btnChangeDisplayName = document.querySelector("#btnChangeDisplayName");
  const settingCurrency = document.querySelector("#settingCurrency");
  const settingsExpenseLimit = document.querySelector("#settingsExpenseLimit");
  const settingsDarkModeToggle = document.querySelector("#settingsDarkModeToggle");
  const settingsOldPassword = document.querySelector("#settingsOldPassword");
  const settingsNewPassword = document.querySelector("#settingsNewPassword");
  const btnChangePassword = document.querySelector("#btnChangePassword");
  const btnResetData = document.querySelector("#btnResetData");

  // Set default settings values
  settingsDisplayName.value = appSettings.displayName;
  settingCurrency.value = appSettings.currency;
  settingsExpenseLimit.value = appSettings.expenseLimit;
  settingsDarkModeToggle.checked = appSettings.darkMode;

  // Toggle between Dashboard and Settings views
  tabDashboardBtn.addEventListener("click", function () {
    tabDashboardBtn.classList.add("active");
    tabSettingsBtn.classList.remove("active");
    dashboardView.style.display = "flex";
    settingsView.style.display = "none";
    renderChart(); // redraw chart
  });

  tabSettingsBtn.addEventListener("click", function () {
    tabSettingsBtn.classList.add("active");
    tabDashboardBtn.classList.remove("active");
    dashboardView.style.display = "none";
    settingsView.style.display = "block";
  });

  // Open/Close modal listeners
  openAddModalBtn.addEventListener("click", function () {
    addTransactionForm.reset();
    // Default date input to today
    document.querySelector("#transDate").value = new Date().toISOString().split('T')[0];
    addTransactionModal.classList.add("open");
  });

  function closeModal() {
    addTransactionModal.classList.remove("open");
  }
  modalCloseBtn.addEventListener("click", closeModal);
  modalCancelBtn.addEventListener("click", closeModal);

  // Close modal when clicking on dark backdrop
  addTransactionModal.addEventListener("click", function (e) {
    if (e.target === addTransactionModal) {
      closeModal();
    }
  });

  // Handle transaction form submission
  addTransactionForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newTrans = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      description: document.querySelector("#transDescription").value.trim(),
      amount: parseFloat(document.querySelector("#transAmount").value),
      type: document.querySelector("#transType").value,
      category: document.querySelector("#transCategory").value,
      date: document.querySelector("#transDate").value,
    };

    transactions.push(newTrans);
    saveTransactions();
    renderAll();
    closeModal();
  });

  // Delete transaction handler
  function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    renderAll();
  }

  // Save current transactions list
  function saveTransactions() {
    localStorage.setItem(userKey, JSON.stringify(transactions));
  }

  // Formatting date helpers
  function formatDateShort(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  // Format to standard long format
  function formatDateLong(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  // Calculating and rendering the 4 metrics summary cards
  function renderMetrics() {
    let incomeSum = 0;
    let expenseSum = 0;

    transactions.forEach(t => {
      if (t.type === "income") {
        incomeSum += Number(t.amount);
      } else {
        expenseSum += Number(t.amount);
      }
    });

    const balanceSum = incomeSum - expenseSum;

    document.querySelector("#metricBalance").textContent = `${appSettings.currency}${balanceSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.querySelector("#metricIncome").textContent = `${appSettings.currency}${incomeSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.querySelector("#metricExpense").textContent = `${appSettings.currency}${expenseSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.querySelector("#metricTransactions").textContent = transactions.length;
    tabBadge.textContent = transactions.length;

    // Check Monthly Expense Limit Alert Banner
    const expenseAlertBanner = document.querySelector("#expenseAlertBanner");
    const alertLimitValue = document.querySelector("#alertLimitValue");
    if (expenseAlertBanner && alertLimitValue) {
      if (appSettings.expenseLimit > 0 && expenseSum > appSettings.expenseLimit) {
        alertLimitValue.textContent = `${appSettings.currency}${appSettings.expenseLimit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        expenseAlertBanner.style.display = "flex";
      } else {
        expenseAlertBanner.style.display = "none";
      }
    }
  }

  // Render Spending Category Breakdown Progress bars
  function renderCategoryBreakdown() {
    const breakdownList = document.querySelector("#categoryBreakdownList");
    if (!breakdownList) return;

    const expenses = transactions.filter(t => t.type === "expense");
    if (expenses.length === 0) {
      breakdownList.innerHTML = `
        <div class="empty-category-msg">No spending recorded yet to generate breakdowns.</div>
      `;
      return;
    }

    const categoryTotals = {};
    let totalExpenseSum = 0;
    expenses.forEach(t => {
      const amt = Number(t.amount);
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
      totalExpenseSum += amt;
    });

    const sortedCategories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

    let breakdownHTML = `<div class="category-breakdown-list">`;
    sortedCategories.forEach(cat => {
      const amt = categoryTotals[cat];
      const percentage = totalExpenseSum > 0 ? Math.round((cat === "Salary" ? 0 : amt / totalExpenseSum) * 100) : 0;
      
      let barColor = "var(--primary)";
      if (cat === "Food") barColor = "#f59e0b";
      if (cat === "Rent") barColor = "#8b5cf6";
      if (cat === "Utilities") barColor = "#06b6d4";
      if (cat === "Entertainment") barColor = "#ec4899";
      if (cat === "Bills") barColor = "#f43f5e";
      if (cat === "Other") barColor = "#64748b";
      
      breakdownHTML += `
        <div class="category-item">
          <div class="category-item-header">
            <span>${cat} (${percentage}%)</span>
            <span class="amount">${appSettings.currency}${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${barColor};"></div>
          </div>
        </div>
      `;
    });
    breakdownHTML += `</div>`;
    breakdownList.innerHTML = breakdownHTML;
  }

  // Render SVG Chart for trends
  function renderChart() {
    const chartContainer = document.querySelector("#chartContainer");
    if (!chartContainer) return;

    // Group transactions by date
    const dailyData = {};
    transactions.forEach(t => {
      const dateStr = formatDateShort(t.date);
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        dailyData[dateStr].income += Number(t.amount);
      } else {
        dailyData[dateStr].expense += Number(t.amount);
      }
    });

    const dates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b)).slice(-7);

    if (dates.length === 0) {
      // Empty grid exactly like image
      const isDark = document.body.classList.contains("dark");
      const gridColor = isDark ? "#334155" : "#f1f5f9";
      const baselineColor = isDark ? "#475569" : "#cbd5e1";
      chartContainer.innerHTML = `
        <div style="position: relative; width: 100%; height: 260px;">
          <div style="display: flex; justify-content: center; gap: 16px; font-size: 11px; margin-bottom: 12px; color: #64748b; font-weight: 700;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 24px; height: 10px; background: #10b981; border-radius: 2px;"></span> Income
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 24px; height: 10px; background: #ef4444; border-radius: 2px;"></span> Expense
            </div>
          </div>
          <svg width="100%" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
            <line x1="45" y1="20" x2="500" y2="20" stroke="${gridColor}" stroke-width="1" />
            <line x1="45" y1="52" x2="500" y2="52" stroke="${gridColor}" stroke-width="1" />
            <line x1="45" y1="84" x2="500" y2="84" stroke="${gridColor}" stroke-width="1" />
            <line x1="45" y1="116" x2="500" y2="116" stroke="${gridColor}" stroke-width="1" />
            <line x1="45" y1="148" x2="500" y2="148" stroke="${gridColor}" stroke-width="1" />
            <line x1="45" y1="180" x2="500" y2="180" stroke="${baselineColor}" stroke-width="1.5" />
            <text x="5" y="24" fill="#94a3b8" font-size="10" font-weight="600">${appSettings.currency}1.00</text>
            <text x="5" y="56" fill="#94a3b8" font-size="10" font-weight="600">${appSettings.currency}0.80</text>
            <text x="5" y="88" fill="#94a3b8" font-size="10" font-weight="600">${appSettings.currency}0.60</text>
            <text x="5" y="120" fill="#94a3b8" font-size="10" font-weight="600">${appSettings.currency}0.40</text>
            <text x="5" y="152" fill="#94a3b8" font-size="10" font-weight="600">${appSettings.currency}0.20</text>
            <text x="5" y="184" fill="#94a3b8" font-size="10" font-weight="600">${appSettings.currency}0.00</text>
          </svg>
        </div>
      `;
      return;
    }

    let maxAmount = 0;
    dates.forEach(d => {
      maxAmount = Math.max(maxAmount, dailyData[d].income, dailyData[d].expense);
    });
    if (maxAmount === 0) maxAmount = 1;

    // Standard round-up scaling for clean y-axis labels
    const power = Math.pow(10, Math.floor(Math.log10(maxAmount)));
    const cleanStep = power > 0 ? (power / 2) : 1;
    const scaleMax = Math.ceil(maxAmount / (cleanStep || 1)) * (cleanStep || 1);

    const isDark = document.body.classList.contains("dark");
    const gridColor = isDark ? "#334155" : "#f1f5f9";
    const baselineColor = isDark ? "#475569" : "#cbd5e1";

    let gridHTML = "";
    const levels = 5;
    for (let i = 0; i <= levels; i++) {
      const y = 20 + i * 32;
      const val = (scaleMax - (i * (scaleMax / levels))).toFixed(0);
      gridHTML += `
        <line x1="45" y1="${y}" x2="480" y2="${y}" stroke="${i === levels ? baselineColor : gridColor}" stroke-width="${i === levels ? "1.5" : "1"}" />
        <text x="5" y="${y + 4}" fill="#94a3b8" font-size="9" font-weight="700">${appSettings.currency}${Number(val).toLocaleString('en-IN')}</text>
      `;
    }

    let barsHTML = "";
    const chartWidth = 435;
    const barGroupWidth = chartWidth / dates.length;
    const barWidth = Math.min(16, barGroupWidth * 0.3);

    dates.forEach((date, index) => {
      const groupCenterX = 45 + (index * barGroupWidth) + (barGroupWidth / 2);
      const incVal = dailyData[date].income;
      const expVal = dailyData[date].expense;
      
      const incHeight = (incVal / scaleMax) * 160;
      const expHeight = (expVal / scaleMax) * 160;
      
      const incY = 180 - incHeight;
      const expY = 180 - expHeight;

      // Income bar (green)
      barsHTML += `
        <rect x="${groupCenterX - barWidth - 2}" y="${incY}" width="${barWidth}" height="${incHeight}" fill="#10b981" rx="2" />
      `;
      // Expense bar (red)
      barsHTML += `
        <rect x="${groupCenterX + 2}" y="${expY}" width="${barWidth}" height="${expHeight}" fill="#ef4444" rx="2" />
      `;
      // Date label
      barsHTML += `
        <text x="${groupCenterX}" y="198" fill="#64748b" font-size="10" font-weight="700" text-anchor="middle">${date}</text>
      `;
    });

    chartContainer.innerHTML = `
      <div style="position: relative; width: 100%; height: 260px;">
        <div style="display: flex; justify-content: center; gap: 16px; font-size: 11px; margin-bottom: 12px; color: #64748b; font-weight: 700;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #10b981; border-radius: 3px;"></span> Income
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #ef4444; border-radius: 3px;"></span> Expense
          </div>
        </div>
        <svg width="100%" height="210" viewBox="0 0 500 210">
          ${gridHTML}
          ${barsHTML}
        </svg>
      </div>
    `;
  }

  // Render Table
  function renderTransactionsTable() {
    const tableBody = document.querySelector("#transactionsTableBody");
    const emptyState = document.querySelector("#tableEmptyState");
    if (!tableBody || !emptyState) return;

    const searchQuery = searchDescription.value.trim().toLowerCase();
    const selectedCat = filterCategory.value;
    
    const filtered = transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery);
      const matchesCategory = selectedCat === "All" || t.category === selectedCat;
      const matchesType = activeFilterType === "all" || t.type === activeFilterType;
      return matchesSearch && matchesCategory && matchesType;
    });

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
      tableBody.innerHTML = "";
      emptyState.style.display = "flex";
      return;
    }

    emptyState.style.display = "none";
    let tableHTML = "";
    filtered.forEach(t => {
      const amtClass = t.type === "income" ? "amount-income" : "amount-expense";
      const amtPrefix = t.type === "income" ? "+" : "-";
      const displayAmt = `${amtPrefix}${appSettings.currency}${Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      
      tableHTML += `
        <tr>
          <td>${formatDateLong(t.date)}</td>
          <td>${escapeHtml(t.description)}</td>
          <td>${t.category}</td>
          <td>
            <span style="
              display: inline-block; 
              padding: 2px 8px; 
              border-radius: 12px; 
              font-size: 11px; 
              font-weight: 700;
              text-transform: uppercase;
              background: ${t.type === "income" ? "#d1fae5" : "#fee2e2"};
              color: ${t.type === "income" ? "#065f46" : "#991b1b"};
            ">${t.type}</span>
          </td>
          <td class="${amtClass}">${displayAmt}</td>
          <td>
            <button class="btn-delete" data-id="${t.id}" title="Delete Transaction">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = tableHTML;

    // Attach delete listeners
    tableBody.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", function () {
        deleteTransaction(btn.dataset.id);
      });
    });
  }

  // Export to CSV
  function exportToCSV() {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    let csvContent = "Date,Description,Category,Type,Amount\n";
    transactions.forEach(t => {
      const desc = t.description.includes(",") ? `"${t.description.replace(/"/g, '""')}"` : t.description;
      csvContent += `${t.date},${desc},${t.category},${t.type},${t.amount}\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FinTrack_Export_${safeEmail.split('@')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Redraw all components
  function renderAll() {
    renderMetrics();
    renderChart();
    renderCategoryBreakdown();
    renderTransactionsTable();
  }

  // Search input listener
  searchDescription.addEventListener("input", renderTransactionsTable);
  
  // Category dropdown filter listener
  filterCategory.addEventListener("change", renderTransactionsTable);

  // Type filter button controls
  function setTypeFilter(type, activeBtn, otherBtn1, otherBtn2) {
    activeFilterType = type;
    activeBtn.classList.add("active");
    otherBtn1.classList.remove("active");
    otherBtn2.classList.remove("active");
    renderTransactionsTable();
  }

  filterAllBtn.addEventListener("click", function () {
    setTypeFilter("all", filterAllBtn, filterIncomeBtn, filterExpenseBtn);
  });
  filterIncomeBtn.addEventListener("click", function () {
    setTypeFilter("income", filterIncomeBtn, filterAllBtn, filterExpenseBtn);
  });
  filterExpenseBtn.addEventListener("click", function () {
    setTypeFilter("expense", filterExpenseBtn, filterAllBtn, filterIncomeBtn);
  });

  // Export CSV click
  exportCsvBtn.addEventListener("click", exportToCSV);

  // Settings display name change
  btnChangeDisplayName.addEventListener("click", function () {
    const newName = settingsDisplayName.value.trim();
    if (!newName) {
      alert("Display name cannot be empty.");
      return;
    }
    appSettings.displayName = newName;
    localStorage.setItem(settingsKey, JSON.stringify(appSettings));
    document.querySelector("#usernameDisplay").textContent = newName;
    alert("Display name updated successfully!");
  });

  // Settings monthly expense limit change
  settingsExpenseLimit.addEventListener("input", function () {
    const limit = parseFloat(settingsExpenseLimit.value) || 0;
    appSettings.expenseLimit = limit;
    localStorage.setItem(settingsKey, JSON.stringify(appSettings));
    renderMetrics();
  });

  // Settings dark mode toggle change
  settingsDarkModeToggle.addEventListener("change", function () {
    const isDark = settingsDarkModeToggle.checked;
    appSettings.darkMode = isDark;
    localStorage.setItem(settingsKey, JSON.stringify(appSettings));
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    renderChart();
  });

  // Settings base currency select change
  settingCurrency.addEventListener("change", function () {
    appSettings.currency = settingCurrency.value;
    localStorage.setItem(settingsKey, JSON.stringify(appSettings));
    renderAll();
  });

  // Settings clear transactions click
  btnResetData.addEventListener("click", function () {
    if (confirm("Are you sure you want to clear all transactions? This action is permanent!")) {
      transactions = [];
      saveTransactions();
      renderAll();
      alert("All transactions deleted successfully!");
    }
  });

  // Settings update password click
  btnChangePassword.addEventListener("click", function () {
    const oldPass = settingsOldPassword.value;
    const newPass = settingsNewPassword.value;

    if (!oldPass || !newPass) {
      alert("Please fill in both password fields.");
      return;
    }

    const accounts = getSavedAccounts();
    const userAcc = accounts.find(acc => acc.email === userEmail) || (userEmail === demoAccount.email ? demoAccount : null);

    if (userAcc) {
      if (userAcc.password === oldPass) {
        // Save new password
        if (userEmail === demoAccount.email) {
          // If demo account, let's override it in localStorage accounts list
          const existing = accounts.find(acc => acc.email === userEmail);
          if (existing) {
            existing.password = newPass;
          } else {
            accounts.push({ email: userEmail, password: newPass });
          }
        } else {
          userAcc.password = newPass;
        }
        
        // Save accounts back to localStorage
        localStorage.setItem(accountStorage, JSON.stringify(accounts));
        
        settingsOldPassword.value = "";
        settingsNewPassword.value = "";
        alert("Password updated successfully!");
      } else {
        alert("Incorrect current password.");
      }
    } else {
      alert("Error finding account details.");
    }
  });

  // Log Out button
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("fintrackLoggedInUser");
    document.body.classList.remove("dark");
    location.reload();
  });

  // Initial draw
  renderAll();
}

// Initial load check for persisted login session
const loggedInUser = localStorage.getItem("fintrackLoggedInUser");
if (loggedInUser) {
  openWebsite(loggedInUser);
} else {
  setMode("login");
}
