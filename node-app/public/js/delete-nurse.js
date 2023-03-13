function deleteNurse(NurseID) {
    console.log("deleteNurse function");
    let data = {
        id: NurseID
    };

    // set up the ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-nurse-ajax");
    xhttp.setRequestHeader("Content-type", "application/json");

    // set up resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // update the DOM
            deleteRow(NurseID);
            // window.location.reload();
        } else {
            console.log("There was an error with the input or request.");
            // window.alert("This nurse could not be deleted.");
        }
    }
    
    // send the request
    xhttp.send(JSON.stringify(data));
}

function deleteRow(NurseID) {
    console.log("in nurse delete row function")
    let table = document.getElementById("nurses-table");

    //getting the correct row using idname
    let row_by_id = document.getElementById(`row-${NurseID}`);

    if (row_by_id != null) {
        let row_index = row_by_id.rowIndex;
        console.log(`row index is ${row_index}`);
        table.deleteRow(row_index);
    } else {
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (table.rows[i].getAttribute("data-value") == NurseID) {
                console.log("inside the table for loop")
                table.deleteRow(i);
                break;
            }
        }
}
    // window.location.reload();
}