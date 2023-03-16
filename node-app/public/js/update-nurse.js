// get the Nurse we need to modify
let updateNurseForm = document.getElementById("update-nurse-form-ajax");

// modify the nurse object
updateNurseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // fetch the nurse data
    let inputNurseID = document.getElementById("update-nurseID");
    let inputExtension = document.getElementById("update-extension");

    // get the values from the form fields
    let NurseIDValue = inputNurseID.value;
    let ExtensionValue = inputExtension.value;

    if (isNaN(NurseIDValue)) {
        return;
    }

    // package data into a javascript object
    let data = {
        NurseID: NurseIDValue,
        Extension: ExtensionValue
    }
    console.log(`nurse to update ${data}`);
    console.log(data);

    // set up the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-nurse-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // add the data to the table
            updateRow(xhttp.response, NurseIDValue);
            // window.location.reload();
            inputNurseID.value = '';
            inputExtension.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input or request.");
            window.alert("This nurse could not be updated.");
        }
    }

    // send the request and receive the response
    xhttp.send(JSON.stringify(data));
    console.log(`JSON data: ${data}`);
})

function updateRow(data, NurseID) {

    console.log("in updateRow")
    let parsedData = JSON.parse(data);

    let table = document.getElementById("nurses-table");
    let row_by_id = document.getElementById(`row-${NurseID}`)

    if (row_by_id !== null){
        console.log("inside row by id is not null")
        // index [2] is the extension col
        let Extension_td = row_by_id.getElementsByTagName('td')[2];
        Extension_td.innerHTML = parsedData[0].Extension;
    } else {
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (table.rows[i].getAttribute("data-value") == NurseID) {
                let updateRowIndex = table.getElementsByTagName("tr")[i];
                let Extension_td = updateRowIndex.getElementsByTagName("td")[2];
                Extension_td.innerHTML = parsedData[0].Extension;
                console.log("in the for loop");
            }
        }
    };
    document.getElementById("update-section").hidden = true;
    // window.location.reload();
}