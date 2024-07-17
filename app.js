import CommissionCalculator from './CommissionCalculator.js';

// Get the input file path from command line arguments
const inputFile = process.argv[2];

// Create an instance of CommissionCalculator
const calculator = new CommissionCalculator(inputFile);

// Calculate and output commission fees
calculator.init().then(() => {
    calculator.calculateCommissionFees();
}).catch(error => {
    console.error('Failed to initialize and calculate commissions:', error.message);
});