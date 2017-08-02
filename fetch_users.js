let global_usersArr = [],
    global_usersArrHTML = [],
    global_l,
    global_ld;

fetch('https://raw.githubusercontent.com/SpendBridge/exercises/master/data/users.json')
    .then(r => r.json())
    .then(j => {
        addDataString(j);
    })
    .catch(err => console.error(err))
    .catch(err => console.error(err));

function addDataString(j) {
    /* j = the fetched user data array */
    global_l = j.length;
    global_ld = Math.floor(global_l / 10);

    let i = 0;
    while (i < global_l) {
        j[i].dataString = j[i].fullName + j[i].email + j[i].accountName + j[i].accountNumber;
        i++;
    }

    /* set global array of users */
    global_usersArr = j;

    /* create array of users in html */
    generateHTML(j);

    /* execution flows to render_users.js */
    renderAllUsers();
}

/* build the html version of the global users array, and the global users html string */
function generateHTML(j) {
    let i = 0;
    while (i < global_l) {
        // global_usersArrHTML[i] = `<li class="u" data-d="${usersArr[i].dataString}">${usersArr[i].fullName}, <a onclick="eMsg('${usersArr[i].email}')">${usersArr[i].email}</a>, ${usersArr[i].accountName}, <a onclick="aMsg('${usersArr[i].accountName}')">${usersArr[i].accountNumber}</a></li>`;
        global_usersArrHTML[i] = `<li>${j[i].fullName}, <a onclick="eMsg('${j[i].email}')">${j[i].email}</a>, ${j[i].accountName}, <a onclick="aMsg('${j[i].accountName}')">${j[i].accountNumber}</a></li>`;
        i++;
    }
}