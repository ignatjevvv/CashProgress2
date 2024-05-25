'use strict';

const btn = document.getElementById('button');
const windowStart = document.querySelector('.goal__container');
const goalFormStart = document.getElementById('form');
const radiosCurrencyBtn = document.querySelectorAll('input[type="radio"]');
const goalNameInput = document.getElementById('goal__name');
const goalAmountInput = document.getElementById('goal__amount');
const currencyTypeRadio = document.querySelectorAll('.goal__currency-option');
const goalListContainer = document.getElementById('container-goal');
const goalList = document.getElementById('goal-lists'); 
const goalAmountInputItem = document.getElementById('amount');
const dialogWindows = document.getElementById('dialog');

const withdrawBtn = document.getElementById('withdraw-btn');
const depositBtn = document.getElementById('deposit-btn');

const progressBar = document.getElementById('goal-progressbar');

const goalData = [
  {
    id: '3000-1716649489315',
    name: 'MacBook Air M2',
    amount: '1200',
    currency: 'USD',
    accumulation: 600,
    percentPointToFinish: 50,
    history: {},
  },
  {
    id: '3000-1716649489317',
    name: 'iPhone 14 Pro',
    amount: '900',
    currency: 'USD',
    accumulation: 450,
    percentPointToFinish: 50,
    history: {},
  },
  {
    id: '3000-1716649489317',
    name: 'Tesla Model X',
    amount: '45000',
    currency: 'USD',
    accumulation: 15000,
    percentPointToFinish: 50,
    history: {},
  },
  {
    id: '3000-1716649489315',
    name: 'MacBook Air M2',
    amount: '1200',
    currency: 'USD',
    accumulation: 600,
    percentPointToFinish: 50,
    history: {},
  },
  {
    id: '3000-1716649489317',
    name: 'iPhone 14 Pro',
    amount: '900',
    currency: 'USD',
    accumulation: 450,
    percentPointToFinish: 50,
    history: {},
  },
  {
    id: '3000-1716649489317',
    name: 'Tesla Model X',
    amount: '45000',
    currency: 'USD',
    accumulation: 15000,
    percentPointToFinish: 50,
    history: {},
  },
];

const currentGoal = {};
const currencyList = {
  USD: '$',
  EUR: '€',
  UAH: '₴',
  BTC: 'B',
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
  goalListContainer.classList.remove('hide');

  const goalObj = {
    id: `${goalNameInput.value.toLowerCase().split(' ').join('-')}-${+new Date()}`,
    name: goalNameInput.value,
    amount: goalAmountInput.value,
    currency: getActiveItemRadio(),
    accumulation: 0,
    percentPointToFinish: 0,
    history: {},
  };

  goalData.push(goalObj);
  renderListGoal();
  console.log(goalData);
  console.log(progressBar);
};

/// Clear input fields from values
const clearInputs = () => {
  goalNameInput.value = '';
  goalAmountInput.value = '';
  removeClassActiveRadio();
};

goalFormStart.addEventListener('submit', e => {
  // e.preventDefault();
  addNewGoal();
  clearInputs();
});

addClassActiveForRadio();

const renderListGoal = () => {
  goalList.innerHTML = '';
  // goalListContainer.innerHTML = `
  //     <button class="btn large-btn" onclick="newgoal()" id="new-goal-item" type="button">
  //         New goal
  //     </button>`;
  goalData.forEach(
    ({ id, name, amount, currency, accumulation, percentPointToFinish }) => {
      goalList.innerHTML += `
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
        id="goal-progressbar"
        max="100"
        value="${percentPointToFinish}"
      ></progress>

      <div class="goal__wrapper">
        <span id="goal-current-span">${accumulation}${currencyList[currency]}</span>
        <span id="goal-finish-span">${amount}${currencyList[currency]}</span>
      </div>
    </div>

    <div class="goal__options">
      <button class="btn small-btn" id="remove" onclick="dialogWindow(this)">
        <i class="ri-delete-bin-line"></i>
      </button>
      <button class="btn small-btn" id="history">
        <i class="ri-list-view"></i>
      </button>
      <button class="btn small-btn" id="edit">
        <i class="ri-edit-line"></i>
      </button>
    </div>

    <div class="goal__dialog hide">
      <p class="goal__dialog-message">
        Do you really wont to remove your progress ?
      </p>
      <div class="goal__dialog-buttons">
        <button class="btn" id="remove-goal" onclick="remove(this)">
          Remove
        </button>
        <button class="btn" id="discard-change" onclick="dialogWindow(this)">
          Discard
        </button>
      </div>
    </div>
    </div>
  `;
    },
  );
};

const accumulateDeposit = (searchId, idBtn) => {
  const totalItem = goalData.find(item => {
    if (item.id === searchId) {
      return item;
    }
  });

  const sum = document
    .getElementById(searchId)
    .getElementsByTagName('input')[0].value;

  if (idBtn === 'withdraw-btn') {
    if (totalItem.accumulation < sum) {
      console.log(`Withdrawals add to your savings limit!`);
      return;
    }
    totalItem.accumulation -= +sum;
  } else {
    totalItem.accumulation += +sum;
  }

  totalItem.percentPointToFinish = (
    (totalItem.accumulation / totalItem.amount) *
    100
  ).toFixed(2);

  renderListGoal();
  console.log(goalData);
};

const dialogWindow = buttonEl => {
  const parentDiv = buttonEl.parentElement.parentElement;
  const dialogWindow = parentDiv.querySelector('.goal__dialog');

  if (!dialogWindow) {
    parentDiv.classList.add('hide');
    return;
  }

  dialogWindow.classList.remove('hide');
};

const removeGoal = goalID => {
  const indexItem = goalData.findIndex(item => item.id === goalID);
  goalData.splice(indexItem, 1);
  console.log(goalData);
  renderListGoal();
};

const newgoal = () => {
  dialogWindows.showModal();
};

const deposit = buttonEl => {
  accumulateDeposit(buttonEl.parentElement.parentElement.id, buttonEl.id);
};

const withdraw = buttonEl => {
  accumulateDeposit(buttonEl.parentElement.parentElement.id, buttonEl.id);
};

const remove = buttonEl => {
  removeGoal(buttonEl.parentElement.parentElement.id);
};

renderListGoal();
if (!goalData.length) {
  dialogWindows.showModal();
} else {
  renderListGoal();
  goalListContainer.classList.toggle('hide');
}
