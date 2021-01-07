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

// Helper functions:
/**
 * @function buildPaymentMenus
 * @description Creates a nodelist with all menu div elements
 * @param {NodeList} paymentOptions - nodelist with possible options of payment
 */
function buildPaymentMenus(paymentOptions) {
    let menus = [];
    for (let i = 0; i < paymentOptions.length; i++) {
        let menu = document.getElementById(paymentOptions[i].value);
        menus.push(menu);
    }

    return menus;
};

/**
 * @function checkInput
 * @description check input element validation and display hint
 * @param {Element} inputElem - input element
 * @param {Boolean} isValid - indicates the input validity
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
 * @description disables conflicting activities
 * @param {Elem} activity - input element type checkbox containing the chosen activity
 */
function disableConflictingActivities(activity) {
    let parent = activity.parentElement;
    let date = parent.querySelector(":nth-child(3)").textContent;
    let isDisabled = parent.classList.contains("disabled");
    let isChecked = activity.checked;

    if(!isDisabled) {
        for (let i = 0; i < activities.length; i++) {
            let activity2 = activities[i];
            let parent2 = activity2.parentElement;
            let date2 = parent2.querySelector(":nth-child(3)").textContent;
    
            if (date === date2 && activity !== activity2 && isChecked) {
                parent2.classList.add("disabled");
            } else if (date === date2 && activity !== activity2 && !isChecked) {
                parent2.classList.remove("disabled");
            }
        }
    } else {
        activity.checked = false;
    }
}

/**
 * @function choosePaymentMethod
 * @description chooses the payment method
 * @param {number} paymentIndex - number greater or equal to zero to set the chosen payment method
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
// End of helper functions and variables declarations

/**
 * Page functionalities:
 */

// Highlight name input when page first loads:
inputName.focus();

//Hide the other-job-role input by default:
inputOtherJob.style.display = "none";

//Listen to changes on select Job and show/hide input other job:
selectJob.addEventListener("change", (e) => {
    let selectedIndex = e.target.options.selectedIndex;
    let selectedOption = e.target[selectedIndex].value;

    if(selectedOption === "other") {
        inputOtherJob.style.display = "block"
    } else {
        inputOtherJob.style.display = "none";
    }
})

// Disable select color:
selectColor.disabled = true;

// Listen to change in selectDesgin and display available colors:
selectDesign.addEventListener("change", (e) => {
    let selectedIndex = e.target.options.selectedIndex;
    let selectedOption = e.target[selectedIndex].value;
    let options = document.querySelectorAll("option[data-theme]");

    selectColor.disabled = false;
    for ( let i = 0; i < options.length; i++) {
        let dataTheme = options[i].dataset.theme;

        if (selectedOption !== dataTheme) {
            options[i].hidden = true;
        } else {
            options[i].hidden = false;
        }
    }
    selectColor.options.selectedIndex = 0;
})

// Listen to change in the Activities fieldset
// disable conflicting activities and set the price:
activitiesField.addEventListener("change", (e) => {
    let cost = parseInt(e.target.dataset.cost);
    let isDisabled = e.target.parentElement.classList.contains("disabled");

    if (e.target.checked && !isDisabled) {
        activitiesCostValue += cost;
    } else if (!e.target.checked && !isDisabled) {
        activitiesCostValue -= cost;
    }

    disableConflictingActivities(e.target);

    activitiesCostElem.textContent = `Total: $${activitiesCostValue}`
})

// Display only the chosen payment chosen menu section:
selectPayment.addEventListener("change", (e) => {
    choosePaymentMethod(e.target.options.selectedIndex);
})

// Select the credit card payment option by default:
choosePaymentMethod(1);

// Validation functions:
/**
 * @function validateName
 * @description validates name input
 * @param {Element} inputName - input element for name value
 */
function validateName(name) {
    const nameRegEx = /\w+/;
    const isValid = nameRegEx.test(name);

    checkInput(inputName, isValid);

    return isValid;
}

/**
 * @function validateEmail
 * @description validates email input
 * @param {Element} inputEmail - input element for email value
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
 * @description Check if at least one of the activities was checked
 * @param {NodeList} activities - NodeList with all available activities
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
 * @description Check if all the credit card inputs are valid
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
// Check form fields validity on form submit event
form.addEventListener("submit", (e) => {
    let isValidName = validateName(inputName.value);
    let isValidEmail = validateEmail(inputEmail.value);
    let activityIsChecked = checkActivities(activities);

    if (!isValidName || !isValidEmail || !activityIsChecked) {
        e.preventDefault();
    }

    if (chosenPaymentMethod === "credit-card") {
        let isValidCC = validateCreditCard();

        if (!isValidCC) {
            e.preventDefault();
        }
    }
});

// Add proper focus on activities select:
// for tabbing navigation
for (let i = 0; i < activities.length; i++) {
    activities[i].addEventListener("focus", (e) => {
        activities[i].parentElement.classList.add("focus");
    });
    activities[i].addEventListener("blur", (e) => {
        activities[i].parentElement.classList.remove("focus");
    });
}

// Real-time error messages on name and email inputs
// Input listeners:
inputName.addEventListener("keyup", (e) => {
    validateName(e.target.value);
});

inputEmail.addEventListener("keyup", (e) => {
    validateEmail(e.target.value);
});