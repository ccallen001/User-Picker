/**
 * userpicker.js
 */

/*--------------------------------------------------------------------------------------------------------------------*/

/* namespace/main function called when userpicker.js is parsed in the html.. after body has been loaded */
(function userpicker() {

    /*----------------------------------------------------------------------------------------------------------------*/
    /* VARIABLES */

    /* "globals" */

    let usersDataArr = [],
        usersDataHTML = ``,
        usersHTMLCollection = null;

    /* DOM getters */

    const filterInput = document.getElementsByClassName('filter-input')[0],
        filterBtn = document.getElementsByClassName('filter-btn')[0],    
        usersList = document.getElementsByClassName('users-list')[0],
        infoModal = document.getElementsByClassName('info-modal')[0],
        infoModalClose = infoModal.querySelector('a.close')
    infoModalOutput = infoModal.querySelector('output');

    /* will enable once user data has loaded */
    filterInput.disabled = true;
    filterBtn.disabled = true;

    /*----------------------------------------------------------------------------------------------------------------*/
    /* HELPER FUNCTIONS */

    /* general error handling/reporting */
    function error(err) {
        console.error(`ERROR! ${err}.`);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    /* GET DATA, FORM HTML, INJECT IN DOM */

    /* fetch user data, create HTML string */
    (function getUsers() {
        fetch('https://raw.githubusercontent.com/SpendBridge/exercises/master/data/users.json')
            .then(r => r.json())
                .then(j => {
                    /* update global user data array */
                    usersDataArr = j;

                    /* create data/HTML string */
                    usersDataHTML = usersDataArr
                        .map(user => `
                            <li class="user" data-data-string="${user.accountName + user.accountNumber + user.fullName + user.email}">
                                ${user.fullName},
                                <a onclick="messageEmail('${user.email}')">${user.email}</a>,
                                ${user.accountName},
                                <a onclick="messageAcctName('${user.accountName}')">${user.accountNumber}</a>
                            </li>
                            `
                        )
                        .join('');
                    /* call to inject data/HTML in DOM */
                    injectUserData(usersDataHTML);
                })
                .catch(err => error(err))
            .catch(err => error(err));
    })();

    /* inject data in DOM ...called upon completion of fetching data */
    function injectUserData(htmlstring) {
        usersList.innerHTML = htmlstring;
        /* get newly added DOM elements */
        usersHTMLCollection = document.getElementsByClassName('user');
        /* show status of successfully loaded */
        infoModalOutput.textContent = 'Users successfully loaded!'
        setTimeout(hideModal, 3000);

        filterInput.disabled = false;
        filterBtn.disabled = false;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    /* FILTER FUNCTIONALITY */

    /* add input listener/handler */
    filterBtn.addEventListener('click', () => {
        let patterns = filterInput.value.split(' '),

            /* for loops appear to be faster than forEach */

            i = 0,
            l = usersHTMLCollection.length;

        if (patterns.length < 1) {
            /* if pattern is single string */
            let pattern = RegExp(patterns[0], 'i');

            for (; i < l; i++) {
                usersHTMLCollection[i].style.display = 'none';

                if (pattern.test(usersHTMLCollection[i].dataset.dataString)) {
                    usersHTMLCollection[i].style.display = 'block';
                }
            }
        } else {
            /* if the patterns are space delimited */
            patterns = patterns.map(pat => RegExp(pat, 'i'));

            for (; i < l; i++) {
                usersHTMLCollection[i].style.display = 'none';

                let allMatch = true;

                patterns.forEach(pat => {
                    if (!pat.test(usersHTMLCollection[i].dataset.dataString)) {
                        allMatch = false;
                    }
                });

                if (allMatch) usersHTMLCollection[i].style.display = 'block';
            }
        }
    });

    /*----------------------------------------------------------------------------------------------------------------*/
    /* USER DATA CLICK HANDLERS, MODAL CONTROL */

    /* functions to show and hide modal */

    function showModal() {
        infoModal.style.zIndex = 1;
        infoModal.style.opacity = 1;
    }

    function hideModal() {
        infoModal.style.opacity = 0;
        infoModal.style.zIndex = 0;
    }

    /* modal close "button" */
    infoModalClose.addEventListener('click', hideModal);

    /* clicking on users in the list */

    messageAcctName = (acctName) => {
        showModal();
        infoModalOutput.textContent = `You clicked account ${acctName}`
    }

    messageEmail = (email) => {
        showModal();
        infoModalOutput.textContent = `You clicked email ${email}`
    }

    /*----------------------------------------------------------------------------------------------------------------*/

})();

/*--------------------------------------------------------------------------------------------------------------------*/
