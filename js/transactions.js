import { generateId } from './utils.js';

// Массив для хранения всех транзакций в памяти
let transactions = []

// Демо-данные для первого запуска (5 примеров)
const demoTransactions = [
    {
        id: generateId(),
        type: "expense",
        amount: 500,
        category: "продукты",
        date: "2026-04-14",
        description: "хлеб и молоко"
    },
    {
        id: generateId(),
        type: "expense",
        amount: 1200,
        category: "транспорт",
        date: "2026-04-13",
        description: "проездной на неделю"
    },
    {
        id: generateId(),
        type: "income",
        amount: 50000,
        category: "зарплата",
        date: "2026-04-10",
        description: "зп на работе"
    },
    {
        id: generateId(),
        type: "expense",
        amount: 3000,
        category: "развлечения",
        date: "2026-04-12",
        description: "кино с друзьями"
    },
    {
        id: generateId(),
        type: "income",
        amount: 5000,
        category: "подарок",
        date: "2026-04-11",
        description: "день рождения"
    }
];

// Загрузка данных из localStorage
export function loadFromLocalStorage(){
    const savedData = localStorage.getItem('finance_transactions');
    if (savedData) {
        transactions = JSON.parse(savedData);
    } else {
        transactions = [...demoTransactions];
        saveToLocalStorage();
    }
}

// Сохранение данных в localStorage
export function saveToLocalStorage(){
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
}

// Возвращает массив всех транзакций
export function getTransactions(){
    return transactions;
}

// Добавление новой транзакции
export function addTransaction(transactionData){
    let newTransaction = {
        id: generateId(),
        type: transactionData.type,
        amount: transactionData.amount,
        category: transactionData.category,
        date: transactionData.date,
        description: transactionData.description
    }

    transactions.push(newTransaction);
    saveToLocalStorage();
}

// Удаление транзакции по id
export function deleteTransaction(id){
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage();
}

// Редактирование транзакции по id
export function editTransaction(id, updatedData) {
    transactions = transactions.map(transaction => {
        if (transaction.id === id) {
            return {
                id: transaction.id,
                type: updatedData.type !== undefined ? updatedData.type : transaction.type,
                amount: updatedData.amount !== undefined ? updatedData.amount : transaction.amount,
                category: updatedData.category !== undefined ? updatedData.category : transaction.category,
                date: updatedData.date !== undefined ? updatedData.date : transaction.date,
                description: updatedData.description !== undefined ? updatedData.description : transaction.description
            };
        } else {
            return transaction;
        }
    });
    
    saveToLocalStorage();
}

// Сумма всех транзакций по типу (доход или расход)
export function getTotalByType(type) {
    const filteredTransactions = transactions.filter(t => t.type === type);
    const total = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    return total;
}

// Общий баланс (доходы - расходы)
export function getBalance(){
    return getTotalByType('income') - getTotalByType('expense');
}