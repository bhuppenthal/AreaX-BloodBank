/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

// Get the objects we need to modify
let addNurseForm = document.getElementById('add-nurse-form-ajax');

// Modify the object
addNurseForm.addEventListener("submit", function(e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputExtension = document.getElementById("input-extension");
    
    // Get the values in the form fields
    let nameValue = inputName.value;
    let extensionValue = inputExtension.value;

    // Put the data in a JS object
    let data = {
        Name: nameValue,
        Extension: extensionValue
    }

    // Set up the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-nurse-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve this request
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the row to the table
            addRowToTable(xhttp.response);

            // Clear the fields in the form
            inputName.value = '';
            inputExtension.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the nurse input.");
            window.alert("There was an error with the nurse input.");
        }
    }

    // Send the request
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from a data object
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("nurses-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let NameCell = document.createElement("TD");
    let ExtensionCell = document.createElement("TD");
    let EditCell = document.createElement("TD");
    let DeleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.NurseID;
    NameCell.innerText = newRow.Name;
    ExtensionCell.innerText = newRow.Extension;

    EditButton = document.createElement("button");
    EditButton.innerHTML = "Edit";
    EditButton.onclick = function () {
        showNurseEditForm(newRow.NurseID, newRow.Extension)
    }
    EditCell.appendChild(EditButton);

    DeleteButton = document.createElement("button");
    DeleteButton.innerHTML = "Delete";
    DeleteButton.onclick = function() {
        deleteNurse(newRow.NurseID);
    };
    DeleteCell.appendChild(DeleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(NameCell);
    row.appendChild(ExtensionCell);
    row.appendChild(EditCell);
    row.appendChild(DeleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.NurseID);

    // Add the row to the table
    currentTable.appendChild(row);

    // adding new nurse to the drop down
    let selectMenu = document.getElementById("update-nurseID");
    let option = document.createElement("option");
    option.text = newRow.Name;
    option.value = newRow.NurseID;
    selectMenu.add(option);
}