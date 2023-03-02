
// Get the objects we need to modify
let updatePatientForm = document.getElementById('update-patient-form-ajax');

// Modify the objects we need
updatePatientForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatientID = document.getElementById("update-patientID");
    let inputBirthDate = document.getElementById("update-birth-date");
    let inputMedicalRecordNumber = document.getElementById("update-medical-record-number");
    let inputBloodTypeID = document.getElementById("update-blood-type-id");

    // Get the values from the form fields
    let PatientIDValue = inputPatientID.value;
    let BirthDateValue = inputBirthDate.value;
    let MedicalRecordNumberValue = inputMedicalRecordNumber.value;
    let BloodTypeIDValue = inputBloodTypeID.value;
    
    if (isNaN(PatientIDValue)) 
    {
        return;
    }

    if (isNaN(inputMedicalRecordNumber))
    {
        console.log("NaN medical record number");
        MedicalRecordNumberValue = "NULL";
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
            window.location.reload()

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(`JSON data: ${data}`);
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, PatientID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("patients-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == PatientID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
    window.location.reload()
}
