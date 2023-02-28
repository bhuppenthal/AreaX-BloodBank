
// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var helpers = require('handlebars-helpers')(); //helper package used to format date
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 39129;                 // Set a port number at the top so it's easy to change in the future


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
// app.js

app.get('/', function(req, res)
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
                return res.render('index', {data: patients, bloodtypes: bloodtypes});
            })    

            //res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query                                        // will process this file, before sending the finished HTML to the client.                                      // requesting the web site.

    app.post('/add-patient-ajax', function(req, res) 
    {
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

    app.delete('/delete-patient-ajax', function(req,res,next){
        let data = req.body;
        let PatientID = parseInt(data.id);
        let deleteTransfusionOrdersPatient = `DELETE FROM TransfusionOrders WHERE PatientID = ?`; //delete from intersection table first
        let deletePatient= `DELETE FROM Patients WHERE PatientID = ?`;                // then delete from own table
      
      
              // Run the 1st query
              db.pool.query(deleteTransfusionOrdersPatient, [PatientID], function(error, rows, fields){
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

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});