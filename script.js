const form = document.querySelector('#conversion-form');
const resultDiv = document.querySelector('#result');
const saveButton = document.querySelector('#save-button');
const savedList = document.querySelector('#saved-list');

// Variables to store current conversion data
let currentRate = null;
let currentFrom = null;
let currentTo = null;
let currentAmount = null;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const from = document.querySelector('#fromCurrency').value.toUpperCase();
    const to = document.querySelector('#toCurrency').value.toUpperCase();
    const amount = document.querySelector('#amount').value;

    if (!from || !to || isNaN(amount)) {
        resultDiv.textContent = 'Please fill out all fields correctly.';
        saveButton.disabled = true;
        return;
    }

    const url = `https://api.fastforex.io/fetch-one?from=${from}&to=${to}&api_key=demo`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.result || !data.result[to]) {
                resultDiv.textContent = 'Invalid currency code or API error.';
                saveButton.disabled = true;
                return;
            }

            const rate = data.result[to];
            const converted = (amount * rate).toFixed(2);
            resultDiv.textContent = `${amount} ${from} = ${converted} ${to}`;

            currentRate = rate;
            currentFrom = from;
            currentTo = to;
            currentAmount = amount;

            saveButton.disabled = false;
        })
        .catch(() => {
            resultDiv.textContent = 'Error fetching data.';
            saveButton.disabled = true;
        });
});

saveButton.addEventListener('click', () => {
    if (!currentRate) {
        alert('Please perform a conversion first!');
        return;
    }

    const item = document.createElement('div');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.textContent = `${currentFrom} - ${currentTo}`;

    const savedCurr = document.createElement('span');
    savedCurr.className = 'savedCurr bg-success rounded-pill';
    savedCurr.textContent = currentRate.toFixed(4);

    item.appendChild(savedCurr);
    savedList.appendChild(item);

    saveButton.disabled = true;
});

saveButton.disabled = true;

// A quick real time search for the default CAD currency to any other currency
document.querySelector('#search-button').addEventListener('click', () => {
    const currency = document.querySelector('#searchCurrency').value.toUpperCase();
    const cadRate = document.querySelector('#cad-rate');
    
    if (!currency) {
        cadRate.textContent = 'Please enter a currency.';
        return;
    }
    
    fetch(`https://api.fastforex.io/fetch-one?from=CAD&to=${currency}&api_key=demo`)
        .then(response => response.json())
        .then(data => {
            if (data.result && data.result[currency]) {
                cadRate.textContent = `1 CAD = ${data.result[currency].toFixed(4)} ${currency}`;
            } else {
                cadRate.textContent = 'Invalid currency code.';
            }
        })
        .catch(() => {
            cadRate.textContent = 'Error fetching rate.';
        });
});