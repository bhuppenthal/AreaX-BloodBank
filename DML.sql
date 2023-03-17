-- SELECT QUERIES
-- Queries to display entire table
SELECT * FROM Patients;
SELECT * FROM Nurses;
SELECT * FROM BloodProducts;
SELECT * FROM ProductTypes;
SELECT * FROM BloodTypes;
SELECT * FROM TransfusionOrders;

-- Queries to select nurses and patients on drop down display for transfusion_orders page.
SELECT PatientID, Name FROM Patients;
SELECT NurseID, Name FROM Nurses;

-- Queries to get the nurse and patient ID used to autopopulate the update transfusion order form
SELECT NurseID FROM Nurses WHERE Name = _nurseName;
SELECT PatientID FROM Patients WHERE Name =_patientName;

-- select the current volume of a blood product
SELECT Volume FROM BloodProductID WHERE BloodProductID = _bloodProductID;

-- select the data required to fill out the transfusion orders overview
SELECT TransfusionOrders.TransfusionID, Patients.Name, Nurses.Name, TransfusionOrders.Date, TransfusionOrders.Description, TransfusionOrders.InfusionRate
FROM TransfusionOrders
INNER JOIN Patients on TransfusionOrders.PatientID = Patients.PatientID
INNER JOIN Nurses ON TransfusionOrders.NurseID = Nurses.NurseID;

-- select the data required to fill out the line by line blood product totals on transfusion orders page
SELECT TransfusionOrders.TransfusionID, Patients.Name AS PatientName, Nurses.Name AS NurseName, BloodProducts.ProductTypeID, BloodProducts.BloodTypeID, TransfusionDetails.Volume, TransfusionOrders.InfusionRate
FROM TransfusionOrders
INNER JOIN Patients ON TransfusionOrders.PatientID = Patients.PatientId
INNER JOIN Nurses ON TransfusionOrders.NurseId = Nurses.NurseID
INNER JOIN TransfusionDetails ON TransfusionOrders.TransfusionID = TransfusionDetails.TransfusionID
INNER JOIN BloodProducts ON TransfusionDetails.BloodProductID = BloodProducts.BloodProductID;

-- INSERT QUERIES
INSERT INTO BloodProducts (ProductTypeId, BloodTypeID, DrawnDate, ExpirationDate, DonorID, Volume)
VALUES  (_productTypeId, _bloodTypeID, _drawnDate, _expirationDate, _donorID, _volume);

INSERT INTO BloodTypes (BloodTypeID)
VALUES (_bloodTypeID);

INSERT INTO Nurses (NurseID, Name)
VALUES (_nurseID, _name);

INSERT INTO Patients (PatientID, Name, BirthDate, MedicalRecordNumber, BloodTypeID)
VALUES (_patientID, _name, _birthDate, _medicalRecordNumber, _bloodTypeID);

INSERT INTO ProductTypes (ProductTypeID)
VALUES (_productTypeId);

INSERT INTO TransfusionDetails (TransfusionDetailID, TransfusionID, BloodProductID, Volume)
VALUES (_transfusionDetailID, _transfusionID, _bloodproductID, _volume);

INSERT INTO TransfusionOrders (TransfusionID, PatientID, NurseID, Date, Description, InfusionRate)
VALUES (_transfusionID, _patientID, _nurseID, _date, _description, _infusionRate);

-- UPDATE QUERY
UPDATE Patients SET BloodTypeID = NULL WHERE BloodTypeID = _bloodTypeID;

-- update patient based on submission of the edit patient form 
UPDATE Patients 
SET Name = _name, BirthDate = _birthDate, MedicalRecordNumber = _medicalRecordNumber, BloodTypeID = _bloodTypeID 
WHERE PatientID = _patientID;

-- update patient blood type to null
UPDATE Patients
SET BloodTypeID = NULL
WHERE PatientID = _patientID;

-- update transfusion order based on submission of edit transfusion form
UPDATE TransfusionOrders
SET PatientID = _patientID, NurseID = _nurseID, Date = _date, Description = _description, InfusionRate = _infusionRate
WHERE TransfusionID = _transfusionID

--update volume of a blood product due to a transfusion order
UPDATE BloodProducts
SET Volume = _volume
WHERE BloodProductID = _bloodproductID;

-- DELETE QUERIES
DELETE FROM Patients
WHERE PatientID = _patientID;

DELETE FROM TransfusionOrders
WHERE TransfusionID = _transfusionID;