/*
// set in fetch_users.js

global_usersArr;
global_usersArrHTML;
*/

/* dom vars */
const filterInp = document.getElementsByClassName('filter-inp')[0],
    filterBtn = document.getElementsByClassName('filter-btn')[0],
    ulRender = document.getElementsByClassName('users-render')[0],
    infoBar = document.getElementsByClassName('info-bar')[0],
    infoBarMessage = document.querySelector('.message');

filterInp.disabled = true;
filterBtn.disabled = true;

/* will hold all user dom nodes once they're rendered */
let usersNodes;

/*--------------------------------------------------------------------------------------------------------------------*/

/* functions to control messaging, especially when clicking on emails/accounts */

infoBar.message = msg => {
    infoBar.style.opacity = 1;
    infoBarMessage.style.transition = 'opacity .01s linear';
    infoBarMessage.style.opacity = 1;
    infoBarMessage.textContent = msg;
}

infoBar.clear = timeout => {
    setTimeout(() => {
        const fadeTime = 250;

        infoBarMessage.style.transition = `opacity ${fadeTime}ms linear`;
        infoBarMessage.style.opacity = 0;
        setTimeout(() => {
            // infoBar.message(null);
            infoBar.style.opacity = 0;

            /* enable input (and button) for filtering */
            if (filterInp.disabled) {
                filterInp.disabled = false;
                filterBtn.disabled = false;
            }
        }, fadeTime);
    }, timeout || 0);
};

function eMsg(email) {
    infoBar.message(`You clicked email ${email}`);
    infoBar.clear(1250);
}

function aMsg(acctName) {
    infoBar.message(`You clicked account name ${acctName}`);
    infoBar.clear(1250);
}

/*--------------------------------------------------------------------------------------------------------------------*/

/* function to render all users in html and get nodes */

function renderAllUsers() {
    /* length divided */
    let ld = Math.floor(global_usersArrHTML.length / 5);   /* <-- higher the number, faster the initial load */

    /* load a chunk, then the rest */
    ulRender.innerHTML = global_usersArrHTML.slice(0, ld).join('');

    infoBar.message('Users loaded!');
    infoBar.clear(250);

    /* large dump to dom; async/setTimeout seems to increase speed of renders */
    setTimeout(() => {
        ulRender.innerHTML += global_usersArrHTML.slice(ld).join('');

        /* grab all the users in the html (nodes) */
        usersNodes = document.getElementsByClassName('u');
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

filterInp.addEventListener('keyup', filterUsers);

/* TODO: could try the same tactic as above... build a string, drop a chunk, drop the rest??? */

function filterUsers() {
    try {
        const l = usersNodes.length;
        let patterns = this.value.split(' '),
            pattern,
            i = 0;

        if (patterns.length === 1) {
            pattern = RegExp(patterns[0], 'i');

            while (i < l) {
                usersNodes[i].style.display = pattern.test(usersNodes[i].dataset.d) ? 'block' : 'none';
                i++;
            }

            infoBar.clear();
        } else {
            patterns = patterns.map(pat => RegExp(pat, 'i'));

            let allPatsMatch;

            while (i < l) {
                allPatsMatch = true;
                patterns.forEach(pat => {
                    if (!pat.test(usersNodes[i].dataset.d)) allPatsMatch = false;
                });
                usersNodes[i].style.display = allPatsMatch ? 'block' : 'none';
                i++;
            }
        }
    } catch (err) {
        console.error(err);
    }
}