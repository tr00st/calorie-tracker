export const caloriesForLogEntry = (logEntry: any) => {
    if (logEntry.calories_override) {
        return logEntry.calories_override;
    }
    else {
        return (logEntry.amount * logEntry.food_calories_p100) / 100;
    }
};
