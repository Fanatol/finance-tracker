import { getTransactions, getBalance, getTotalByType } from './transactions.js';
import { formatNumber, formatAmount, formatDate } from './utils.js';
import { filterByType, filterByCategory, filterByDatePreset } from './filters.js';

// Отображает общий баланс, доходы и расходы
export function renderBalance() {
    const totalBalanceEl = document.getElementById('total-balance');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');

    const balance = getBalance();
    const income = getTotalByType('income');
    const expense = getTotalByType('expense');

    totalBalanceEl.textContent = formatNumber(balance) + ' ₽';
    totalIncomeEl.textContent = formatNumber(income) + ' ₽';
    totalExpenseEl.textContent = formatNumber(expense) + ' ₽';
}

// Отображает список категорий с суммами (расходы или доходы)
export function renderCategorySummary(type) {
    const filteredTransactions = filterByType(getTransactions(), type);
    const categorySums = {};
    for (let i = 0; i < filteredTransactions.length; i++) {
        const transaction = filteredTransactions[i];
        const category = transaction.category;
        const amount = transaction.amount;

        if (categorySums[category] === undefined) {
            categorySums[category] = 0;
        }
        categorySums[category] = categorySums[category] + amount;
    }
    
    let container;
    if (type === 'expense') {
        container = document.getElementById('expense-categories-container');
    } else {
        container = document.getElementById('income-categories-container');
    }
    
    container.innerHTML = '';
    
    for (let category in categorySums) {
        const sum = categorySums[category];
        const element = document.createElement('div');
        element.textContent = category + ': ' + formatNumber(sum) + ' ₽';
        container.appendChild(element);
    }
}

// Отображает полный список транзакций с кнопками удаления и редактирования
export function renderFullHistory(transactions) {
    let container = document.getElementById('history-table-container');
    container.innerHTML = '';

    if (!transactions || transactions.length === 0) {
        container.textContent = "Нет транзакций"
    }

    else {
        for (let i = 0; i < transactions.length; i ++) {
            const transaction = transactions[i];
            const element = document.createElement('div');
            element.textContent = formatDate(transaction.date) + ' | ' + transaction.category + ' | ' + formatAmount(transaction.amount, transaction.type) + ' | ';
            if (transaction.type === 'expense') {
                element.style.color = 'red';
            } else {
                element.style.color = 'green';
            }

            const deleteBtn = document.createElement('button');
            const EditBtn = document.createElement('button');
            deleteBtn.textContent = 'Удалить';
            deleteBtn.setAttribute('data-id', transaction.id);
            EditBtn.textContent = 'Редактировать';
            EditBtn.setAttribute('data-id', transaction.id);

            element.appendChild(deleteBtn);
            element.appendChild(EditBtn);
            container.appendChild(element);

            deleteBtn.addEventListener('click', () => {
                const deleteModal = document.getElementById('delete-modal');
                const overlay = document.getElementById('overlay');
                if (deleteModal) {
                    deleteModal.classList.remove('hidden');
                }
                if (overlay) {
                    overlay.classList.add('visible');
                }
                window.transactionToDelete = transaction.id;
            });

            EditBtn.addEventListener('click', () => {
                const editModal = document.getElementById('edit-modal');
                const overlay = document.getElementById('overlay');
                if (editModal) {
                    document.getElementById('edit-type').value = transaction.type;
                    document.getElementById('edit-amount').value = transaction.amount;
                    document.getElementById('edit-date').value = transaction.date;
                    document.getElementById('edit-description').value = transaction.description;
                    editModal.classList.remove('hidden');
                }
                if (overlay) {
                    overlay.classList.add('visible');
                }
                window.updateEditCategorySelect(transaction.type, transaction.category);
                window.transactionToEdit = transaction.id;
            });

        }
    }
}