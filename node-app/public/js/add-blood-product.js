/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

// Get the objects we need to modify
let addBloodProductForm = document.getElementById('add-blood-product-form-ajax');

// Modify the objects we need
addBloodProductForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProductTypeID = document.getElementById("input-product-type-id");
    let inputBloodTypeID = document.getElementById("input-blood-type-id");
    let inputDrawnDate = document.getElementById("input-drawn-date");
    let inputExpirationDate = document.getElementById("input-expiration-date");
    let inputDonorID = document.getElementById("input-donor-id")
    let inputVolume = document.getElementById("input-volume")

    // Get the values from the form fields
    let ProductTypeIDValue = inputProductTypeID.value;
    let BloodTypeIDValue = inputBloodTypeID.value;
    let DrawnDateValue = inputDrawnDate.value;
    let ExpirationDateValue = inputExpirationDate.value;
    let DonorIDValue = inputDonorID.value;
    let VolumeValue = inputVolume.value;

    // Put our data we want to send in a javascript object
    let data = {
        ProductTypeID: ProductTypeIDValue,
        BloodTypeID: BloodTypeIDValue,
        DrawnDate: DrawnDateValue,
        ExpirationDate: ExpirationDateValue,
        DonorID: DonorIDValue,
        Volume: VolumeValue
    }
    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-blood-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputProductTypeID.value = '';
            inputBloodTypeID.value = '';
            inputDrawnDate.value = '';
            inputExpirationDate.value = '';
            inputDonorID.value = '';
            inputVolume.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
            window.alert("There was an issue with the blood product input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single from blood products
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("blood-products-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let ProductTypeIDCell = document.createElement("TD");
    let BloodTypeIDCell = document.createElement("TD");
    let DrawnDateCell = document.createElement("TD");
    let ExpirationDateCell = document.createElement("TD");
    let DonorIDCell = document.createElement("TD");
    let VolumeCell = document.createElement("TD");

    //Drawn Date And Expiration Date Formatting
    Drawn_Date_Format = newRow.DrawnDate;
    Drawn_Date_Format_DMY = Drawn_Date_Format.slice(0,10).split('-').reverse().join('-');
    Drawn_Date_Format_HMS = " " + Drawn_Date_Format.slice(11,19);

    Exp_Date_Format = newRow.ExpirationDate;
    Exp_Date_Format_DMY = Exp_Date_Format.slice(0,10).split('-').reverse().join('-');
    Exp_Date_Format_HMS = " " + Exp_Date_Format.slice(11,19);

    // Fill the cells with correct data
    idCell.innerText = newRow.BloodProductID;
    ProductTypeIDCell.innerText = newRow.ProductTypeID;
    BloodTypeIDCell.innerText = newRow.BloodTypeID;
    DrawnDateCell.innerText = Drawn_Date_Format_DMY + Drawn_Date_Format_HMS;
    ExpirationDateCell.innerText = Exp_Date_Format_DMY + Exp_Date_Format_HMS;
    DonorIDCell.innerText = newRow.DonorID;
    VolumeCell.innerText = newRow.Volume;


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(ProductTypeIDCell);
    row.appendChild(BloodTypeIDCell);
    row.appendChild(DrawnDateCell);
    row.appendChild(ExpirationDateCell);
    row.appendChild(DonorIDCell);
    row.appendChild(VolumeCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.BloodProductID);

    // Add the row to the table
    currentTable.appendChild(row);
}