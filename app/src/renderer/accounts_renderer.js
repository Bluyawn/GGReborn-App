const { ipcRenderer } = require('electron');
const { showInfoBox } = require('../renderer/renderer');
const { encrypt } = require('../utils/encrypter');
const { newAccount, getAllAccounts } = require('../utils/database');
const { getLocalizedText } = require('../utils/locales');

init();

function init() {
    handleControls();

    listAccounts();
};

function handleControls() {
    document.getElementById('add-account-button').addEventListener('click', event => {
        addNewAccount();
    });
};

async function listAccounts() {
    const accounts_list = document.getElementById("accounts-list");
    
    const accounts = await getAllAccounts();

    accounts.sort((a, b) => {
        return parseInt(b._id, 10) - parseInt(a._id, 10);
    });

    accounts.forEach(account => {
        const account_item = document.createElement('div');
        account_item.className = 'account-item';
        account_item.id = `account-item-${account_item._id}`;

        account_item.innerHTML = `
        <p class="text">${account.username}</p>
        <p class="text">****</p>
        <div class="button-container">
            <button id="update-button-${account._id} locale="update">${getLocalizedText('update')}</button>
        </div>
        `

        accounts_list.appendChild(account_item);
    });
};

function addNewAccount() {
    let isAccountUpdate = document.getElementById("account-update");

    if (!isAccountUpdate) {
        const accounts_list = document.getElementById("accounts-list");

    const account_item = document.createElement('div');
    account_item.className = 'account-item';
    account_item.id = 'account-update';
    account_item.draggable = false;

    account_item.innerHTML = `
        <p class="text" locale="username">${getLocalizedText('username')}</p>
        <input type="text" id="account-username">
        <p class="text" locale="password">${getLocalizedText('password')}</lapbel>
        <div class="password-container">
            <input type="password" id="account-password">
            <button type="button" id="reveal-password-button" locale="show-password">${getLocalizedText('show-password')}</button>
        </div>
        <div class="checkbox-container">
            <input type="checkbox" id="encrypt-password" checked="true">
            <label for="encrypt-password" locale="encrypt">${getLocalizedText('encrypt')}</label>
        </div>
        <div class="button-container">
            <button id="remove-button" disabled="true" locale="remove">${getLocalizedText('remove')}</button>
            <button id="cancel-button" locale="cancel">${getLocalizedText('cancel')}</button>
            <button id="save-button" locale="save">${getLocalizedText('save')}</button>
        </div>
    `;

    accounts_list.insertBefore(account_item, accounts_list.firstChild);

    document.getElementById('cancel-button').addEventListener('click', event => {
        cancelAccountUpdate();
    });

    document.getElementById('save-button').addEventListener('click', event => {
        saveAccount();
    });

    const reveal_password_button =  document.getElementById('reveal-password-button');

    reveal_password_button.addEventListener('click', event => {
        const account_password = document.getElementById("account-password");

        if (account_password.type === "password") {
            account_password.type = "text";
            reveal_password_button.textContent = getLocalizedText('hide-password');
        } else {
            account_password.type = "password";
            reveal_password_button.textContent = getLocalizedText('show-password');
        };
    });
};
};

function cancelAccountUpdate() {
    const accountUpdate = document.getElementById('account-update');
    accountUpdate.remove();
};

function saveAccount() {
    const account_username = document.getElementById('account-username');
    const username_len = account_username.value.length;
    const username = account_username.value;

    const account_password = document.getElementById('account-password');
    const password_len = account_password.value.length;
    const password = account_password.value;

    const encrypt_password = document.getElementById('encrypt-password');
    const isEncrypt = encrypt_password.checked;


    if (username_len <= 0) {
        showInfoBox(getLocalizedText('username-cant-be-empty'));
        return;
    };

    if (password_len <= 0) {
        showInfoBox(getLocalizedText('password-cant-be-empty'));
        return;
    };

    if (isEncrypt) {
        const encryptedData = encrypt(username, password);
        newAccount(username, encryptedData);
    }
    else {
        newAccount(username, password);
    };
    
    // !! LAZY
    cancelAccountUpdate();
    
    const accounts_list = document.getElementById("accounts-list");

    const account_item = document.createElement('div');
    account_item.className = 'account-item';
    account_item.id = `account-item-${account_item._id}`;

    account_item.innerHTML = `
    <p class="text">${username}</p>
    <p class="text">****</p>
    <div class="button-container">
        <button id="update-button" locale='update">${getLocalizedText('update')}</button>
    </div>
    `

    accounts_list.insertBefore(account_item, accounts_list.firstChild);
};