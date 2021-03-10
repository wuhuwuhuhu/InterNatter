const cookies = document.cookie.split(';')
let username = '';
let userLanguage = '';

for (let i = 0; i < cookies.length; i++) {
    let pair = cookies[i].split('=')
    if (pair[0] === 'username') username = pair[1];
    if (pair[0] === 'userLanguage') userLanguage = pair[1];
}

module.exports = { username, userLanguage }