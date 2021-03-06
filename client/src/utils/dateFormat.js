export const dateFormat = addedAt => new Date(addedAt).toLocaleDateString();

export const countDaysSinceToday = addedAt => Math.ceil((new Date() - new Date(addedAt)) / (1000 * 60 * 60 * 24));
