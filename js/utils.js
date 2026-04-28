// Генерирует уникальный ID для транзакции
export function generateId() {
    return Date.now() + '_' + Math.floor(Math.random() * 10000000000);
}

// Преобразует дату из YYYY-MM-DD в DD.MM.YYYY
export function formatDate(dateString) {
    let date = dateString.split('-');
    return `${date[2]}.${date[1]}.${date[0]}`;
}

// Форматирует сумму: +1 500 ₽ для доходов, -500 ₽ для расходов
export function formatAmount(amount, type) {
    if (type == 'income'){
        return '+'+ amount.toLocaleString('ru-RU')+' ₽';
    }
    else{
        return '-'+ amount.toLocaleString('ru-RU')+' ₽';
    }
}

// Форматирует число с пробелами между разрядами
export function formatNumber(amount) {
    return amount.toLocaleString('ru-RU');
}