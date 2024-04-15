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

const addClassActiveForRadio = () => {
  radiosCurrencyBtn.forEach(item => {
    item.addEventListener('click', e => {
      removeClassActiveRadio();
      e.target.parentNode.classList.add('active');
    });
  });
};

const getActiveItemRadio = () => {
  for (let radio of radiosCurrencyBtn) {
    if (radio.checked) {
      return radio.value;
    }
  }
};

const removeClassActiveRadio = () => {
  currencyTypeRadio.forEach(item => {
    item.classList.remove('active');
  });
};

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
