/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var helpers = require('handlebars-helpers')(); //helper package used to format date
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 55555;                 // Set a port number at the top so it's easy to change in the future


// Database
var db = require('./database/db-connector')

// Handlebars 
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('index');
    });

app.get('/patients', function(req, res)
    {  
        let query1 = "SELECT * FROM Patients;";               // Define our query
        
        let query2 = "SELECT * FROM BloodTypes"; // This query is used to populate the drop down so user can select BloodType


        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            // Save the patients
            let patients = rows;

            // Run the second query
            db.pool.query(query2, (error, rows, fields) =>{
                
                //Save the BloodTypes
                let bloodtypes = rows;
                return res.render('patient-view', {data: patients, bloodtypes: bloodtypes});
            })    
        })
    });

app.get('/nurses', function(req,res)
    {
        let query1 = "SELECT * FROM Nurses;";

        db.pool.query(query1, function(error, results, fields)
        {
            return res.render('nurse-view', {data: results})
        })
    })

app.get('/blood-products', function(req, res)
{  
    let query1 = "SELECT * FROM BloodProducts;";               // Define our query
    
    let query2 = "SELECT * FROM BloodTypes"; // This query is used to populate the drop down so user can select BloodType

    let query3 = "SELECT * FROM ProductTypes"; 

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        // Save the patients
        let patients = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) =>{
            
            //Save the BloodTypes
            let bloodtypes = rows;

            //Run third query
            db.pool.query(query3, (error, rows, fields) => {

                //Save the ProductTypes
                let producttypes = rows;

                return res.render('blood-products-view', {data: patients, bloodtypes: bloodtypes, producttypes: producttypes});
            })
        })    
    })
});


app.get('/blood-types', function(req, res) 
    {
        let query1 = "SELECT * FROM BloodTypes;";

        db.pool.query(query1, function(error, rows, fields){

            res.render('blood-types-view', {data: rows});
        })
});    

app.get('/product-types', function(req, res) 
    {
        let query1 = "SELECT * FROM ProductTypes;";

        db.pool.query(query1, function(error, rows, fields){

            res.render('product-types-view', {data: rows});
        })
});  

app.get('/transfusions', function(req, res) 
    {
        let query1 = "SELECT TransfusionOrders.TransfusionID, Patients.Name AS PatientName, Nurses.Name AS NurseName, BloodProducts.ProductTypeID, BloodProducts.BloodTypeID, TransfusionDetails.Volume, TransfusionOrders.InfusionRate FROM TransfusionOrders INNER JOIN Patients ON TransfusionOrders.PatientID = Patients.PatientID INNER JOIN Nurses ON TransfusionOrders.NurseID = Nurses.NurseID INNER JOIN TransfusionDetails ON TransfusionOrders.TransfusionID = TransfusionDetails.TransfusionID INNER JOIN BloodProducts ON TransfusionDetails.BloodProductID = BloodProducts.BloodProductID;";

        let query2 = "SELECT TransfusionOrders.TransfusionID, Patients.Name AS PatientName, Nurses.Name AS NurseName, TransfusionOrders.Date, TransfusionOrders.Description, TransfusionOrders.InfusionRate FROM TransfusionOrders INNER JOIN Patients ON TransfusionOrders.PatientID = Patients.PatientID INNER JOIN Nurses ON TransfusionOrders.NurseID = Nurses.NurseID;";

        // db.pool.query(query1, function(error, rows, fields){
        //     res.render('transfusions-view', {data: rows});
        //     console.log({data: rows});
        // })

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            // Save the transfusiondetails
            let transfusiondetails = rows;
            console.log(transfusiondetails);

            // Run the second query
            db.pool.query(query2, (error, rows, fields) =>{
                
                //Save the transfusion orders
                let transfusionorders = rows;
                console.log(transfusionorders);
                return res.render('transfusions-view', {data: transfusiondetails, transfusionorders: transfusionorders});
            })    

            //res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })    
});

app.post('/add-nurse-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Nurses (Name, Extension) VALUES ('${data.Name}', '${data.Extension}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Nurses
            query2 = `SELECT * FROM Nurses;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    PATIENT FORMS
*/
app.post('/add-patient-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let MedicalRecordNumber = parseInt(data.MedicalRecordNumber);
    if (isNaN(MedicalRecordNumber))
    {
        MedicalRecordNumber = 'NULL'
    }


    // Create the query and run it on the database
    query1 = `INSERT INTO Patients (Name, BirthDate, MedicalRecordNumber, BloodTypeID) VALUES ('${data.Name}', '${data.BirthDate}', ${MedicalRecordNumber}, '${data.BloodTypeID}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Patients
            query2 = `SELECT * FROM Patients;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-patient-ajax', function(req,res,next) {
    let data = req.body;
    let PatientID = parseInt(data.id);
    let deleteTransfusionOrdersPatient = `DELETE FROM TransfusionOrders WHERE PatientID = ?`; //delete from intersection table first
    let deletePatient= `DELETE FROM Patients WHERE PatientID = ?`;                // then delete from own table
    
    
            // Run the 1st query
            db.pool.query(deleteTransfusionOrdersPatient, [PatientID], function(error, rows, fields)
            {
                if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                else
                {
                    // Run the second query
                    db.pool.query(deletePatient, [PatientID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(204);
                        }
                    })
                }
})});

app.put('/put-patient-ajax', function(req,res,next) {
    console.log('Reached /put-patient-ajax');
    let data = req.body;
    
    let PatientID = parseInt(data.PatientID);
    let MedicalRecordNumber = parseInt(data.MedicalRecordNumber);
    
    let queryUpdatePatient = 
    `UPDATE Patients 
    SET BirthDate = '${data.BirthDate}', MedicalRecordNumber = ${MedicalRecordNumber}, BloodTypeID = '${data.BloodTypeID}'
    WHERE PatientID = ${PatientID};`;
    let selectPatient = `SELECT * FROM Patients WHERE PatientID = ?`
    
            // Run the 1st query
            db.pool.query(queryUpdatePatient, function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectPatient, [PatientID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

/*
    NURSE FORMS
*/
app.get('/nurses', function(req,res) {
    let query1 = "SELECT * FROM Nurses;";

    db.pool.query(query1, function(error, results, fields)
    {
        return res.render('nurse-view', {data: results})
    });
});
    
app.post('/add-nurse-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Nurses (Name, Extension) VALUES ('${data.Name}', '${data.Extension}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Nurses
            query2 = `SELECT * FROM Nurses;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.put("/put-nurse-ajax", function(req, res) {
    //pass for now
});

app.delete("/delete-nurse-ajax", function(req, res, next) {
    // pass for now
});

/*
    BLOOD PRODUCT FORMS
*/
app.post('/add-blood-product-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    console.log(data);
    // Create the query and run it on the database
    query1 = `INSERT INTO BloodProducts (ProductTypeId, BloodTypeID, DrawnDate, ExpirationDate, DonorID, Volume)
    VALUES  ('${data.ProductTypeID}', '${data.BloodTypeID}', '${data.DrawnDate}','${data.ExpirationDate}', '${data.DonorID}', '${data.Volume}');`;
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Nurses
            query2 = `SELECT * FROM BloodProducts;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    BLOOD TYPES FORMS
*/ 
app.post('/add-blood-type-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO BloodTypes (BloodTypeID) VALUES ('${data.BloodTypeID}');`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Nurses
            query2 = `SELECT * FROM BloodTypes;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/* 
    PRODUCT TYPES FORMS
*/
app.post('/add-product-type-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO ProductTypes (ProductTypeID) VALUES ('${data.ProductTypeID}');`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Nurses
            query2 = `SELECT * FROM ProductTypes;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
TRANSFUSION ORDER FORMS
*/


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
