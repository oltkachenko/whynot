export const cashInCommissionFeeMock = { 
    percents: 0.03, 
    max: { 
        amount: 5, 
        currency: 'EUR' 
    } 
}

export const cashOutLegalCommissionFeeMock = { 
    percents: 0.3, 
    min: { 
        amount: 0.5, 
        currency: 'EUR' 
    } 
};
export const cashOutNaturalCommissionFeeMock = { 
    percents: 0.3, 
    week_limit: { 
        amount: 1000, 
        currency: 'EUR' 
    } 
};