/**
 * Format Uptime
 * @param {number} uptime Uptime in milliseconds
 * @returns {string} Formatted Uptime
 */
export const formatUptime = (uptime: number): string => {
    const pad = (s: number) => {
        return (s < 10 ? '0' : '') + s;
    };
    const hours = Math.floor(uptime / (60 * 60));
    const minutes = Math.floor(uptime % (60 * 60) / 60);
    const seconds = Math.floor(uptime % 60);
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
};