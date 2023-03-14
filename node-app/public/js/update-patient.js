// Get the objects we need to modify
let updatePatientForm = document.getElementById('update-patient-form-ajax');

// Modify the objects we need
updatePatientForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updatePatientID = document.getElementById("update-patientID");
    let updateBirthDate = document.getElementById("update-birth-date");
    let updateMedicalRecordNumber = document.getElementById("update-medical-record-number");
    let updateBloodTypeID = document.getElementById("update-blood-type-id");

    // Get the values from the form fields
    let PatientIDValue = updatePatientID.value;
    let BirthDateValue = updateBirthDate.value;
    let MedicalRecordNumberValue = updateMedicalRecordNumber.value;
    let BloodTypeIDValue = updateBloodTypeID.value;
    
    if (isNaN(PatientIDValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        PatientID: PatientIDValue,
        BirthDate: BirthDateValue,
        MedicalRecordNumber: MedicalRecordNumberValue,
        BloodTypeID: BloodTypeIDValue
    }
    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-patient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, PatientIDValue);
            // window.location.reload()
            updatePatientID.value = '';
            updateBirthDate.value = '';
            updateMedicalRecordNumber.value = '';
            updateBloodTypeID.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
            window.alert("There was an issue with the update request.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    console.log(`JSON data: ${data}`);
})

function updateRow(data, PatientID){
    let parsedData = JSON.parse(data);
    console.log(`in update row parsedData = ${JSON.stringify(parsedData)}, PatientID = ${PatientID}`)
    // getting table using id name
    let table = document.getElementById("patients-table");
    // getting correct row using id name
    let row_by_id = document.getElementById(`row-${PatientID}`);

    if (row_by_id != null) {
        // updating each of the columns, [2] is Birthdate, [3] is MRN, [4] is BloodTypeID (indices the table rows)
        let BirthDate_td = row_by_id.getElementsByTagName('td')[2];
        BirthDate_td.innerHTML = parsedData[0].BirthDate.slice(0,10).split('-').reverse().join('-');

        let MRN_td = row_by_id.getElementsByTagName("td")[3];
        MRN_td.innerHTML = parsedData[0].MedicalRecordNumber;

        let BloodTypeID_td = row_by_id.getElementsByTagName('td')[4];
        BloodTypeID_td.innerHTML = parsedData[0].BloodTypeID;
    } else {

    for (let i = 0, row; row = table.rows[i]; i++) {
        console.log(`entered for loop, i is ${i}`);
        // iterate through rows
        // rows would be accessed using the "row" variable assigned in the for loop

        if (table.rows[i].getAttribute("data-value") == PatientID) {
            console.log(`i is ${i} inside if statement`);
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];


            let BirthDate_td = updateRowIndex.getElementsByTagName('td')[2];
            BirthDate_td.innerHTML = parsedData[0].BirthDate.slice(0,10).split('-').reverse().join('-');
    
            let MRN_td = updateRowIndex.getElementsByTagName("td")[3];
            MRN_td.innerHTML = parsedData[0].MedicalRecordNumber;
    
            let BloodTypeID_td = updateRowIndex.getElementsByTagName('td')[4];
            BloodTypeID_td.innerHTML = parsedData[0].BloodTypeID;



            // // Get td of update values
            // let td = updateRowIndex.getElementsByTagName("td")[3];
            // // console.log(`inside update row parsedData[0].MRN is: ${parsedData[0].MedicalRecordNumber}`)
            // // // Reassign homeworld to our value we updated to
            // td.innerHTML = parsedData[0].MedicalRecordNumber; 
        }
    }
    }
    document.getElementById("update-section").hidden = true;
    // window.location.reload();
}
