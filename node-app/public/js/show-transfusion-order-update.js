/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

// displays update transfusion form and autopopulates with values from row
function showEditForm (TransfusionID, PatientName, NurseName, Date, Description, InfusionRate) {

    document.getElementById("update-section").hidden = false;

    let TransfusionIDCell = document.getElementById("update-transfusion-id");
    TransfusionIDCell.value = TransfusionID;

    let DateCell = document.getElementById("update-date-time");
    DateCell.value = Date;

    let DescriptionCell = document.getElementById("update-description");
    DescriptionCell.value = Description;

    let InfusionRateCell = document.getElementById("update-infusion-rate");
    InfusionRateCell.value = InfusionRate;

    let data = {
        PatientName: PatientName,
        NurseName: NurseName
    }

    // if patient or nurse is deleted, unable to process request
    if (data.PatientName === 'DELETED' || data.NurseName === 'DELETED') {
        window.alert("Unable to update entry with deleted nurse or patient");
        window.location.reload();
        return;
    }


    // Setup our AJAX request to retrieve the NurseID and PatientID to autopopulate form
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/show-transfusion-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // using values from response to autopopulate the form
            response = JSON.parse(xhttp.response);
            PatientID = response.newPatientID;
            NurseID = response.newNurseID;

            let PatientCell = document.getElementById("update-patientID");
            PatientCell.value = `${PatientID}, ${PatientName}`;
        
            let NurseCell = document.getElementById("update-nurseID");
            NurseCell.value = `${NurseID}, ${NurseName}`;
    
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the request.");
        }
    }
      // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    // auto scroll down to form
    let transfusionform = document.getElementById("update-transfusion-order-form-ajax");
    transfusionform.scrollIntoView();

};