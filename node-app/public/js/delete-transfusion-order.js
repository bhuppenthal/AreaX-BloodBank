/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

function deleteTransfusionOrder(TransfusionID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: TransfusionID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-transfusion-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // remove rows from tables
            deleteRow(TransfusionID);
            deleteTransfusionDetailsRows(TransfusionID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
            window.alert("This transfusion order could not be deleted.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(TransfusionID){

    let table = document.getElementById("transfusion-orders-table");

    // getting row by id if no attribute is listed
    let row_by_id = document.getElementById(`row-${TransfusionID}`);

    if (row_by_id !== null) {
        let row_index = row_by_id.rowIndex;
        table.deleteRow(row_index);
    } else {
    // other wise the row will have an attribute set from "add-transfusion-order" 
    // and can use the attribute to find correct row
        for (let i = 0, row; row = table.rows[i]; i++) {
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == TransfusionID) {
                table.deleteRow(i);
                break;
            }
        };
    }

}

// Removing rows from transfusion details table
function deleteTransfusionDetailsRows(TransfusionID) {

    let table = document.getElementById("transfusion-details-table");

    // iterate through each row (skipping header) and access first cell to check if the row contains
    // the transfusionID of the value we want to remove from table
    row_index = 1;
    table_length = table.rows.length;

    for (let i = 0; i < table_length; i++) {

        let table_row = table.getElementsByTagName("tr")[row_index];
        let TransfusionID_TD = table_row.getElementsByTagName('td')[0];
        if (TransfusionID_TD !== undefined) {
            if (TransfusionID_TD.innerHTML === String(TransfusionID)) {
                table.deleteRow(row_index);
            } else {
                row_index = row_index + 1;
            }
        }
    }

    // check the get attribute value to see if its the correct row to remove
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == TransfusionID) {
            table.deleteRow(i);
        }
    }

};