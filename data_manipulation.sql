-- SELECT QUERIES
SELECT * FROM Patients;
SELECT * FROM Nurses;
SELECT * FROM BloodProducts;
SELECT * FROM ProductTypes;
SELECT * FROM BloodTypes;
SELECT * FROM TransfusionOrders;

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

-- DELETE QUERY
DELETE FROM Patients
WHERE PatientID = _patientID;

DELETE FROM TransfusionOrders
WHERE TransfusionID = _transfusionID;