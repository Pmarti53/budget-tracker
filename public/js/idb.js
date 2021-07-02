const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.online) {
        //uploadBudget();
    }
};

request.onerror = function (event) {
    console.log(event.targer.errorCode);
};

function saveBudget(budget) {
    const transaction = db.transaction(['new_budget_item'], 'readwrite');
    const budgetObjectStore = transaction.object.Store('new_budget_item');
    budgetObjectStore.add(budget);
};

function uploadBudget() {
    const transaction = db.transaction(['new_budget_item'], 'readwrite');
    const budgetObjectStore = transaction.object.Store('new_budget_item');
    const getAll = budgetObjectStore.getAll()

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'applcation/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const transaction = db.transaction(['new_budget_item'], 'readwrite');
                    const budgetObjectStore = transaction.objectStore('new_budget_item');
                    budgetObjectStore.clear();

                    alert('All saved budgets have been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};

window.addEventListener('online', uploadBudget);