
// CITATION
// Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
// Author: George Kochera
// Retrieved: 2/27/2023
// This application was adapted from the boilerplate code provided in the CS340 starter app.

// Remove a patient from database
function deletePatient(PatientID) {

    // Put our data we want to send in a javascript object
    let data = {
        id: PatientID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-patient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(PatientID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
            window.alert("This patient could not be deleted.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Remove row from the table display
function deleteRow(PatientID){

    let table = document.getElementById("patients-table");

    // getting the correct row using idname or get attribute if id is not available

    let row_by_id = document.getElementById(`row-${PatientID}`);

    if (row_by_id !== null) {
        let row_index = row_by_id.rowIndex;
        table.deleteRow(row_index);
        deleteDropDownMenu(PatientID);
    } else {
        for (let i = 0, row; row = table.rows[i]; i++) {
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == PatientID) {
                table.deleteRow(i);
                deleteDropDownMenu(PatientID);
                break;
            }
        }
    }
}

// removing the patient from the drop down menu
function deleteDropDownMenu(patientID) {

    let selectMenu = document.getElementById("update-patientID");
    
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(patientID)) {
            selectMenu[i].remove();
            break;
        }
    }
}