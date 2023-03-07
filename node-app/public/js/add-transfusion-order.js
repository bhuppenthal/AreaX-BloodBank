// Get the objects we need to modify
let addTransfusionOrderForm = document.getElementById('add-transfusion-order-form-ajax');

// Modify the objects we need
addTransfusionOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatientID = document.getElementById("input-patient");
    let inputNurseID = document.getElementById("input-nurse");
    let inputDateTime = document.getElementById("input-date-time");
    let inputDescription = document.getElementById("input-description");
    let inputInfusionRate = document.getElementById("input-infusion-rate");
    let inputBloodProductID = document.getElementById("input-blood-product-id");
    let inputVolume = document.getElementById("input-volume");
    
    //Patients input has a string with the id and name in input, we'll split into array:
    let Patients_Arr = inputPatientID.value.split(', ');
    console.log(Patients_Arr);
    let PatientIDValue = Patients_Arr[0]
    // Get the values from the form fields
    // let PatientIDValue = inputPatientID.value;
    console.log(PatientIDValue)
    let Nurses_Arr = inputNurseID.value.split(', ');
    let NurseIDValue = Nurses_Arr[0]
    // let NurseIDValue = inputNurseID.value;
    console.log(NurseIDValue)
    let DateTimeValue = inputDateTime.value;
    let DescriptionValue = inputDescription.value;
    let InfusionRateValue = inputInfusionRate.value;
    let BloodProductIDValue = inputBloodProductID.value;
    let VolumeValue = inputVolume.value;

    // Put our data we want to send in a javascript object
    let data = {
        PatientID: PatientIDValue,
        NurseID: NurseIDValue,
        DateTime: DateTimeValue,
        Description: DescriptionValue,
        InfusionRate: InfusionRateValue,
        BloodProductID: BloodProductIDValue,
        Volume: VolumeValue  
    }
    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-transfusion-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            console.log(Patients_Arr[1], Nurses_Arr[1])
            // Add the new data to the table
            addRowToTable(xhttp.response, Patients_Arr[1], Nurses_Arr[1]);

            // Clear the input fields for another transaction
            inputPatientID.value = '';
            inputNurseID.value = '';
            inputDateTime.value = '';
            inputDescription.value = '';
            inputInfusionRate.value = '';
            inputBloodProductID.value = '';
            inputVolume.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data, patient_name, nurse_name) => {

    console.log("This is fron the addRowToTable function")
    console.log(patient_name, nurse_name)
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("transfusion-orders-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let PatientCell = document.createElement("TD");
    let NurseCell = document.createElement("TD");
    let DateTimeCell = document.createElement("TD");
    let DescriptionCell = document.createElement("TD");
    let InfusionRateCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.TransfusionID;
    // console.log(`${patient_name}`);
    PatientCell.innerHTML = `${patient_name}`;
    NurseCell.innerText = `${nurse_name}`;
    DateTimeCell.innerText = newRow.Date;
    DescriptionCell.innerText = newRow.Description;
    InfusionRateCell.innerText = newRow.InfusionRate;

    EditCell = document.createElement("TD");
    EditButton = document.createElement("button");
    EditButton.innerHTML = "Edit";
    EditButton.onclick = function () {
        editTransfusionOrder(newRow.TransfusionID);
    }
    EditCell.appendChild(EditButton);

    DeleteCell = document.createElement("TD");
    DeleteButton = document.createElement("button");
    DeleteButton.innerHTML = "Delete";
    DeleteButton.onclick = function() {
        deleteTransfusionOrder(newRow.TransfusionID);
    };
    DeleteCell.appendChild(DeleteButton);


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(PatientCell);
    row.appendChild(NurseCell);
    row.appendChild(DateTimeCell);
    row.appendChild(DescriptionCell);
    row.appendChild(InfusionRateCell);
    row.appendChild(EditCell);
    row.appendChild(DeleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.TransfusionID);

    // Add the row to the table
    currentTable.appendChild(row);
}