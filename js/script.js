'use strict';

const btn = document.getElementById('button');
const windowStart = document.querySelector('.goal__container');
const goalFormStart = document.getElementById('form');
const radiosCurrencyBtn = document.querySelectorAll('input[type="radio"]');
const goalNameInput = document.getElementById('goal__name');
const goalAmountInput = document.getElementById('goal__amount');
const currencyTypeRadio = document.querySelectorAll('.goal__currency-option');
const goalListContainer = document.getElementById('goal-lists');

const withdrawBtn = document.getElementById('withdraw-btn');
const depositBtn = document.getElementById('deposit-btn');

const goalData = [];
const currentGoal = {};
const currencyList = {
  USD: '$',
  EUR: '€',
  UAH: '₴',
  BIT: 'B',
};

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
  windowStart.classList.toggle('hide');

  const goalObj = {
    id: `${goalNameInput.value.toLowerCase().split(' ').join('-')}-${+new Date()}`,
    name: goalNameInput.value,
    amount: goalAmountInput.value,
    currency: getActiveItemRadio(),
    accumulation: 0,
    history: {},
  };

  goalData.push(goalObj);
  renderListGoal();
  console.log(goalData);
};

/// Clear input fields from values
const clearInputs = () => {
  goalNameInput.value = '';
  goalAmountInput.value = '';
  removeClassActiveRadio();
};

goalFormStart.addEventListener('submit', e => {
  e.preventDefault();

  addNewGoal();
  clearInputs();
});

addClassActiveForRadio();

const renderListGoal = () => {
  goalData.forEach(({ id, name, amount, currency, accumulation }) => {
    goalListContainer.innerHTML += `
    <div class="goal__task" id="${id}">
    <h1 class="title">${name}</h1>
    <div class="goal__accumulate">
      <button id="withdraw-btn" onclick="withdraw(this)" class="btn small-btn">
        <i class="ri-corner-left-up-line"></i>
      </button>
      <input
        class="goal__amount"
        type="number"
        id="amount"
        placeholder="0"
        value="0"
      />
      <button id="deposit-btn" onclick="deposit(this)" class="btn small-btn">
        <i class="ri-corner-right-down-line"></i>
      </button>
    </div>

    <div class="goal__progress">
      <progress
        class="goal__progressbar"
        max="100"
        value="0"
      ></progress>

      <div class="goal__wrapper">
        <span id="goal-current-span">${accumulation}${currencyList[currency]}</span>
        <span id="goal-finish-span">${amount}${currencyList[currency]}</span>
      </div>
    </div>

    <div class="goal__options">
      <button class="btn small-btn" id="remove">
        <i class="ri-delete-bin-line"></i>
      </button>
      <button class="btn small-btn" id="history">
        <i class="ri-list-view"></i>
      </button>
      <button class="btn small-btn" id="edit">
        <i class="ri-edit-line"></i>
      </button>
    </div>
    </div>
  `;
  });
};

const deposit = buttonEl => {
  console.log(buttonEl.parentElement.parentElement.id);
};

const withdraw = buttonEl => {
  console.log(buttonEl.parentElement.parentElement.id);
};

// 62000 / 70000 * 100;
