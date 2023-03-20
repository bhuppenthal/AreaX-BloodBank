/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

// Get the objects we need to modify
let addBloodTypeForm = document.getElementById('add-blood-type-form-ajax');

// Modify the object
addBloodTypeForm.addEventListener("submit", function(e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBloodTypeID = document.getElementById("input-blood-type-id");
    
    // Get the values in the form fields
    let bloodTypeIDValue = inputBloodTypeID.value;

    // Put the data in a JS object
    let data = {
        BloodTypeID: bloodTypeIDValue
    }

    // Set up the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-blood-type-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve this request
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the row to the table
            addRowToTable(xhttp.response, bloodTypeIDValue);

            // Clear the fields in the form
            inputBloodTypeID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the blood type id input.");
            window.alert("There was an issue with the blood type input.");
        }
    }

    // Send the request
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from a data object
addRowToTable = (data, bloodTypeIDValue) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("blood-types-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Create a row and cell
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");

    // Fill the cell with correct data
    idCell.innerText = bloodTypeIDValue;

    // Add the cell to the row 
    row.appendChild(idCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', bloodTypeIDValue);

    // Add the row to the table
    currentTable.appendChild(row);
}