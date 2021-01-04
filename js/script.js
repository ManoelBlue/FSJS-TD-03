console.log('test');

//Global variables:
const form = document.getElementsByTagName("form")[0];

const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputOtherJob = document.getElementById("other-job-role");
const selectJob = document.getElementById("title");
const selectColor = document.getElementById("color");
const selectDesign = document.getElementById("design");

// Global variables for activities fieldset:
const activitiesField = document.getElementById("activities");
const activities = activitiesField.querySelectorAll(["[type='checkbox"]);
const activitiesCostElem = document.getElementById("activities-cost");
let activitiesCostValue = 0;

console.log(activities);

// Global variables for payment:
const selectPayment = document.getElementById("payment");
const paymentOptions = document.querySelectorAll("select#payment option");
const paymentMenus = buildPaymentMenus(paymentOptions);
let chosenPaymentIndex = selectPayment.options.selectedIndex;
let chosenPaymentMethod = paymentOptions[chosenPaymentIndex].value;

// Global variables for credit card info:
const creditCardNumber = document.getElementById("cc-num");
const creditCardZip = document.getElementById("zip");
const creditCardCvv = document.getElementById("cvv");

// Global functions:
/**
 * @function buildPaymentMenus
 * @description Creates a nodelist with all menu divs
 * @param {NodeList} - nodelist with possible options of payment
 */
function buildPaymentMenus(paymentOptions) {
    let menus = [];
    for (let i = 0; i < paymentOptions.length; i++) {
        let menu = document.getElementById(paymentOptions[i].value);
        menus.push(menu);
    }

    return menus;
};

// Highlight name input when page first loads:
inputName.focus();

//Hide the other-job-role input by default:
inputOtherJob.style.display = "none";

//Listen to changes on select Job and show/hide input other job:
selectJob.addEventListener("change", (e) => {
    let selectedIndex = e.target.options.selectedIndex;
    let selectedOption = e.target[selectedIndex].value;

    console.log(selectedIndex);
    console.log(selectedOption);

    if(selectedOption === "other") {
        inputOtherJob.style.display = "block"
    } else {
        inputOtherJob.style.display = "none";
    }
})

// Disable select color:
selectColor.disabled = true;
console.dir(selectColor);

// Listen to change in selectDesgin:
selectDesign.addEventListener("change", (e) => {
    let selectedIndex = e.target.options.selectedIndex;
    let selectedOption = e.target[selectedIndex].value;
    let options = document.querySelectorAll("option[data-theme]");

    selectColor.disabled = false;
    for ( let i = 0; i < options.length; i++) {
        let dataTheme = options[i].dataset.theme;
        console.log(dataTheme);

        if (selectedOption !== dataTheme) {
            options[i].hidden = true;
        } else {
            options[i].hidden = false;
        }
    }
})

// Listen for change in the Activities fieldset:
activitiesField.addEventListener("change", (e) => {
    let cost = parseInt(e.target.dataset.cost);

    if (e.target.checked) {
        activitiesCostValue += cost;
    } else {
        activitiesCostValue -= cost;
        if (activitiesCostValue <= 0) {
            activitiesCostValue = 0;
        }
    }

    disableConflictingActivities(e.target);

    activitiesCostElem.textContent = `Total: $${activitiesCostValue}`
})

/**
 * @function choosePaymentMethod
 * @param {number} - sets the chosen payment method index
 * @description chooses the payment method
 */
function choosePaymentMethod(paymentIndex) {
    chosenPaymentIndex = paymentIndex;
    chosenPaymentMethod = paymentOptions[paymentIndex].value;

    for (let i = 0; i < paymentMenus.length; i++) {
        if (paymentMenus[i]) {
            paymentMenus[i].style.display = "none";
            paymentMenus[chosenPaymentIndex].style.display = "block";
        }
    }
    paymentOptions[chosenPaymentIndex].selected = true;
}

// Display only payment chosen payment section:
selectPayment.addEventListener("change", (e) => {
    choosePaymentMethod(e.target.options.selectedIndex);
})

// Select the credit card paymentoption by default:
choosePaymentMethod(1);

// Helper functions:
/**
 * @function checkInput
 * @description check input element validation and display hint
 * @param {Element} - input element
 * @param {Boolean} - indicates the input validity
 */
function checkInput(inputElem, isValid) {
    let inputType = inputElem.getAttribute("type");
    let parent;
    let hint;
    
    if (inputType === "checkbox") {
        parent = activitiesField;
        hint = activitiesField.lastElementChild;
    } else {
        parent = inputElem.parentElement;
        hint = parent.lastElementChild;
    }

    if (isValid) {
        hint.style.display = "none";
        parent.classList.remove("not-valid");
        parent.classList.add("valid");
    } else {
        hint.style.display = "block";
        parent.classList.add("not-valid");
        parent.classList.remove("valid");
    }
}

/**
 * @function disableConflictingActivities
 * @param {Elem} activity - input element type checkbox containing the chosen activity
 * @description disables conflicting activities
 */
function disableConflictingActivities(activity) {
    let parent = activity.parentElement;
    let date = parent.querySelector(":nth-child(3)").textContent;

    parent.classList.remove("disabled");

    for (let i = 0; i < activities.length; i++) {
        let parent2 = activities[i].parentElement;
        let date2 = parent2.querySelector(":nth-child(3)").textContent;

        if (date === date2 && activities[i] !== activity && activity.checked === true) {
            parent2.classList.add("disabled");
            activities[i].checked = false;
        } else if (date === date2 && activities[i] !== activity && activity.checked === false) {
            parent2.classList.remove("disabled");
        }
    }
}

// Validation functions:
/**
 * @function validateName
 */
function validateName(name) {
    const nameRegEx = /\w+/;
    const isValid = nameRegEx.test(name);

    checkInput(inputName, isValid);

    return isValid;
}

/**
 * @function validateEmail
 */
function validateEmail(email) {
    const emailRegEx = /(\w+)(@)(\w+)(\.com)/i;
    const isValid = emailRegEx.test(email);
    const emailHint = document.getElementById("email-hint");

    if (inputEmail.value === "") {
        emailHint.textContent = "Email address cannot be blank";
    } else if (inputEmail.value !== "" && !isValid) {
        emailHint.textContent = "Email address must be formatted correctly";
    }

    checkInput(inputEmail, isValid);

    return isValid;
}

/**
 * @function checkActivities
 * @description Checks if at least one of the activities was checked
 */
function checkActivities(activities) {
    let isChecked = false;

    for (let i = 0; i < activities.length; i++) {
        if (activities[i].checked) {
            isChecked = true;
            checkInput(activities[i], isChecked);
            break;
        } else {
            isChecked = false;
            checkInput(activities[i], isChecked);
        }
    }

    return isChecked;
}

/**
 * @function validateCreditCard
 * @description Checks if all the credit card input are valid
 */
function validateCreditCard() {
    let isValidCCnum = /^(\d{13,16}$)/.test(creditCardNumber.value);
    let isValidCCzip = /^(\d{5}$)/.test(creditCardZip.value);
    let isValidCCcvv = /^(\d{3}$)/.test(creditCardCvv.value);

    if (chosenPaymentMethod === "credit-card") {
        let isValid = false;

        // Check each field and return hint if needed:
        checkInput(creditCardNumber, isValidCCnum);
        checkInput(creditCardZip, isValidCCzip);
        checkInput(creditCardCvv, isValidCCcvv);

        (isValidCCnum && isValidCCzip && isValidCCcvv) ? isValid = true : isValid = false;

        return isValid;
    }
}

// Form validation:
form.addEventListener("change", (e) => {
    let isValidName = validateName(inputName.value);
    let isValidEmail = validateEmail(inputEmail.value);
    let activityIsChecked = checkActivities(activities);
    let isValidCC = validateCreditCard();

    validateName(inputName.value);
    validateEmail(inputEmail.value);
    checkActivities(activities);
    validateCreditCard();

    if (!isValidName || !isValidEmail || !isValidCC || !activityIsChecked) {
        e.preventDefault();
    }
});

// Add proper focus on activities select:
for (let i = 0; i < activities.length; i++) {
    activities[i].addEventListener("focus", (e) => {
        activities[i].parentNode.classList.add("focus");
    });
    activities[i].addEventListener("blur", (e) => {
        activities[i].parentNode.classList.remove("focus");
    });
}

// Real-time error messages
// Input listeners:
inputName.addEventListener("keyup", (e) => {
    validateName(e.target.value);
});

inputEmail.addEventListener("keyup", (e) => {
    validateEmail(e.target.value);
});