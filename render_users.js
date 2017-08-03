/*
// global vars set in fetch_users.js

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

/*--------------------------------------------------------------------------------------------------------------------*/

/* functions to control messaging, especially when clicking on emails/accounts */

infoBar.message = msg => {
    infoBar.style.zIndex = 1;
    infoBar.style.opacity = 1;
    infoBarMessage.textContent = msg;
}

infoBar.clear = () => {
    infoBar.style.opacity = 0;
    infoBar.style.zIndex = -1;
};

function eMsg(email) {
    infoBar.message(`You clicked email ${email}`);
    setTimeout(() => { infoBar.clear(); }, 1000);
}

function aMsg(acctName) {
    infoBar.message(`You clicked account name ${acctName}`);
    setTimeout(() => { infoBar.clear(); }, 1000);
}

/*--------------------------------------------------------------------------------------------------------------------*/

/* function to render all users in html */

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
            setTimeout(() => { infoBar.clear(); }, 1000);

            loadedOnce = true;
        } else {
            infoBar.clear();
        }

        enableFilterUI();

        filterInp.focus();
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

/* filtering */

filterInp.addEventListener('keyup', filterUsers);
// filterBtn.addEventListener('click', filterUsers);

function filterUsers() {
    if (filterInp.value === '') {
        renderAllUsers();
    } else {
        if (filterInp.value.length === 1) {
            // infoBar.message('Loading...');
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

            mld = matches.length / 40;

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