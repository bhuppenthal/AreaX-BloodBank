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

INSERT INTO BloodTypes

INSERT INTO Nurses

INSERT INTO Patients

INSERT INTO ProductTypes

INSERT INTO TransfusionDetails

INSERT INTO TransfusionOrders

-- UPDATE QUERY

-- DELETE QUERY
