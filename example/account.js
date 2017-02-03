'use strict';

const store = new Map();
const logins = new Map();
const claims = new Map();
const uuid = require('uuid');
const accounts = require('./accounts.json');

function getRandomly(source) {
  const rnd = Math.floor(Math.random() * (20 - 0)) + 0;
  return Array.from(source.keys()).find((key, idx) => idx === rnd);
}

class Account {
  constructor(id) {
    this.accountId = id || uuid();
    store.set(this.accountId, this);
  }

  claims() {
    return claims.get(this.accountId);
  }

  static findByLogin(login) {
    let username = logins.has(login) ? login : null;
    if (!username) {
      username = getRandomly(logins);
    }

    return Promise.resolve(logins.get(username));
  }

  static findById(id) {
    if (!store.get(id)) new Account(id); // eslint-disable-line no-new
    return Promise.resolve(store.get(id));
  }
}

(() => {
  accounts.forEach((account) => {
    const instance = new Account(account.sub);
    store.set(account.sub, instance);
    logins.set(account.preferred_username, instance);
    claims.set(account.sub, account);
  });
})();

module.exports = Account;
