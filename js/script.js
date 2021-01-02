console.log('test');

//Global variables:
const inputName = document.getElementById("name");
const inputOtherJob = document.getElementById("other-job-role");

// Highlight name input when page first loads:
inputName.focus();

//Hides the other-job-role input by default:
inputOtherJob.style.display = "none";