import { loadFromLocalStorage, addTransaction, getTransactions, deleteTransaction, editTransaction, getBalance } from './transactions.js';
import { renderBalance, renderCategorySummary, renderFullHistory } from './render.js';
import { loadTheme, setTheme, saveTheme } from './theme.js';
import { filterByType, filterByCategory, filterByDatePreset, filterByDateRange } from './filters.js';

// Списки категорий
const expenseCategories = ['продукты', 'транспорт', 'развлечения', 'дом', 'здоровье', 'образование', 'прочее'];
const incomeCategories = ['зарплата', 'подарок', 'премия', 'дивиденды', 'прочее'];

let transactionToDelete = null;

// Главная функция инициализации
function init() {
    loadFromLocalStorage();
    loadTheme();
    renderBalance();
    renderCategorySummary('expense');
    renderCategorySummary('income');
    updateCategorySelect('expense');

    // Дата по умолчанию
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
        dateInput.value = today;
    }

    // Смена типа в форме
    const typeSelect = document.getElementById('transaction-type');
    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            updateCategorySelect(e.target.value);
        });
    }

    // Переключение расходы/доходы
    const expenseTab = document.getElementById('expense-tab');
    const incomeTab = document.getElementById('income-tab');
    const expenseContainer = document.getElementById('expense-categories-container');
    const incomeContainer = document.getElementById('income-categories-container');

    if (expenseTab && incomeTab && expenseContainer && incomeContainer) {
        expenseTab.addEventListener('click', () => {
            expenseContainer.classList.remove('hidden');
            incomeContainer.classList.add('hidden');
        });
    
        incomeTab.addEventListener('click', () => {
            incomeContainer.classList.remove('hidden');
            expenseContainer.classList.add('hidden');
        });
    }

    // Открытие истории
    const historyLink = document.getElementById('history-link');
    const historyModal = document.getElementById('history-modal');
    const overlay = document.getElementById('overlay');

    if (historyLink && historyModal && overlay) {
        historyLink.addEventListener('click', () => {
            historyModal.classList.remove('hidden');
            overlay.classList.add('visible');
            renderFullHistory(getTransactions());
        });
    }

    // Закрытие истории
    const closeHistoryBtn = document.getElementById('close-history-modal');
    if (closeHistoryBtn && historyModal && overlay) {
        closeHistoryBtn.addEventListener('click', () => {
            historyModal.classList.add('hidden');
            overlay.classList.remove('visible');
        });
    }

    // Добавление транзакции
    const addTransactionButton = document.getElementById('add-transaction-btn');
    if (addTransactionButton) {
        addTransactionButton.addEventListener('click', () => {
            let type = document.getElementById('transaction-type').value;
            let amount = Number(document.getElementById('transaction-amount').value);
            let category = document.getElementById('transaction-category').value;
            let date = document.getElementById('transaction-date').value;
            let description = document.getElementById('transaction-description').value;

            if (!amount || amount <= 0) {
                alert('Введите сумму больше 0');
                return;
            }
            if (!date) {
                alert('Выберите дату');
                return;
            }

            let transactionData = { type, amount, category, date, description };
            addTransaction(transactionData);

            document.getElementById('transaction-amount').value = '';
            document.getElementById('transaction-description').value = '';

            renderBalance();
            renderCategorySummary('expense');
            renderCategorySummary('income');
        });
    }

    // Открытие меню
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sideMenu = document.getElementById('side-menu');
    if (menuToggleBtn && sideMenu) {
        menuToggleBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            overlay.classList.add('visible');
            menuToggleBtn.style.display = 'none';
        });
    }

    // Закрытие меню
    const closeMenuBtn = document.getElementById('close-menu-btn');
    if (closeMenuBtn && sideMenu) {
        closeMenuBtn.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            overlay.classList.remove('visible');
            menuToggleBtn.style.display = 'block';
        });
    }

    // Применение фильтров
    const applyFilters = document.getElementById('apply-filters-btn');
    if (applyFilters) {
        applyFilters.addEventListener('click', () => {
            const filterType = document.getElementById('filter-type').value;
            const filterCategory = document.getElementById('filter-category').value;
            const filterDatePreset = document.getElementById('filter-date-preset').value;
            
            let filtered = getTransactions();
            filtered = filterByType(filtered, filterType);
            filtered = filterByCategory(filtered, filterCategory);

            if (filterDatePreset === 'custom') {
                const startDate = document.getElementById('start-date').value;
                const endDate = document.getElementById('end-date').value;
                if (startDate && endDate) {
                    filtered = filterByDateRange(filtered, startDate, endDate);
                }
            } else {
                filtered = filterByDatePreset(filtered, filterDatePreset);
            }
            
            renderFullHistory(filtered);
        });
    }

    // Сброс фильтров
    const clearFilters = document.getElementById('clear-filters-btn');
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-category').value = 'all';
            document.getElementById('filter-date-preset').value = 'all';
            document.getElementById('custom-date-range').classList.add('hidden');
            renderFullHistory(getTransactions());
        });
    }

    updateFilterCategories();

    // Показ скрытие блока произвольной даты
    const datePreset = document.getElementById('filter-date-preset');
    if (datePreset) {
        datePreset.addEventListener('change', (e) => {
            const customRange = document.getElementById('custom-date-range');
            if (customRange) {
                if (e.target.value === 'custom') {
                    customRange.classList.remove('hidden');
                } else {
                    customRange.classList.add('hidden');
                }
            }
        });
    }

    // Подтверждение удаления
    const transactionDeleteBtn = document.getElementById('confirm-delete-btn');
    if (transactionDeleteBtn) {
        transactionDeleteBtn.addEventListener('click', () => {
            if (window.transactionToDelete) {
                deleteTransaction(window.transactionToDelete);
                window.transactionToDelete = null;
                renderBalance();
                renderCategorySummary('expense');
                renderCategorySummary('income');
                renderFullHistory(getTransactions());

                const deleteModal = document.getElementById('delete-modal');
                deleteModal.classList.add('hidden');
            }
        });
    }

    // Отмена удаления
    const transactionDeleteCloseBtn = document.getElementById('cancel-delete-btn');
    if (transactionDeleteCloseBtn) {
        transactionDeleteCloseBtn.addEventListener('click', () => {
            const deleteModal = document.getElementById('delete-modal');
            deleteModal.classList.add('hidden');
            window.transactionToDelete = null;
        });
    }

    // Экспорт в JSON
    const jsonExport = document.getElementById('export-json-btn');
    if (jsonExport) {
        jsonExport.addEventListener('click', () => {
            const data = JSON.stringify(getTransactions(), null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Сброс к демо-данным
    const resetDemoBtn = document.getElementById('reset-demo-btn');
    if (resetDemoBtn) {
        resetDemoBtn.addEventListener('click', () => {
            if (confirm('Сбросить все данные?')) {
                localStorage.removeItem('finance_transactions');
                loadFromLocalStorage();
                renderBalance();
                renderCategorySummary('expense');
                renderCategorySummary('income');
                renderFullHistory(getTransactions());
            }
        });
    }

    // Сохранение редактирования
    const saveEdit = document.getElementById('save-edit-btn');
    if (saveEdit) {
        saveEdit.addEventListener('click', () => {
            if (window.transactionToEdit) {
                const updatedData = {
                    type: document.getElementById('edit-type').value,
                    amount: Number(document.getElementById('edit-amount').value),
                    category: document.getElementById('edit-category').value,
                    date: document.getElementById('edit-date').value,
                    description: document.getElementById('edit-description').value
                };
                
                editTransaction(window.transactionToEdit, updatedData);
                
                renderBalance();
                renderCategorySummary('expense');
                renderCategorySummary('income');
                renderFullHistory(getTransactions());
                window.transactionToEdit = null;

                const editModal = document.getElementById('edit-modal');
                if (editModal) editModal.classList.add('hidden');
            }
        });
    }

    // Отмена редактирования
    const transactionEditCloseBtn = document.getElementById('cancel-edit-btn');
    if (transactionEditCloseBtn) {
        transactionEditCloseBtn.addEventListener('click', () => {
            const editModal = document.getElementById('edit-modal');
            editModal.classList.add('hidden');
            window.transactionToEdit = null;
        });
    }

    // Переключение тем
    const lightTheme = document.getElementById('theme-light-btn');
    if (lightTheme) {
        lightTheme.addEventListener('click', () => {
            setTheme('theme-light');
            saveTheme('theme-light');
        });
    }

    const darkTheme = document.getElementById('theme-dark-btn');
    if (darkTheme) {
        darkTheme.addEventListener('click', () => {
            setTheme('theme-dark');
            saveTheme('theme-dark');
        });
    }

    const oldmoneyTheme = document.getElementById('theme-oldmoney-btn');
    if (oldmoneyTheme) {
        oldmoneyTheme.addEventListener('click', () => {
            setTheme('theme-oldmoney');
            saveTheme('theme-oldmoney');
        });
    }
}

init();

// Заполнение категорий в форме добавления
function updateCategorySelect(type) {
    const transactionsCategory = document.getElementById('transaction-category');
    transactionsCategory.innerHTML = '';
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        transactionsCategory.appendChild(option);
    });
}

// Заполнение категорий в фильтре
function updateFilterCategories() {
    let filterAllCategory = document.getElementById('filter-category');
    filterAllCategory.innerHTML = '';
    const allCategories = [...expenseCategories, ...incomeCategories];

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Все категории';
    filterAllCategory.appendChild(allOption);
    
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterAllCategory.appendChild(option);
    });
}

// Заполнение категорий в форме редактирования
window.updateEditCategorySelect = function(type, selectedCategory) {
    const editCategory = document.getElementById('edit-category');
    editCategory.innerHTML = '';
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        editCategory.appendChild(option);
    });
    if (selectedCategory) {
        editCategory.value = selectedCategory;
    }
};