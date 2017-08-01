let global_usersArr = [],
    global_usersArrHTML = [];

fetch('https://raw.githubusercontent.com/SpendBridge/exercises/master/data/users.json')
    .then(r => r.json())
    .then(j => {
        addDataString(j);
    })
    .catch()
    .catch();

function addDataString(usersArr) {
    const l = usersArr.length;
    let i = 0;

    while (i < l) {
        usersArr[i].dataString = usersArr[i].fullName + usersArr[i].email + usersArr[i].accountName + usersArr[i].accountNumber;

        i++;
    }

    global_usersArr = usersArr;

    generateHTML(usersArr);

    /* execution flows to render_users.js */
    renderAllUsers();
}

/* build the html version of the global users array, and the global users html string */
function generateHTML(usersArr) {
    const l = usersArr.length;
    let i = 0;

    while (i < l) {
        global_usersArrHTML[i] = `<li class="u" data-d="${usersArr[i].dataString}">${usersArr[i].fullName}, <a onclick="eMsg('${usersArr[i].email}')">${usersArr[i].email}</a>, ${usersArr[i].accountName}, <a onclick="aMsg('${usersArr[i].accountName}')">${usersArr[i].accountNumber}</a></li>`;

        i++;
    }
}