import { expect } from 'chai';
import CommissionCalculator from '../CommissionCalculator.js';

const inputFile = './input.json';

describe('CommissionCalculator', function() {
    let calculator;

    beforeEach(async function() {
        calculator = new CommissionCalculator(inputFile);

        await calculator.init();
    });

    it('should calculate cashIn commission', function() {
        const amount = 200.00;
        const commission = calculator.calculateCashInCommission(amount);
        expect(commission).to.equal(calculator.cashInCommissionFee.percents * amount / 100);
    });

    it('should calculate cashOut commission for Legal Persons', function() {
        const amount = 300.00;
        const commission = calculator.calculateLegalCashOutCommission(amount);
        expect(commission).to.equal(calculator.cashOutLegalCommissionFee.percents * amount / 100);
    });

    it('should calculate cashOut commission for Natural Persons', function() {
        const operation1 = { date: '2016-01-05', user_id: 1, operation: { amount: 30000 } };
        const operation2 = { date: '2016-01-05', user_id: 1, operation: { amount: 1000.00 } };

        const commission1 = calculator.calculateNaturalCashOutCommission(operation1);
        const commission2 = calculator.calculateNaturalCashOutCommission(operation2);
        expect(commission1).to.be.closeTo(87.00, 2);
        expect(commission2).to.be.closeTo(3.00, 2);
    });

    it('should calculate commission fees for all operations', function() {
        const consoleSpy = console.log = () => {};
        calculator.calculateCommissionFees();
    });
});