import fs from 'fs'
import moment from 'moment'
import { getCashInCommissionFee, getCashOutLegalCommissionFee, getCashOutNaturalCommissionFee } from './api/commissionData.js';

/**
     * @class CommissionCalculator
     * @description Commission calculator for different user types
     * @property {string} inputFile - Path to the input file containing operations data
     * @property {Array<object>} inputData - Users operation list
     * @property {object} cashInCommissionFee - Commission fee configuration for cash-in operations
     * @property {object} cashOutNaturalCommissionFee - Commission fee configuration for cash-out operations by natural persons
     * @property {object} cashOutLegalCommissionFee - Commission fee configuration for cash-out operations by legal persons
     * @property {object} naturalPersonsWeeklyLimit - Tracks weekly cash-out limits for natural persons
     */
class CommissionCalculator {
    constructor(inputFile) {
        this.inputFile = inputFile;
        this.inputData = [];

        this.cashInCommissionFee = {};
        this.cashOutNaturalCommissionFee = {};
        this.cashOutLegalCommissionFee = {};
        this.naturalPersonsWeeklyLimit = {};
    }

    /**
         * @description Initializes the commission calculator
         * * init operations list
         * * init commission fees
         * @returns {void}
         * @throws {Error} If there's an error fetching commission data or reading the input file
         */
    async init() {
        try {
            this.cashInCommissionFee = await getCashInCommissionFee();
            this.cashOutNaturalCommissionFee = await getCashOutNaturalCommissionFee()
            this.cashOutLegalCommissionFee = await getCashOutLegalCommissionFee();

            this.getInputData();
        } catch (error) {
            console.error('Error getting commission fees');
            throw error;
        }
    }

    /**
         * @description Read data from local file
         * @returns {Array<object>} Operation data
         * @throws {Error} If the input file is not valid
         */
    getInputData() {
        try {
            this.inputData = JSON.parse(fs.readFileSync(this.inputFile, 'utf8'));
        } catch (error) {
            console.error('Input file is not valid');
            throw error;
        }
    }

    /**
         * @description Used to calculate cash-in commission
         * @param {number} amount Operation ammount
         * @returns {number} Commission fee
         */
    calculateCashInCommission(amount) {
        let commissionFee = this.cashInCommissionFee.percents * amount / 100;

        if (commissionFee > this.cashInCommissionFee.max.amount) {
            commissionFee =  this.cashInCommissionFee.max.amount;
        }

        return commissionFee
    }

    /**
         * @description Used to calculate cash-out commission for Legal Person
         * @param {number} amount Operation ammount
         * @returns {number} Commission fee
         */
    calculateLegalCashOutCommission(amount) {
        let commissionFee = this.cashOutLegalCommissionFee.percents * amount / 100;

        if (commissionFee < this.cashOutLegalCommissionFee.min.amount) {
            commissionFee = this.cashOutLegalCommissionFee.min.amount;
        }

        return commissionFee;
    }

    /**
         * @description Used to calculate cash-out commission for Natural Person
         * @param {object} operation Operation object contains data
         * @returns {number} Commission fee
         */
    calculateNaturalCashOutCommission(operation) {
        const weekStartDate = moment(operation.date).startOf('isoWeek').format('YYYY-MM-DD');
        const key = `${operation.user_id}-${weekStartDate}`;
        const weeklyFreeCashOutLimit = this.cashOutNaturalCommissionFee.week_limit.amount;

        let commissionFee = 0;

        if (!this.naturalPersonsWeeklyLimit[key]) {
            this.naturalPersonsWeeklyLimit[key] = { week_limit: weeklyFreeCashOutLimit };
        }

        if (operation.operation.amount <= this.naturalPersonsWeeklyLimit[key].week_limit ) {
            commissionFee = 0

            this.naturalPersonsWeeklyLimit[key].week_limit -= operation.operation.amount;
        } else if (operation.operation.amount > this.naturalPersonsWeeklyLimit[key].week_limit ) {
            commissionFee = (operation.operation.amount - this.naturalPersonsWeeklyLimit[key].week_limit) * this.cashOutNaturalCommissionFee.percents / 100

            this.naturalPersonsWeeklyLimit[key].week_limit = 0;
        }

        return commissionFee;
    }

    /**
         * @description Output results to stdout
         * @returns {void}
         */
    calculateCommissionFees() {        
        this.inputData.map(operation => {
            let commision = 0;
        
            if (operation.type === 'cash_in') {
                commision = this.calculateCashInCommission(operation.operation.amount)
            }
        
            if (operation.type === 'cash_out' && operation.user_type === 'juridical') {
                commision = this.calculateLegalCashOutCommission(operation.operation.amount);
            }
        
            if (operation.type === 'cash_out' && operation.user_type === 'natural') {
                commision = this.calculateNaturalCashOutCommission(operation);
            }
            
            commision = Math.ceil(commision * 100) / 100;
            console.log(commision.toFixed(2));
        })
    }
}

export default CommissionCalculator;