/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.

CITATION
The auto scroll section was adapted from the following code:
Source: Element.scrollIntoView() (https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
Author: MDN Web Docs 
Retrieved: 03/16/2023
*/

// displays update nurse form
function showNurseEditForm (NurseID, NurseExtension) {

    document.getElementById("update-section").hidden = false;

    let NurseIDCell = document.getElementById("update-nurseID");
    NurseIDCell.value = NurseID;

    let ExtensionCell = document.getElementById("update-extension");
    ExtensionCell.value = NurseExtension;

    // auto scroll down to form
    let nurseform = document.getElementById("update-nurse-form-ajax");
    nurseform.scrollIntoView();
}