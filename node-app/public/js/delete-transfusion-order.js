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

            // Add the new data to the table
            deleteRow(TransfusionID);
            deleteTransfusionDetailsRows(TransfusionID);
            // window.location.reload()    // reloads the page, uncomment to fix

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
            window.alert("This transfusion order could not be deleted.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    console.log(data)
    console.log(TransfusionID)
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
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == TransfusionID) {
                table.deleteRow(i);
                break;
            }
        };
}
    // window.location.reload(); - was commented out always
}

function deleteTransfusionDetailsRows(TransfusionID) {
    console.log("inside delete transfusion details rows")
    let table = document.getElementById("transfusion-details-table");

    row_index = 1;
    table_length = table.rows.length;
    console.log(`table length is ${table_length}`)
    // for (let i = 0, row; row = table.rows[i]; i++) {
    for (let i = 0; i < table_length; i++) {
        console.log(`i inside first for loop ${i}, row index is ${row_index}`)
        let table_row = table.getElementsByTagName("tr")[row_index];
        console.log(table_row);
        let TransfusionID_TD = table_row.getElementsByTagName('td')[0];
        console.log(TransfusionID_TD);
        //console.log(`TransfusionID_TD.innerHTML is: ${TransfusionID_TD.innerText}`)
        if (TransfusionID_TD !== undefined) {
            if (TransfusionID_TD.innerHTML === String(TransfusionID)) {
                console.log("inside if statement td innerhtml")
                // table_row.remove();
                table.deleteRow(row_index);
            } else {
                row_index = row_index + 1;
            }
        }
    }

    for (let i = 0, row; row = table.rows[i]; i++) {
        console.log(`i inside second for loop ${i})`)
        if (table.rows[i].getAttribute("data-value") == TransfusionID) {
            console.log(`inside the if statement from get attribute, i is ${i}`)
            // let updateRowIndex = table.getElementsByTagName("tr")[i];
            table.deleteRow(i);
        }
    }

};