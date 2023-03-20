/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

function deleteNurse(NurseID) {
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
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input or request.");
            window.alert("This nurse could not be deleted.");
        }
    }
    
    // send the request
    xhttp.send(JSON.stringify(data));
}

// removing nurse from the table
function deleteRow(NurseID) {

    let table = document.getElementById("nurses-table");

    //getting the correct row using idname
    let row_by_id = document.getElementById(`row-${NurseID}`);

    // if row ID is available, obtain row to delete from ID otherwise obtain row from "getAttribute"
    if (row_by_id !== null) {
        let row_index = row_by_id.rowIndex;
        table.deleteRow(row_index);
        deleteDropDownMenu(NurseID);
    } else {
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (table.rows[i].getAttribute("data-value") == NurseID) {
                console.log("inside the table for loop")
                table.deleteRow(i);
                deleteDropDownMenu(NurseID);
                break;
            }
        }
    }
}

// remove nurse from the drop down menu
function deleteDropDownMenu(nurseID) {
    let selectMenu = document.getElementById("update-nurseID");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(nurseID)) {
            selectMenu[i].remove();
            break;
        }
    }
}