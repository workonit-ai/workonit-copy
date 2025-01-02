// Helper function to get the next check date

exports.getNextCheckDate= (checkInterval) => {
    const now = new Date();
    const [hours, minutes] = checkInterval.split(':').map(Number);
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}