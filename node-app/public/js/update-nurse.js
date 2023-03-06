// get the Nurse we need to modify
let updateNurseForm = document.getElementById('update-nurse-form-ajax');

// modify the nurse object
updateNurseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // fetch the nurse data
    let inputNurseID = document.getElementById("update-nurseID");
    let inputExtension = document.getElementById("update-extension");

    // get the values from the form fields
    let NurseIDValue = inputNurseID.value;
    let ExtensionValue = inputExtension.value;

    if (isNaN(NurseIDValue)) {
        return;
    }

    // package data into a javascript object
    let data = {
        NurseID: NurseIDValue,
        Extension: ExtensionValue
    }
    console.log(`nurse to update ${data}`);
})