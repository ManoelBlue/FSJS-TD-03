console.log('test');

//Global variables:
const inputName = document.getElementById("name");
const inputOtherJob = document.getElementById("other-job-role");
const selectJob = document.getElementById("title");
const selectColor = document.getElementById("color");
const selectDesign = document.getElementById("design");

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