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

    // Patients input has a string with the id and name in input, we'll split into array:
    let Patients_Arr = updatePatientID.value.split(', ');
    console.log(Patients_Arr);
    let PatientIDValue = Patients_Arr[0]
    console.log(PatientIDValue)

    let Nurses_Arr = updateNurseID.value.split(', ');
    let NurseIDValue = Nurses_Arr[0]
    console.log(NurseIDValue)

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
    console.log(data)
    
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
            // window.location.reload()

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
    console.log(`in update row parsedData = ${JSON.stringify(parsedData)}, TransfusionID = ${TransfusionID}`)
    
    let table = document.getElementById("transfusion-orders-table");

    let row_by_id = document.getElementById(`row-${TransfusionID}`);

    if (row_by_id !== null) {
        console.log("inside row_by_id is not null")
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
            //iterate through rows
            console.log("inside for loop")
            //rows would be accessed using the "row" variable assigned in the for loop
            if (table.rows[i].getAttribute("data-value") == TransfusionID) {
                console.log(`iinside the if statement, TransfusionID is ${TransfusionID}`)
                // Get the location of the row where we found the matching person ID
                let updateRowIndex = table.getElementsByTagName("tr")[i];
                
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
    // window.location.reload();
}

function updateTransfusionDetailsRows(TransfusionID, patient_name, nurse_name, infusion_rate) {
    console.log("inside update transfusion details rows")
    let table = document.getElementById("transfusion-details-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == TransfusionID) {
            console.log("inside the if statement")
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let PatientName_td = updateRowIndex.getElementsByTagName('td')[1];
            PatientName_td.innerHTML = patient_name;
    
            let NurseName_td = updateRowIndex.getElementsByTagName('td')[2];
            NurseName_td.innerHTML = nurse_name;

            let InfusionRate_td = updateRowIndex.getElementsByTagName('td')[6];
            InfusionRate_td.innerHTML = infusion_rate;
        }

        let table_row = table.getElementsByTagName("tr")[i];
        console.log(table_row);
        let TransfusionID_TD = table_row.getElementsByTagName('td')[0];
        console.log(TransfusionID_TD);
        //console.log(`TransfusionID_TD.innerHTML is: ${TransfusionID_TD.innerText}`)
        if (TransfusionID_TD !== undefined) {
            if (TransfusionID_TD.innerHTML === TransfusionID) {
                console.log("inside if statement td innerhtml")

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