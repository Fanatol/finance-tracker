// Фильтр по типу: income (доходы), expense (расходы), all (все)
export function filterByType(transactions, type) {
    if (type == 'all') {
        return transactions;
    }
    if (type == 'income') {
        return transactions.filter(item => item.type === 'income');
    }
    if (type == 'expense') {
        return transactions.filter(item => item.type === 'expense');
    }
}

// Фильтр по категории (продукты, транспорт, доход и т.д.)
export function filterByCategory(transactions, category) {
    if (category == 'all') {
        return transactions;
    } else {
        return transactions.filter(item => item.category === category);
    }
}

// Фильтр по произвольному диапазону дат
export function filterByDateRange(transactions, startDate, endDate) {
    return transactions.filter(item => item.date >= startDate && item.date <= endDate);
}

// Фильтр по пресетам: день, неделя, месяц или все транзакции
export function filterByDatePreset(transactions, preset) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (preset === 'all') {
        return transactions;
    }
    
    if (preset === 'day') {
        return transactions.filter(item => item.date === todayStr);
    }
    
    if (preset === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];
        return transactions.filter(item => item.date >= weekAgoStr);
    }
    
    if (preset === 'month') {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        const monthAgoStr = monthAgo.toISOString().split('T')[0];
        return transactions.filter(item => item.date >= monthAgoStr);
    }
}