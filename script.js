// Estado de la aplicación
let state = {
    monthlyIncome: 0,
    savingsPercentage: 0,
    expenses: []
};

// Elementos del DOM
const elements = {
    monthlyIncome: document.getElementById('monthlyIncome'),
    savingsPercentage: document.getElementById('savingsPercentage'),
    expenseForm: document.getElementById('expenseForm'),
    expenseDescription: document.getElementById('expenseDescription'),
    expenseAmount: document.getElementById('expenseAmount'),
    expensesList: document.getElementById('expensesList'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpenses: document.getElementById('totalExpenses'),
    availableBalance: document.getElementById('availableBalance'),
    savingsAmount: document.getElementById('savingsAmount'),
    remainingAfterSavings: document.getElementById('remainingAfterSavings')
};

// Formatear números como moneda
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Calcular y actualizar el resumen
const updateSummary = () => {
    const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const availableBalance = state.monthlyIncome - totalExpenses;
    const savingsAmount = (state.monthlyIncome * state.savingsPercentage) / 100;
    const remainingAfterSavings = availableBalance - savingsAmount;

    elements.totalIncome.textContent = formatCurrency(state.monthlyIncome);
    elements.totalExpenses.textContent = formatCurrency(totalExpenses);
    elements.availableBalance.textContent = formatCurrency(availableBalance);
    elements.savingsAmount.textContent = formatCurrency(savingsAmount);
    elements.remainingAfterSavings.textContent = formatCurrency(remainingAfterSavings);
};

// Renderizar lista de gastos
const renderExpenses = () => {
    elements.expensesList.innerHTML = state.expenses.map(expense => `
        <tr>
            <td>${expense.description}</td>
            <td class="text-end">${formatCurrency(expense.amount)}</td>
            <td class="text-end">
                <button 
                    class="btn btn-danger btn-sm btn-delete" 
                    onclick="deleteExpense('${expense.id}')"
                >
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
};

// Agregar un nuevo gasto
const addExpense = (description, amount) => {
    state.expenses.push({
        id: Date.now().toString(),
        description,
        amount: Number(amount)
    });
    renderExpenses();
    updateSummary();
};

// Eliminar un gasto
const deleteExpense = (id) => {
    state.expenses = state.expenses.filter(expense => expense.id !== id);
    renderExpenses();
    updateSummary();
};

// Event Listeners
elements.monthlyIncome.addEventListener('input', (e) => {
    state.monthlyIncome = Number(e.target.value) || 0;
    updateSummary();
});

elements.savingsPercentage.addEventListener('input', (e) => {
    state.savingsPercentage = Number(e.target.value) || 0;
    updateSummary();
});

elements.expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = elements.expenseDescription.value.trim();
    const amount = elements.expenseAmount.value;

    if (description && amount) {
        addExpense(description, amount);
        elements.expenseDescription.value = '';
        elements.expenseAmount.value = '';
    }
});

// Inicialización
updateSummary();