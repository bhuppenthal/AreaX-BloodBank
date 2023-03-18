/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

// Get the objects we need to modify
let addPersonForm = document.getElementById('add-patient-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputBirthDate = document.getElementById("input-birth-date");
    let inputMedicalRecordNumber = document.getElementById("input-medical-record-number");
    let inputBloodTypeID = document.getElementById("input-blood-type-id");

    // Get the values from the form fields
    let NameValue = inputName.value;
    let BirthDateValue = inputBirthDate.value;
    let MedicalRecordNumberValue = inputMedicalRecordNumber.value;
    let BloodTypeIDValue = inputBloodTypeID.value;

    // Put our data we want to send in a javascript object
    let data = {
        Name: NameValue,
        BirthDate: BirthDateValue,
        MedicalRecordNumber: MedicalRecordNumberValue,
        BloodTypeID: BloodTypeIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputBirthDate.value = '';
            inputMedicalRecordNumber.value = '';
            inputBloodTypeID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
            window.alert("There was an error with the patient input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from patients
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("patients-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and td cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let NameCell = document.createElement("TD");
    let BirthDateCell = document.createElement("TD");
    let MedicalRecordNumberCell = document.createElement("TD");
    let BloodTypeIDCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.PatientID;
    NameCell.innerText = newRow.Name;
    BirthDateCell.innerText = newRow.BirthDate.slice(0,10).split('-').reverse().join('-');
    MedicalRecordNumberCell.innerText = newRow.MedicalRecordNumber;

    // if BloodTypeID is NULL, display as 'N/A' on table
    if (newRow.BloodTypeID !== null) {
        BloodTypeIDCell.innerText = newRow.BloodTypeID;
    } else {
        BloodTypeIDCell.innerText = "N/A"
    }

    EditCell = document.createElement("TD");
    EditButton = document.createElement("button");
    EditButton.innerHTML = "Edit";
    EditButton.onclick = function () {
        showEditForm(newRow.PatientID, newRow.BirthDate.slice(0,10), newRow.MedicalRecordNumber, newRow.BloodTypeID)
    }
    EditCell.appendChild(EditButton);

    DeleteCell = document.createElement("TD");
    DeleteButton = document.createElement("button");
    DeleteButton.innerHTML = "Delete";
    DeleteButton.onclick = function() {
        deletePatient(newRow.PatientID);
    };
    DeleteCell.appendChild(DeleteButton);


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(NameCell);
    row.appendChild(BirthDateCell);
    row.appendChild(MedicalRecordNumberCell);
    row.appendChild(BloodTypeIDCell);
    row.appendChild(EditCell);
    row.appendChild(DeleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.PatientID);

    // Add the row to the table
    currentTable.appendChild(row);

    // adding new patient to the drop down
    let selectMenu = document.getElementById("update-patientID");
    let option = document.createElement("option");
    option.text = newRow.Name;
    option.value = newRow.PatientID;
    selectMenu.add(option);

}