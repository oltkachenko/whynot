/**
     * @description Fetch commission data from a specified URL.
     * @param {string} url - The URL to fetch data from.
     * @returns {Promise<object>} - A promise that resolves with the fetched JSON data.
     * @throws {Error} - If fetching data fails or if the response is not OK.
     */

const getCommissionData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}`);
        throw error;
    }
};

/**
     * @description Fetch commission fee for cash-in operations.
     * @returns {Promise<object>} - A promise that resolves with the fetched commission fee data.
     * @throws {Error} - If fetching the commission fee fails.
     */
export const getCashInCommissionFee = async () => {
    try {
        const cashInCommissionFee = await getCommissionData('https://developers.paysera.com/tasks/api/cash-in');

        return cashInCommissionFee;
    } catch (error) {
        console.error('Failed to fetch CashInCommissionFee');
        throw error;
    }
};

/**
 * @description Fetch commission fee for cash-out operations by natural persons.
 * @returns {Promise<object>} - A promise that resolves with the fetched commission fee data.
 * @throws {Error} - If fetching the commission fee fails.
 */
export const getCashOutNaturalCommissionFee = async () => {
    try {
        const cashOutNaturalCommissionFee = await getCommissionData('https://developers.paysera.com/tasks/api/cash-out-natural');

        return cashOutNaturalCommissionFee;
    } catch (error) {
        console.error('Failed to fetch cashOutNaturalCommissionFee');
        throw error;
    }
};

/**
 * @description Fetch commission fee for cash-out operations by legal persons.
 * @returns {Promise<object>} - A promise that resolves with the fetched commission fee data.
 * @throws {Error} - If fetching the commission fee fails.
 */
export const getCashOutLegalCommissionFee = async () => {
    try {
        const cashOutLegalCommissionFee = await getCommissionData('https://developers.paysera.com/tasks/api/cash-out-juridical');

        return cashOutLegalCommissionFee;
    } catch (error) {
        console.error('Failed to fetch cashOutLegalCommissionFee');
        throw error;
    }
};