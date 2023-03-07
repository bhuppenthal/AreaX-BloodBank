function deletePatient(PatientID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: PatientID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-patient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(PatientID);
            window.location.reload()    // reloads the page

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    console.log(data)
    console.log(PatientID)
}


function deleteRow(PatientID){

    let table = document.getElementById("patients-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == PatientID) {
            table.deleteRow(i);
            break;
       }
    }
    window.location.reload();
}