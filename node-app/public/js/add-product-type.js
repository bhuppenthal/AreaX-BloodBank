/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

// Get the objects we need to modify
let addProductTypeForm = document.getElementById('add-product-type-form-ajax');

// Modify the object
addProductTypeForm.addEventListener("submit", function(e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProductTypeID = document.getElementById("input-product-type-id");
    
    // Get the values in the form fields
    let productTypeIDValue = inputProductTypeID.value;

    // Put the data in a JS object
    let data = {
        ProductTypeID: productTypeIDValue
    }

    // Set up the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-product-type-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve this request
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the row to the table
            addRowToTable(xhttp.response, productTypeIDValue);

            // Clear the fields in the form
            inputProductTypeID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the blood type id input.");
            window.alert("There was an issue with the product type input.");
        }
    }

    // Send the request
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from a data object
addRowToTable = (data, productTypeIDValue) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("product-types-table");

    // Create a row and cell
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = productTypeIDValue;

    // Add the cells to the row 
    row.appendChild(idCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', productTypeIDValue);

    // Add the row to the table
    currentTable.appendChild(row);
}