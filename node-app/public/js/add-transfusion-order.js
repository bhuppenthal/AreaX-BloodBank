// Get the objects we need to modify
let addTransfusionOrderForm = document.getElementById('add-transfusion-order-form-ajax');

// Modify the objects we need
addTransfusionOrderForm.addEventListener("submit", function (e) {
    console.log("Registered an add transfusion order submit.") ;
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatientID = document.getElementById("input-patient");
    let inputNurseID = document.getElementById("input-nurse");
    let inputDateTime = document.getElementById("input-date-time");
    let inputDescription = document.getElementById("input-description");
    let inputInfusionRate = document.getElementById("input-infusion-rate");

    let bloodProducts = []
    for (let i = 0; i < 5; i++) {
        console.log("input-blood-product-id".concat('',i.toString()));
        let inputBloodProduct = document.getElementById("input-blood-product-id".concat('', i.toString()));
        if (inputBloodProduct.value === '') {
            break;
        }
        let inputVolume = document.getElementById("input-volume".concat('', i.toString()));

        bloodProducts.push({BloodProductID: inputBloodProduct.value,
                            VolumeValue: inputVolume.value});
    }
    if (bloodProducts.length === 0) {
        window.alert("Transfusion orders require at least one blood product.");
        return;
    }

    let Patients_Arr = inputPatientID.value.split(', ');
    let PatientIDValue = Patients_Arr[0]
    let Nurses_Arr = inputNurseID.value.split(', ');
    let NurseIDValue = Nurses_Arr[0]
    let DateTimeValue = inputDateTime.value;
    let DescriptionValue = inputDescription.value;
    let InfusionRateValue = inputInfusionRate.value;

    // Put our data we want to send in a javascript object
    let data = {
        PatientID: PatientIDValue,
        NurseID: NurseIDValue,
        Date: DateTimeValue,
        Description: DescriptionValue,
        InfusionRate: InfusionRateValue,
        BloodProducts: bloodProducts
    }
    console.log(`data sent: ${JSON.stringify(data)}`);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-transfusion-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(`Successful addition! here's rows: ${xhttp.response}`);
            console.log(`Extracting the fucking id: ${xhttp.response.newTransfusionID}`);
            console.log(`type ${typeof(xhttp.response)}`);

            addRowToOrderTable(JSON.parse(xhttp.response).newTransfusionID, data, Patients_Arr[1], Nurses_Arr[1]);
            inputPatientID.value = '';
            inputNurseID.value = '';
            inputDateTime.value = '';
            inputDescription.value = '';
            inputInfusionRate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            window.alert("There was an issue with the transfusion input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToOrderTable = (newTransfusionID, newRow, patient_name, nurse_name) => {
    console.log("addRowToTable call");
    console.log(`the new transfusion id: ${newTransfusionID}`);
    console.log(`the data i received: ${JSON.stringify(newRow)}`);
    let currentTable = document.getElementById("transfusion-orders-table");

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let PatientCell = document.createElement("TD");
    let NurseCell = document.createElement("TD");
    let DateTimeCell = document.createElement("TD");
    let DescriptionCell = document.createElement("TD");
    let InfusionRateCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newTransfusionID;
    PatientCell.innerHTML = `${patient_name}`;
    NurseCell.innerText = `${nurse_name}`;

    Date_Format = newRow.Date
    Date_Format_DMY = Date_Format.slice(0,10).split('-').reverse().join('-');
    Date_Format_HMS = " " + Date_Format.slice(11,19);
    DateTimeCell.innerText = Date_Format_DMY + Date_Format_HMS;

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

addRowToDetailsTable = (newTransfusionID, newRow, patientName, nurseName) => {
    console.log("adding new rows to the details table");

    let currentTable = document.getElementById("transfusion-details-table");

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let PatientCell = document.createElement("TD");
    let NurseCell = document.createElement("TD");
    let DateTimeCell = document.createElement("TD");
    let DescriptionCell = document.createElement("TD");
    let InfusionRateCell = document.createElement("TD");

    for (let i = 0; i < newRow.BloodProducts.length; i++) {

    }
}