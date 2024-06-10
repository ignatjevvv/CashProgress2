'use strict';

const btn = document.getElementById('button');
const discardBtn = document.getElementById('close-button');
const windowStart = document.querySelector('.goal__container');
const goalFormStart = document.getElementById('form');
const radiosCurrencyBtn = document.querySelectorAll('input[type="radio"]');
const goalNameInput = document.getElementById('goal__name');
const goalAmountInput = document.getElementById('goal__amount');
const goalInitialValue = document.getElementById('goal__initial');
const currencyTypeRadio = document.querySelectorAll('.goal__currency-option');
const goalListContainer = document.getElementById('container-goal');
const goalList = document.getElementById('goal-lists');
const goalAmountInputItem = document.getElementById('amount');
const dialogWindows = document.getElementById('dialog');
const historyList = document.getElementById('history-list');

const labelNumberGoals = document.getElementById('number-goals');
const labelRemainingTarget = document.getElementById('remaining-target');
const labelCompleateGoals = document.getElementById('compleate-goals');

const withdrawBtn = document.getElementById('withdraw-btn');
const depositBtn = document.getElementById('deposit-btn');

const progressBar = document.getElementById('goal-progressbar');

const goalData = JSON.parse(localStorage.getItem('data')) || [];

let currentGoal = {};
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

  const dataArrIndex = goalData.findIndex(item => item.id === currentGoal.id);
  let historyClone = JSON.parse(JSON.stringify(currentGoal.history || []));

  const goalObj = {
    id: `${goalNameInput.value.toLowerCase().split(' ').join('-')}-${+new Date()}`,
    name: goalNameInput.value,
    amount: goalAmountInput.value,
    currency: getActiveItemRadio(),
    accumulation: 0 || +goalInitialValue.value,
    compleateStatus: false,
    history: historyClone,
  };

  if (dataArrIndex === -1) {
    goalData.unshift(goalObj);
  } else {
    goalData[dataArrIndex] = goalObj;
  }

  saveDataLocalStorage();
  percentageToFinish(goalObj);
  renderListGoal();
  console.log(goalData);
  console.log(progressBar);
};

/// Clear input fields from values
const reset = () => {
  dialogWindows.querySelector('.title').innerText = 'New goal';
  btn.innerText = 'Create goal';
  goalFormStart.classList.remove('hide');

  goalNameInput.value = '';
  goalAmountInput.value = '';
  goalInitialValue.value = '';
  removeClassActiveRadio();
  currentGoal = {};

  historyList.innerHTML = '';
  historyList.classList.add('hide');
};

/// CREATE NEW GOAL WHEN CLICK BUTTON
goalFormStart.addEventListener('submit', () => {
  addNewGoal();
  reset();
});

addClassActiveForRadio();

const renderListGoal = () => {
  updateDashboardGoalsInfo(goalData);
  goalList.innerHTML = '';
  goalData.forEach(
    ({
      id,
      name,
      amount,
      currency,
      accumulation,
      percentPointToFinish,
      compleateStatus,
    }) => {
      goalList.innerHTML += `
    <div class="goal__task" id="${id}">
    <h1 class="title">${name}</h1>
    <div class="goal__status ${!compleateStatus ? 'hide' : 'show'}"">
      <i class="ri-checkbox-circle-line"></i>
    </div>
    <div class="goal__accumulate ${compleateStatus ? 'hide' : 'show'}">
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
      <button class="btn small-btn" id="history" onclick="history(this)">
        <i class="ri-list-view"></i>
      </button>
      <button class="btn small-btn" id="edit" onclick="edite(this)">
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

const updateDashboardGoalsInfo = goalData => {
  const totalNumberGoals = goalData.length;
  const compleateCount = goalData.filter(item => item.compleateStatus).length;

  labelNumberGoals.innerText = totalNumberGoals;
  labelCompleateGoals.innerHTML = compleateCount;
  labelRemainingTarget.innerHTML = totalNumberGoals - compleateCount;
};

const accumulateDeposit = (searchId, idBtn) => {
  const totalItem = goalData.find(item => {
    if (item.id === searchId) {
      return item;
    }
  });

  /// Get the amount from input target card
  let typeOperation = '+';
  const sum = document
    .getElementById(searchId)
    .getElementsByTagName('input')[0].value;

  if (+sum === 0) {
    return;
  }

  if (idBtn === 'withdraw-btn') {
    if (totalItem.accumulation < sum) {
      alert(`Withdrawals add to your savings limit!`);
      return;
    }
    typeOperation = '-';
    totalItem.accumulation -= +sum;
  } else {
    totalItem.accumulation += +sum;
  }

  saveDataLocalStorage();
  recordTransactionHistory(sum, totalItem, typeOperation);
  checkCompletionStatus(totalItem);
  percentageToFinish(totalItem);
  renderListGoal();
  console.log(goalData);
};

function percentageToFinish(goalItem) {
  goalItem.percentPointToFinish = (
    (goalItem.accumulation / goalItem.amount) *
    100
  ).toFixed(2);
  saveDataLocalStorage();
}

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
  console.log('Remove item ' + goalID);
  const indexItem = goalData.findIndex(item => item.id === goalID);
  goalData.splice(indexItem, 1);
  console.log(goalData);
  saveDataLocalStorage();
  renderListGoal();
};

const newgoal = () => {
  reset();
  dialogWindows.showModal();
};

discardBtn.addEventListener('click', () => {
  reset();
  dialogWindows.close();
});

const deposit = buttonEl => {
  accumulateDeposit(buttonEl.closest('.goal__task').id);
};

const withdraw = buttonEl => {
  accumulateDeposit(buttonEl.closest('.goal__task').id, buttonEl.id);
};

const history = buttonEl => {
  showHistory(buttonEl.closest('.goal__task').id);
};

const remove = buttonEl => {
  removeGoal(buttonEl.closest('.goal__task').id);
};

const edite = buttonEl => {
  editeGoal(buttonEl.closest('.goal__task').id);
};

/// CHECK GOAL COMPLETION STATUS.
const checkCompletionStatus = goalItemObj => {
  if (goalItemObj.accumulation >= goalItemObj.amount) {
    goalItemObj.compleateStatus = true;
    console.log('Goal Item Complete 🥳');
  }
};

/// EDITE GOAL.
const editeGoal = goalID => {
  reset();
  const dataArrIndex = goalData.findIndex(item => item.id === goalID);
  currentGoal = goalData[dataArrIndex];
  goalNameInput.value = currentGoal.name;
  goalAmountInput.value = currentGoal.amount;
  goalInitialValue.value = currentGoal.accumulation;

  console.log('+++');
  console.log(currentGoal);

  radiosCurrencyBtn.forEach(item => {
    if (item.value === currentGoal.currency) {
      item.parentNode.classList.add('active');
    }
  });

  dialogWindows.querySelector('.title').innerText = 'Edit goal';
  btn.innerText = 'Save goal';
  dialogWindows.showModal();
};

const recordTransactionHistory = (sum, totalItem, typeOperation) => {
  totalItem.history.push({
    amount: sum,
    date: new Date().toLocaleString(),
    operation: typeOperation,
  });
};

/// SHOW HISTORY LIST
const showHistory = goalID => {
  const dataArrIndex = goalData.findIndex(item => item.id === goalID);
  currentGoal = goalData[dataArrIndex];

  goalFormStart.classList.add('hide');
  historyList.classList.remove('hide');
  dialogWindows.querySelector('.title').innerText = 'History';
  historyList.innerHTML = '';

  currentGoal.history.forEach(item => {
    historyList.innerHTML += `
    <div class="goal__history-item">
      <div class="goal__history-date">
        <span class="goal__history-month">${item.date.split(',')[0]}</span>
        <span class="goal__history-time">${item.date.split(',')[1]}</span>
      </div>
      <div class="goal__history-amount">
        <span class="goal__history-month">${item.amount}</span>
      </div>
      <div class="goal__history-operation">
        <span class="goal__history-icon">
          <i class="ri-corner-right-down-line"></i>
        </span>
      </div>
    </div>
  `;
  });

  btn.innerText = 'Save goal';
  dialogWindows.showModal();
};

renderListGoal();
if (!goalData.length) {
  dialogWindows.showModal();
} else {
  renderListGoal();
  goalListContainer.classList.toggle('hide');
}

/// Save data in local storage.

const saveDataLocalStorage = () => {
  localStorage.setItem('data', JSON.stringify(goalData));
};
