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
            // window.location.reload()    // reloads the page

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
    // window.location.reload();
}