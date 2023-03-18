/*
CITATION
Source: CS340 NodeJS starter app (github.com/osu-cs340-ecampus/nodejs-starter-app)
Author: George Kochera
Retrieved: 2/27/2023
This application was adapted from the boilerplate code provided in the CS340 starter app.
*/

/*
    SETUP
*/
PORT        = 55555;
var express = require('express');
var app     = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// Database
var db = require('./database/db-connector');

// Handlebars 
const { engine } = require('express-handlebars');
var helpers = require('handlebars-helpers')();
var exphbs = require('express-handlebars');     // Import express-handlebars
const { query } = require('express');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

let blood_product_rows = [0,1,2,3,4];

/*
    ROUTES
*/
app.get('/', function(req, res)
{
    res.render('index');
});

app.get('/patients', function(req, res)
{  
    // Select all information from the Patients and BloodTypes tables to display Patients table
    let query1 = "SELECT * FROM Patients;";
    
    let query2 = "SELECT * FROM BloodTypes";

    db.pool.query(query1, function(error, rows, fields){
        let patients = rows;

        // if the Patient does not have a recorded blood type, set to N/A here before returning
        for (let patient of patients) {
            if (patient.BloodTypeID === null) {
                patient.BloodTypeID = "N/A";
            }
        }

        db.pool.query(query2, (error, rows, fields) =>{
            let bloodtypes = rows;
            return res.render('patient-view', {data: patients, bloodtypes: bloodtypes});
        })    
    })
});

app.get('/nurses', function(req,res)
{
    // Select all rows from Nurses
    let query1 = "SELECT * FROM Nurses;";

    db.pool.query(query1, function(error, results, fields)
    {
        return res.render('nurse-view', {data: results})
    });
})

app.get('/blood-products', function(req, res)
{
    // Select all information from BloodProducts, BloodTypes, and ProductTypes to build blood product view
    let query1 = "SELECT * FROM BloodProducts;";
    
    let query2 = "SELECT * FROM BloodTypes";

    let query3 = "SELECT * FROM ProductTypes"; 

    db.pool.query(query1, function(error, rows, fields){

        let patients = rows;

        db.pool.query(query2, (error, rows, fields) =>{
            
            let bloodtypes = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let producttypes = rows;

                return res.render('blood-products-view', {data: patients, bloodtypes: bloodtypes, producttypes: producttypes});
            })
        })    
    })
});

app.get('/blood-types', function(req, res)
{
    // Select all rows from the BloodTypes table to display the blood type view
    let query1 = "SELECT * FROM BloodTypes;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('blood-types-view', {data: rows});
    });
});    

app.get('/product-types', function(req, res) 
{
    // Select all rows from the ProductTypes table to display the product type view
    let query1 = "SELECT * FROM ProductTypes;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('product-types-view', {data: rows});
    })
});  

app.get('/transfusions', function(req, res) 
{
    // Perform two queries to select all of the rows from the TransfusionOrder and TransfusionDetails tables.
    // Some information is required from Patients, Nurses, and BloodProducts to get string names to replace integer foreign keys.
    let getTransfusionDetails = 'SELECT TransfusionOrders.TransfusionID, Patients.Name AS PatientName, Nurses.Name AS NurseName, BloodProducts.ProductTypeID, BloodProducts.BloodTypeID, TransfusionDetails.Volume, TransfusionOrders.InfusionRate \
    FROM TransfusionOrders \
    LEFT JOIN Patients ON EXISTS(SELECT TransfusionOrders.PatientID INTERSECT SELECT Patients.PatientID) \
    LEFT JOIN Nurses ON EXISTS(SELECT TransfusionOrders.NurseID INTERSECT SELECT Nurses.NurseID) \
    INNER JOIN TransfusionDetails ON TransfusionOrders.TransfusionID = TransfusionDetails.TransfusionID \
    INNER JOIN BloodProducts ON TransfusionDetails.BloodProductID = BloodProducts.BloodProductID \
    ORDER BY TransfusionOrders.TransfusionID ASC;'

    let getTransfusionOrders = 'SELECT TransfusionOrders.TransfusionID, Patients.Name AS PatientName, Nurses.Name AS NurseName, TransfusionOrders.Date, TransfusionOrders.Description, TransfusionOrders.InfusionRate \
    FROM TransfusionOrders \
    LEFT JOIN Patients ON EXISTS(SELECT TransfusionOrders.PatientID INTERSECT SELECT Patients.PatientID) \
    LEFT JOIN Nurses ON EXISTS(SELECT TransfusionOrders.NurseID INTERSECT SELECT Nurses.NurseID);'
    
    let getPatients = "SELECT PatientID, Name FROM Patients;";

    let getNurses = "SELECT NurseID, Name FROM Nurses;";

    let getBloodProducts = "Select BloodProductID, ProductTypeID, BloodTypeID FROM BloodProducts;";

    db.pool.query(getTransfusionDetails, function(error, rows, fields){

        let transfusiondetails = rows;

        // if the Patient/Nurse has been deleted, deal with the row entry here
        for(let detail of transfusiondetails) {
            if (detail.PatientName === null) {
                detail.PatientName = "DELETED";
            }
            if (detail.NurseName === null) {
                detail.NurseName = "DELETED";
            }
        }

        db.pool.query(getTransfusionOrders, (error, rows, fields) =>{
            
            let transfusionorders = rows;
            for (let order of transfusionorders) {
                if (order.PatientName === null) {
                    order.PatientName = "DELETED";
                }
                if (order.NurseName === null) {
                    order.NurseName = "DELETED";
                }
            };

            db.pool.query(getPatients, (error, rows, fields) => {
                let patients = rows;
            
                db.pool.query(getNurses, (error, rows, fields) =>{
                    let nurses = rows;

                    db.pool.query(getBloodProducts, (error, rows, fields) => {
                        let bloodproducts = rows;

                        return res.render('transfusions-view', {transfusiondetails: transfusiondetails, transfusionorders: transfusionorders, patients: patients, nurses: nurses, bloodproducts: bloodproducts, bloodproductrows: blood_product_rows});
                    })
                })
            })
        })    
    })    
});



/*
    PATIENT FORMS
*/
app.post('/add-patient-ajax', function(req, res)
{
    let data = req.body;

    // Capture NULL values
    let MedicalRecordNumber = parseInt(data.MedicalRecordNumber);
    if (isNaN(MedicalRecordNumber))
    {
        MedicalRecordNumber = 'NULL'
    }
    let BloodTypeID = data.BloodTypeID;
    if (BloodTypeID !== 'NULL') {
        BloodTypeID = `'${data.BloodTypeID}'`
    } 

    // Create the query and run it on the database
    query1 = `INSERT INTO Patients (Name, BirthDate, MedicalRecordNumber, BloodTypeID) VALUES ('${data.Name}', '${data.BirthDate}', ${MedicalRecordNumber}, ${BloodTypeID});`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            query2 = `SELECT * FROM Patients;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-patient-ajax', function(req,res,next)
{
    // Delete row from the database where the primary key matches
    let data = req.body;
    let PatientID = parseInt(data.id);
    let deletePatient= `DELETE FROM Patients WHERE PatientID = ?`;
    
    db.pool.query(deletePatient, [PatientID], function(error, rows, fields)
    {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

app.put('/put-patient-ajax', function(req,res,next)
{
    // Update the row in Patients based on primary key
    let data = req.body;
    
    let PatientID = parseInt(data.PatientID);
    let MedicalRecordNumber = parseInt(data.MedicalRecordNumber);
    let BloodTypeID = data.BloodTypeID;
    if (BloodTypeID !=='NULL') {
        BloodTypeID = `'${data.BloodTypeID}'`
    } 
    
    let queryUpdatePatient = 
    `UPDATE Patients 
    SET BirthDate = '${data.BirthDate}', MedicalRecordNumber = ${MedicalRecordNumber}, BloodTypeID = ${BloodTypeID}
    WHERE PatientID = ${PatientID};`;

    let selectPatient = `SELECT * FROM Patients WHERE PatientID = ?`
    
    // Update the patient based on primary key
    db.pool.query(queryUpdatePatient, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Return the updated patient row
            db.pool.query(selectPatient, [PatientID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    NURSE FORMS
*/
app.post('/add-nurse-ajax', function(req, res) 
{
    // Insert data into the Nurse table
    let data = req.body;

    query1 = `INSERT INTO Nurses (Name, Extension) VALUES ('${data.Name}', '${data.Extension}');`;
    
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            // If there was no error, perform a SELECT * on Nurses and send back to the view
            query2 = `SELECT * FROM Nurses;`;
            
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put("/put-nurse-ajax", function(req, res)
{
    let data = req.body;

    let NurseID = parseInt(data.NurseID);
    let Extension = parseInt(data.Extension);

    let queryUpdateNurse =
    `UPDATE Nurses
    SET Extension = '${Extension}'
    WHERE NurseID = ${NurseID};`;

    let selectNurse = `SELECT * FROM Nurses WHERE NurseID = ?;`

    db.pool.query(queryUpdateNurse, function(error, rows, field) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectNurse, [NurseID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete("/delete-nurse-ajax", function(req, res, next)
{
    // Delete a nurse by primary key
    let data = req.body;

    let NurseID = parseInt(data.id);
    let deleteNurse = `DELETE FROM Nurses WHERE NurseID = ?;`

    db.pool.query(deleteNurse, [NurseID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

/*
    BLOOD PRODUCT FORMS
*/
app.post('/add-blood-product-ajax', function(req, res)
{
    // Add a new blood product to the BloodProduct table
    let data = req.body;

    query1 = `INSERT INTO BloodProducts (ProductTypeId, BloodTypeID, DrawnDate, ExpirationDate, DonorID, Volume)
    VALUES  ('${data.ProductTypeID}', '${data.BloodTypeID}', '${data.DrawnDate}','${data.ExpirationDate}', '${data.DonorID}', '${data.Volume}');`;

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            query2 = `SELECT * FROM BloodProducts;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/*
    BLOOD TYPES FORMS
*/ 
app.post('/add-blood-type-ajax', function(req, res) 
{
    // Create a new blood type
    let data = req.body;

    query1 = `INSERT INTO BloodTypes (BloodTypeID) VALUES ('${data.BloodTypeID}');`;

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            query2 = `SELECT * FROM BloodTypes;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/* 
    PRODUCT TYPES FORMS
*/
app.post('/add-product-type-ajax', function(req, res) 
{
    // Create a new product type
    let data = req.body;

    query1 = `INSERT INTO ProductTypes (ProductTypeID) VALUES ('${data.ProductTypeID}');`;

    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            query2 = `SELECT * FROM ProductTypes;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/*
TRANSFUSION ORDER FORMS
*/
app.post('/add-transfusion-order-ajax', function(req, res) 
{
    // Add a new transfusion order to the table, then perform a query to get the ID of the new transfusion order
    // Once the transfusion order ID has been retrieved, use it to add rows to the transfusion details table for
    // each blood product used in the transfusion.
    let data = req.body;

    queryTransfusionOrder = `INSERT INTO TransfusionOrders (PatientID, NurseID, Date, Description, InfusionRate)
    VALUES ('${data.PatientID}', '${data.NurseID}', '${data.Date}', '${data.Description}', '${data.InfusionRate}');`;

    queryTransfusionID = `SELECT TransfusionID
    FROM TransfusionOrders
    WHERE PatientID = ${data.PatientID} AND NurseID = ${data.NurseID} AND Date = '${data.Date}';`

    db.pool.query(queryTransfusionOrder, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else {
            db.pool.query(queryTransfusionID, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    let newTransfusionID = rows[0].TransfusionID;

                    let queryGetData = `SELECT TransfusionOrders.TransfusionID, BloodProducts.ProductTypeID, BloodProducts.BloodTypeID, TransfusionOrders.InfusionRate FROM TransfusionOrders INNER JOIN TransfusionDetails ON TransfusionOrders.TransfusionID = TransfusionDetails.TransfusionID INNER JOIN BloodProducts ON TransfusionDetails.BloodProductID = BloodProducts.BloodProductID WHERE TransfusionOrders.TransfusionID = ${newTransfusionID};`;

                    db.pool.query(queryGetData, function(error, rows, fields){

                        if (error) {
                            console.log(error);
                        } else {
                            // with the transfusion ID, loop through each blood product to add it to the details table
                            let queryTransfusionDetail = "";
                            let bloodProducts = data.BloodProducts;
                            for (let i = 0; i < data.BloodProducts.length; i++) {
                                queryTransfusionDetail = `INSERT INTO TransfusionDetails (TransfusionID, BloodProductID, Volume) VALUES (${newTransfusionID}, ${bloodProducts[i].BloodProductID}, ${bloodProducts[i].VolumeValue});`
                                db.pool.query(queryTransfusionDetail, function(error, rows, fields) {
                                    if (error) {
                                        console.log('Error with transfusion detail query');
                                    } else {
                                        //res.send({newTransfusionID: newTransfusionID});
                                    }
                                });
                            }
                        res.send({newTransfusionID: newTransfusionID});
                        }
                    });
                }
            });
        }
    });
})

app.delete("/delete-transfusion-order-ajax", function(req, res, next)
{
    // delete a transfusion order by ID and delete all related transfusion details
    let data = req.body;
    let TransfusionID = parseInt(data.id);
    let deleteTransfusionOrder = `DELETE FROM TransfusionOrders WHERE TransfusionID = ?;`

    db.pool.query(deleteTransfusionOrder, [TransfusionID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }});
});

app.post('/show-transfusion-order-ajax', function(req, res, next)
{
    // Select IDs from Patients and Nurses to match the names on the order
    let data = req.body;

    let NurseName = data.NurseName;
    let PatientName = data.PatientName;

    let queryGetNurseID = `SELECT NurseID FROM Nurses WHERE Name = '${NurseName}';`;
    let queryGetPatientID = `SELECT PatientID FROM Patients WHERE Name ='${PatientName}';`

    db.pool.query(queryGetNurseID, function(error, rows, fields){
        if (error){
            console.log(error);
        } else {
            let newNurseID = rows[0].NurseID;
            
            db.pool.query (queryGetPatientID, function(error, rows, fields){
                if (error){
                    console.log(error);
                } else {
                    let newPatientID = rows[0].PatientID;
                    res.send({newNurseID: newNurseID, newPatientID: newPatientID});
                }
            });
        }
    });
});

app.put('/put-transfusion-order-ajax', function(req,res,next)
{
    // Update a transfusion order by ID
    let data = req.body;
    
    let TransfusionID = parseInt(data.TransfusionID);
    let PatientID = parseInt(data.PatientID);
    let NurseID = parseInt(data.NurseID)
    let InfusionRate= parseInt(data.InfusionRate);
    
    let queryUpdateTransfusionOrder = `UPDATE TransfusionOrders SET PatientID = '${PatientID}', NurseID = '${NurseID}', Date = '${data.Date}', Description = '${data.Description}', InfusionRate = '${InfusionRate}' WHERE TransfusionID = '${TransfusionID}';`;

    let selectTransfusionOrder = `SELECT * FROM TransfusionOrders WHERE TransfusionID = ?`
    
    db.pool.query(queryUpdateTransfusionOrder, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(selectTransfusionOrder, [TransfusionID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});