'use strict';

const btn = document.getElementById('button');
const discardBtn = document.getElementById('close-button');
const windowStart = document.querySelector('.dialog__container');
const goalFormStart = document.getElementById('form');
const radiosCurrencyBtn = document.querySelectorAll('input[type="radio"]');
const goalNameInput = document.getElementById('dialog-name');
const goalAmountInput = document.getElementById('dialog-amount');
const goalInitialValue = document.getElementById('dialog-initial');
const currencyTypeRadio = document.querySelectorAll('.dialog__currency-option');
const goalListContainer = document.getElementById('goal-container');
const goalList = document.getElementById('goal-lists');
const goalAmountInputItem = document.getElementById('amount');
const dialogWindows = document.getElementById('dialog');
const historyList = document.getElementById('history-list');

const labelNumberGoals = document.getElementById('number-goals');
const labelRemainingTarget = document.getElementById('remaining-target');
const labelCompleateGoals = document.getElementById('complete-goals');

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

/// SHOW DROPDOWN MENU

const showDropdownMenu = (dropdownClass, button) => {
  const dropdownButtons = document.querySelectorAll(button);

  if (dropdownButtons.length === 0) {
    console.warn('No dropdown buttons found');
    return;
  }

  dropdownButtons.forEach(button => {
    button.addEventListener('click', () => {
      const dropdown = button.closest(`.${dropdownClass}`);
      if (dropdown) {
        dropdown.classList.toggle('show-dropdown');
      } else {
        console.warn('No dropdown container found');
      }
    });
  });

  closeDropdownMenu();
};

const closeDropdownMenu = () => {
  const dropdownItems = document.querySelectorAll('.dropdown__name');
  console.log(dropdownItems);
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      const dropdown = item.closest('.dropdown');
      dropdown.classList.toggle('show-dropdown');
    });
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
  dialogWindows.querySelector('.dialog__title').innerText = 'New goal';
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
      <div class="dropdown" id="dropdown-content">
        <button class="dropdown__button">
          <div class="dropdown__dot"></div>
          <div class="dropdown__dot"></div>
          <div class="dropdown__dot"></div>
        </button>

        <ul class="dropdown__menu">
          <li class="dropdown__item">
            <i class="ri-pencil-line dropdown__icon"></i>
            <span class="dropdown__name" id="edit" onclick="edit(this)"
              >Edit</span
            >
          </li>

          <li class="dropdown__item">
            <i class="ri-list-view dropdown__icon"></i>
            <span class="dropdown__name" id="history" onclick="history(this)"
              >History</span
            >
          </li>

          <li class="dropdown__item">
            <i class="ri-delete-bin-line dropdown__icon"></i>
            <span class="dropdown__name" id="edit" onclick="dialogWindow(this)"
              >Remove</span
            >
          </li>
        </ul>
      </div>

      <div class="goal__inform">
        <div class="goal__progress" id="goal-progressbar">
            ${Math.floor(percentPointToFinish)}
          <span class="percent">%</span>
        </div>

        <div class="hiden ${compleateStatus ? 'hide' : 'show'}">
          <div class="goal__data">
            <div class="goal__calculate">
              <input
                class="goal__amount"
                type="number"
                id="amount"
                placeholder="0"
                value="0"
              />
              <div class="goal__button">
                <button
                  id="withdraw-btn"
                  onclick="withdraw(this)"
                  class="button__minus"
                >
                  -
                </button>
                <button
                  id="deposit-btn"
                  onclick="deposit(this)"
                  class="button__plus"
                >
                  +
                </button>
              </div>
            </div>

            <div class="goal__wrap">
              <div class="lines">
                <svg
                  width="240"
                  height="144"
                  viewBox="0 0 240 144"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-1.71609e-06 72L111 72C116.523 72 121 76.4772 121 82L121 105.382L121 144"
                    stroke="#E3FF73"
                    stroke-width="2"
                  />
                  <path
                    d="M240 74L129 74C123.477 74 119 69.5229 119 64L119 37V0"
                    stroke="#E3FF73"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div class="goal__statistic">
                <div class="goal__statistic-item">
                  <span class="goal__statistic-amount">${accumulation}${currencyList[currency]}</span>
                  <label class="goal__statistic-name">Collected</label>
                </div>
                <div class="goal__statistic-item">
                  <span class="goal__statistic-amount">${amount - accumulation}${currencyList[currency]}</span>
                  <label class="goal__statistic-name">Remaining</label>
                </div>
                <div class="goal__statistic-item">
                  <span class="goal__statistic-amount">${amount}${currencyList[currency]}</span>
                  <label class="goal__statistic-name">Goal</label>
                </div>
                <div class="goal__statistic-item">
                  <span class="goal__statistic-amount">${percentPointToFinish}%</span>
                  <label class="goal__statistic-name">Progress</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="goal__title">${name}</div>

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

  showDropdownMenu('dropdown', '.dropdown__button');
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
  goalItem.percentPointToFinish = Math.floor(
    (goalItem.accumulation / goalItem.amount) * 100,
  ).toFixed(2);
  saveDataLocalStorage();
}

const dialogWindow = buttonEl => {
  const parentDiv = buttonEl.closest('.goal__task');
  const dialogWindow = parentDiv.querySelector('.goal__dialog');

  // if (!dialogWindow) {
  //   parentDiv.classList.add('hide');
  //   return;
  // }

  dialogWindow.classList.toggle('hide');
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

const edit = buttonEl => {
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

  dialogWindows.querySelector('.dialog__title').innerText = 'Edit goal';
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
  dialogWindows.querySelector('.dialog__title').innerText = 'History';
  historyList.innerHTML = '';

  currentGoal.history.forEach(item => {
    historyList.innerHTML += `
    <div class="dialog__history-item">
      <div class="dialog__history-date">
        <span class="dialog__history-month">${item.date.split(',')[0]}</span>
        <span class="dialog__history-time">${item.date.split(',')[1]}</span>
      </div>
      <div class="dialog__history-amount">
        <span class="dialog__history-month">${item.amount}</span>
      </div>
      <div class="dialog__history-operation">
        <span class="dialog__history-icon">
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
