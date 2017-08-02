/*
// set in fetch_users.js

global_usersArr;
global_usersArrHTML;
global_l;
global_ld;
*/

/* dom vars */
const filterInp = document.getElementsByClassName('filter-inp')[0],
    // filterBtn = document.getElementsByClassName('filter-btn')[0],
    ulRender = document.getElementsByClassName('users-render')[0],
    infoBar = document.getElementsByClassName('info-bar')[0],
    infoBarMessage = document.querySelector('.message');

function enableFilterUI() {
    filterInp.disabled = false;
    // filterBtn.disabled = false;
}

function disableFilterUI() {
    filterInp.disabled = true;
    // filterBtn.disabled = true;
}
disableFilterUI();

/* will hold all user dom nodes once they're rendered */
// let usersNodes;

/*--------------------------------------------------------------------------------------------------------------------*/

/* functions to control messaging, especially when clicking on emails/accounts */

infoBar.message = msg => {
    infoBar.style.zIndex = 1;
    infoBar.style.opacity = 1;
    // infoBarMessage.style.transition = 'opacity .01s linear';
    // infoBarMessage.style.opacity = 1;
    infoBarMessage.textContent = msg;
}

infoBar.clear = (timeout, fadeTime) => {
    setTimeout(() => {
        // infoBarMessage.style.transition = `opacity ${fadeTime}ms linear`;
        // infoBarMessage.style.opacity = 0;
        setTimeout(() => {
            // infoBar.message(null);
            infoBar.style.zIndex = -1;
            infoBar.style.opacity = 0;
        }, fadeTime || 0);
    }, timeout || 0);
};

function eMsg(email) {
    infoBar.message(`You clicked email ${email}`);
    infoBar.clear(500, 500);
}

function aMsg(acctName) {
    infoBar.message(`You clicked account name ${acctName}`);
    infoBar.clear(500, 500);
}

/*--------------------------------------------------------------------------------------------------------------------*/

/* function to render all users in html and get nodes */

let loadedOnce = false;

function renderAllUsers() {
    disableFilterUI();

    infoBar.message('Loading...');

    /* load a chunk, then the rest */
    ulRender.innerHTML = global_usersArrHTML.slice(0, global_ld).join('');

    /* large dump to dom; async/setTimeout seems to increase speed of renders */
    setTimeout(() => {
        ulRender.innerHTML += global_usersArrHTML.slice(global_ld).join('');

        /* only display 'Users loaded!' first time */
        if (!loadedOnce) {
            infoBar.message('Users loaded!');
            infoBar.clear(0, 250);

            loadedOnce = true;
        } else {
            infoBar.clear();
        }

        enableFilterUI();

        filterInp.focus();

        /* grab all the users in the html (nodes) */
        // usersNodes = document.getElementsByClassName('u');
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

filterInp.addEventListener('keyup', filterUsers);
// filterBtn.addEventListener('click', filterUsers);

function filterUsers() {
    if (filterInp.value === '') {
        renderAllUsers();
    } else {
        if (filterInp.value.length === 1) {
            infoBar.message('Loading...');
        }
        try {
            let patterns = filterInp.value.split(' '),
                pattern,
                allPatsMatch,
                matches = [],
                mld,
                i = 0;

            if (patterns.length === 1) {
                pattern = RegExp(patterns[0], 'i');

                while (i < global_l) {
                    // usersNodes[i].style.display = pattern.test(usersNodes[i].dataset.d) ? 'block' : 'none';

                    if (pattern.test(global_usersArr[i].dataString)) matches.push(global_usersArrHTML[i]);

                    i++;
                }
            } else {
                patterns = patterns.map(pat => RegExp(pat, 'i'));

                while (i < global_l) {
                    allPatsMatch = true;

                    patterns.forEach(pat => {
                        // if (!pat.test(usersNodes[i].dataset.d)) allPatsMatch = false;

                        if (!pat.test(global_usersArr[i].dataString)) allPatsMatch = false;
                    });

                    // usersNodes[i].style.display = allPatsMatch ? 'block' : 'none';

                    if (allPatsMatch) matches.push(global_usersArrHTML[i]);

                    i++;
                }
            }

            mld = matches.length / 10;

            /* chunk */
            ulRender.innerHTML = matches.slice(0, mld).join('');

            /* rest of it */
            setTimeout(() => {
                ulRender.innerHTML = matches.slice(mld).join('');
                infoBar.clear();
            });
        } catch (err) {
            console.error(err);
        }
    }
}