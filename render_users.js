/*
// global vars set in fetch_users.js

global_usersArr;
global_usersArrHTML;
global_l;
global_ld;
*/

/* dom vars */
const input = document.querySelector('.left input'),
    button = document.querySelector('.left button'),
    usersList = document.getElementsByClassName('users-list')[0],
    message = document.getElementsByClassName('message')[0];

/*--------------------------------------------------------------------------------------------------------------------*/

/* functions to control messaging */

message.write = msg => {
    message.style.zIndex = 1;
    message.style.opacity = 1;
    message.textContent = msg;
}

message.clear = timeout => {
    setTimeout(() => {
        message.style.zIndex = -1;
        message.style.opacity = 0;
    }, timeout || 1500);
};

function m(data) {
    let type = /@/.test(data) ? 'email' : 'account';
    message.write(`You clicked ${type} ${data}`);
    message.clear();
}

/*--------------------------------------------------------------------------------------------------------------------*/

/* function to render all users in html */

function renderAllUsers() {
    /* load a chunk, then the rest */
    usersList.innerHTML = global_usersArrHTML.slice(0, global_ld).join('');

    /* large dump to dom; async/setTimeout seems to increase speed of render */
    setTimeout(() => {
        usersList.innerHTML += global_usersArrHTML.slice(global_ld).join('');
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

/* function to control search logic */

button.addEventListener('click', filterUsers);

function filterUsers() {
    if (input.value === '') {
        renderAllUsers();
    } else {
        try {

            /* pattern matching */
            let patterns = input.value.split(' '),
                pattern,
                allPatsMatch,
                matches = [],
                mld,
                i = 0;

            if (patterns.length === 1) {
                pattern = RegExp(patterns[0], 'i');

                while (i < global_l) {
                    if (pattern.test(global_usersArr[i].dataString)) matches.push(global_usersArrHTML[i]);
                    i++;
                }
            } else {
                patterns = patterns.map(pat => RegExp(pat, 'i'));

                while (i < global_l) {
                    allPatsMatch = true;
                    patterns.forEach(pat => {
                        if (!pat.test(global_usersArr[i].dataString)) allPatsMatch = false;
                    });
                    if (allPatsMatch) matches.push(global_usersArrHTML[i]);
                    i++;
                }
            }

            mld = matches.length / 10;

            /* load a chunk, then the rest */
            usersList.innerHTML = matches.slice(0, mld).join('');

            /* large dump to dom; async/setTimeout seems to increase speed of render */
            setTimeout(() => {
                usersList.innerHTML += matches.slice(mld).join('');
            });

            if (matches.length === 0) {
                renderAllUsers();
                message.write('No matches... :(');
                message.clear();
            }

        } catch (err) {
            console.error(err);
        }
    }
}