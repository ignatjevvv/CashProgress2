'use strict';

const btn = document.getElementById('button');
const radiosCurrencyBtn = document.querySelectorAll('input[type="radio"]');

const goalNameInput = document.getElementById('goal__name');
const goalAmountInput = document.getElementById('goal__amount');
const currencyTypeRadio = document.querySelectorAll('.goal__currency-option');

const goalData = [];
const currentGoal = {};

btn.addEventListener('click', () => {
  addNewGoal();
});

/// Added class "active" for label currenct type
const addClassActiveForRadio = () => {
  radiosCurrencyBtn.forEach(item => {
    item.addEventListener('click', e => {
      removeClassActiveRadio();
      e.target.parentNode.classList.add('active');
    });
  });
};

/// Get element who has active class
const getActiveItemRadio = () => {
  for (let radio of radiosCurrencyBtn) {
    if (radio.checked) {
      return radio.value;
    }
  }
};

/// Remove active class from buttons that are not selected
const removeClassActiveRadio = () => {
  currencyTypeRadio.forEach(item => {
    item.classList.remove('active');
  });
};

/// Get value from each item and add it in data array
const addNewGoal = () => {
  const goalObj = {
    name: goalNameInput.value,
    amount: goalAmountInput.value,
    currency: getActiveItemRadio(),
  };

  goalData.push(goalObj);
  console.log(goalData);
};

addClassActiveForRadio();
