// Get the objects we need to modify
let addNurseForm = document.getElementById('add-nurse-form-ajax');

// Modify the object
addNurseForm.addEventListener("submit", function(e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputExtension = document.getElementById("input-extension");

    console.log(`Nurse name is ${inputName}`);
    console.log(`Nurse extension is ${inputExtension}`);
    
    // Get the values in the form fields
    let nameValue = inputName.value;
    let extensionValue = inputExtension.value;

    // Debugging purposes
    console.log(`Nurse name is ${nameValue}`);
    console.log(`Nurse extension is ${extensionValue}`);

    // Put the data in a JS object
    let data = {
        Name: nameValue,
        Extension: extensionValue
    }
    console.log(data)

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
            inputName = '';
            inputExtension = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the nurse input.");
        }
    }

    // Send the request
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from a data object
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("nurses_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
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

    EditCell = document.createElement("button");
    EditCell.innerHTML = "Edit";
    EditCell.onclick = function () {
        editPatient(newRow.PatientID)
    }

    DeleteCell = document.createElement("button");
    DeleteCell.innerHTML = "Delete";
    DeleteCell.onclick = function() {
        deletePatient(newRow.PatientID);
    };

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
}