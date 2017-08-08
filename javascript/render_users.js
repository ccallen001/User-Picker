/*
render_users.js

once searchable and html lists have been built,
define messaging capabilities,
render users list in html 

---

global vars declared in fetch_users.js:

global_usersArr
global_usersArrHTML
global_l
global_ld
*/

/*--------------------------------------------------------------------------------------------------------------------*/

/* dom elements */

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

let messageTimeout;
message.clear = timeout => {
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        message.style.zIndex = -1;
        message.style.opacity = 0;
    }, timeout || 1500);
};

/* when clicking on the users' emails/accounts */
function m(data) {
    let type = /@/.test(data) ? 'email' : 'account';
    message.write(`You clicked ${type} ${data}`);
    message.clear();
}

/*--------------------------------------------------------------------------------------------------------------------*/

/* function to render all users in html */
function renderAllUsers() {
    message.write("Loading users...");
    /* try not to block the render/ui thread in the browser */
    setTimeout(() => {
        /* load a chunkfirst , then the rest */
        usersList.innerHTML = global_usersArrHTML.slice(0, global_ld).join('');
        /* large dump to the dom; async/setTimeout seems to increase speed of render */
        setTimeout(() => {
            usersList.innerHTML += global_usersArrHTML.slice(global_ld).join('');
            message.clear(100);
            input.focus();
        });
    });
    /* flag to be used to control whether or not all users get rendered or not when user clicks search */
    renderAllUsers.rendered = true;
}

/*--------------------------------------------------------------------------------------------------------------------*/

/* handler function to control search/filter logic */

/* bind listeners/handler */
input.addEventListener("keydown", ev => {
    if (ev.keyCode === 13) filterUsers.call(button);
});
button.addEventListener("click", filterUsers);

function filterUsers() {
	/* this = button */;
    this.blur();
    if (input.value === '') {
        if (!renderAllUsers.rendered) renderAllUsers();
    } else {
        /* try/catch block to handle any unforeseen regex errors */
        try {
            let patterns = input.value.split(' '),
                pattern,
                allPatsMatch,
                matches = [],
                /* mld will be used as matched-patterns-length-divided for purposes of chunking */
                mld,
                i = 0;

            if (patterns.length === 1) {
                /* if single string of char(s) */
                pattern = RegExp(patterns[0], 'i');

                while (i < global_l) {
                    if (pattern.test(global_usersArr[i].dataString)) matches.push(global_usersArrHTML[i]);
                    i++;
                }
            } else {
                /* if space delimited groups of chars */
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

            if (matches.length === 0) {
                /* if no matches */
                usersList.style.opacity = .25;
                message.write('No matches... :(');
                message.clear();
                setTimeout(() => { usersList.style.opacity = 1; }, 1000);
            } else {
                setTimeout(() => {
                    /* load a chunk, then the rest */
                    usersList.innerHTML = matches.slice(0, mld).join('');
                    /* large dump to dom; async/setTimeout seems to increase speed of render */
                    setTimeout(() => {
                        usersList.innerHTML += matches.slice(mld).join('');
                    });
                });
            }

            renderAllUsers.rendered = false;

        } catch (err) {
            console.error(err);
        }
    }

    input.focus();
}