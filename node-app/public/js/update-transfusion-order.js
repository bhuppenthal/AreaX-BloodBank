/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
CITATION
The hidden form section was adapted from the following code:
Source: HTMLElement.hidden (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/hidden)
Author: MDN Web Docs 
Retrieved: 03/01/2023
*/

// Get the objects we need to modify
let updateTransfusionOrderForm = document.getElementById('update-transfusion-order-form-ajax');

// Modify the objects we need
updateTransfusionOrderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateTransfusionID = document.getElementById("update-transfusion-id");
    let updatePatientID = document.getElementById("update-patientID");
    let updateNurseID = document.getElementById("update-nurseID");
    let updateDateTime = document.getElementById("update-date-time");
    let updateDescription = document.getElementById("update-description");
    let updateInfusionRate = document.getElementById("update-infusion-rate");

    // Get the values from the form fields
    let TransfusionIDValue = updateTransfusionID.value;

    // Patient/Nurses input has a string with the id and name in input, we'll split into array:
    let Patients_Arr = updatePatientID.value.split(', ');
    let PatientIDValue = Patients_Arr[0]

    let Nurses_Arr = updateNurseID.value.split(', ');
    let NurseIDValue = Nurses_Arr[0]

    let DateTimeValue = updateDateTime.value;
    let DescriptionValue = updateDescription.value;
    let InfusionRateValue = updateInfusionRate.value;

    let data = {
        TransfusionID: TransfusionIDValue,
        PatientID: PatientIDValue,
        NurseID: NurseIDValue,
        Date: DateTimeValue,
        Description: DescriptionValue,
        InfusionRate: InfusionRateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-transfusion-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, TransfusionIDValue, Patients_Arr[1], Nurses_Arr[1]);
            updateTransfusionDetailsRows(TransfusionIDValue, Patients_Arr[1], Nurses_Arr[1], InfusionRateValue);

            // auto scroll up to table
            let transfusionordertable = document.getElementById("transfusion-orders-table");
            transfusionordertable.scrollIntoView();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
            window.alert("There was an issue with the update request.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    console.log(`JSON data: ${JSON.stringify(data)}`);
})

function updateRow(data, TransfusionID, patient_name, nurse_name){
    
    let parsedData = JSON.parse(data);
    let table = document.getElementById("transfusion-orders-table");
    let row_by_id = document.getElementById(`row-${TransfusionID}`);

    // obtaining row to update from either ID if available or getAttribute
    if (row_by_id !== null) {
        //updating each of the columns, [1] is PatientName, [2] is NurseName, [3] is Date, [4] Description and [5] Infusion Rate

        let PatientName_td = row_by_id.getElementsByTagName('td')[1];
        PatientName_td.innerHTML = patient_name;

        let NurseName_td = row_by_id.getElementsByTagName('td')[2];
        NurseName_td.innerHTML = nurse_name;

        let Date_Format = parsedData[0].Date
        let Date_Format_DMY = Date_Format.slice(0,10).split('-').reverse().join('-');
        let Date_Format_HMS = " " + Date_Format.slice(11,19);

        let Date_td = row_by_id.getElementsByTagName('td')[3];
        Date_td.innerHTML = Date_Format_DMY + Date_Format_HMS;

        let Description_td = row_by_id.getElementsByTagName('td')[4];
        Description_td.innerHTML = parsedData[0].Description;

        let InfusionRate_td = row_by_id.getElementsByTagName('td')[5];
        InfusionRate_td.innerHTML = parsedData[0].InfusionRate;
    } else {
        for (let i = 0, row; row = table.rows[i]; i++) {
            //rows would be accessed using the "row" variable assigned in the for loop
            if (table.rows[i].getAttribute("data-value") == TransfusionID) {

                // Get the location of the row where we found the matching person ID
                let updateRowIndex = table.getElementsByTagName("tr")[i];
                
                //updating each of the columns, [1] is PatientName, [2] is NurseName, [3] is Date, [4] Description and [5] Infusion Rate
                let PatientName_td = updateRowIndex.getElementsByTagName('td')[1];
                PatientName_td.innerHTML = patient_name;
        
                let NurseName_td = updateRowIndex.getElementsByTagName('td')[2];
                NurseName_td.innerHTML = nurse_name;

                let Date_Format = parsedData[0].Date
                let Date_Format_DMY = Date_Format.slice(0,10).split('-').reverse().join('-');
                let Date_Format_HMS = " " + Date_Format.slice(11,19);

                let Date_td = updateRowIndex.getElementsByTagName('td')[3];
                Date_td.innerHTML =  Date_Format_DMY + Date_Format_HMS;
        
                let Description_td = updateRowIndex.getElementsByTagName('td')[4];
                Description_td.innerHTML = parsedData[0].Description;
        
                let InfusionRate_td = updateRowIndex.getElementsByTagName('td')[5];
                InfusionRate_td.innerHTML = parsedData[0].InfusionRate;
                
            }
        }
    }
    document.getElementById("update-section").hidden = true;

}

// updating applicable rows in TransfusionDetails 
function updateTransfusionDetailsRows(TransfusionID, patient_name, nurse_name, infusion_rate) {

    let table = document.getElementById("transfusion-details-table");

    // obtaining row to update from either getAttribute if available
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == TransfusionID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let PatientName_td = updateRowIndex.getElementsByTagName('td')[1];
            PatientName_td.innerHTML = patient_name;
    
            let NurseName_td = updateRowIndex.getElementsByTagName('td')[2];
            NurseName_td.innerHTML = nurse_name;

            let InfusionRate_td = updateRowIndex.getElementsByTagName('td')[6];
            InfusionRate_td.innerHTML = infusion_rate;
        }

        // obtaining row to update by checking value in first cell and checking if it matches the TransfusionID
        let table_row = table.getElementsByTagName("tr")[i];
        let TransfusionID_TD = table_row.getElementsByTagName('td')[0];

        if (TransfusionID_TD !== undefined) {
            if (TransfusionID_TD.innerHTML === TransfusionID) {

                let PatientName_td = table_row.getElementsByTagName('td')[1];
                PatientName_td.innerHTML = patient_name;
        
                let NurseName_td = table_row.getElementsByTagName('td')[2];
                NurseName_td.innerHTML = nurse_name;

                let InfusionRate_td = table_row.getElementsByTagName('td')[6];
                InfusionRate_td.innerHTML = infusion_rate;
            }
        }
        
    }
};