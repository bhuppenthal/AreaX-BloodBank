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

// displays and populates the update patient form
function showEditForm (PatientID, BirthDate, MedicalRecordNumber, BloodTypeID) {

    document.getElementById("update-section").hidden = false;
    
    let PatientIDCell = document.getElementById("update-patientID");
    PatientIDCell.value = PatientID;

    let BirthDateCell = document.getElementById("update-birth-date");
    BirthDateCell.value = BirthDate;

    let MedicalRecordNumberCell = document.getElementById("update-medical-record-number");
    MedicalRecordNumberCell.value = MedicalRecordNumber;

    let BloodTypeIDCell = document.getElementById("update-blood-type-id");
    BloodTypeIDCell.value = BloodTypeID;

    // auto scroll down to form
    let patientform = document.getElementById("update-patient-form-ajax");
    patientform.scrollIntoView();
};