let global_usersArr = [],
    global_usersArrHTML = [],
    global_l,
    global_ld,
    /* functions made global for hosting */
    m,
    renderAllUsers;

fetch('https://raw.githubusercontent.com/SpendBridge/exercises/master/data/users.json')
    .then(r => r.json())
    .then(j => {
        addDataString(j);
    })
    .catch(err => console.error(err))
    .catch(err => console.error(err));

function addDataString(j) {
    /* j = the fetched users data array */

    global_l = j.length;
    /* the length divided... greater the value, the smaller the initially rendered chunk */
    global_ld = Math.floor(global_l / 10);

    /* setTimeouts to create ansynchronisity */

    setTimeout(() => {
        let i = 0;
        while (i < global_l) {
            j[i].dataString = j[i].fullName + j[i].email + j[i].accountName + j[i].accountNumber;
            i++;
        }

        /* set global array of users */
        global_usersArr = j;
    });

    generateUsersArrHTML(j);
}

function generateUsersArrHTML(j) {
    /* build the html version of the global users array */
    let i = 0;
    while (i < global_l) {
        global_usersArrHTML[i] = `<li>${j[i].fullName}, <a onclick="m('${j[i].email}')">${j[i].email}</a>, ${j[i].accountName}, <a onclick="m('${j[i].accountName}')">${j[i].accountNumber}</a></li>`;
        i++;
    }

    /* execution flows to render_users.js */
    if (renderAllUsers) renderAllUsers();
    else console.error('renderAllUsers function not yet defined')
}