-- test the transfusion order query
SELECT TransfusionOrders.TransfusionID, Patients.Name AS PatientName, Nurses.Name AS NurseName, TransfusionOrders.Date, TransfusionOrders.Description, TransfusionOrders.InfusionRate
FROM TransfusionOrders
LEFT JOIN Patients ON EXISTS(SELECT TransfusionOrders.PatientID INTERSECT SELECT Patients.PatientID)
LEFT JOIN Nurses ON EXISTS(SELECT TransfusionOrders.NurseID INTERSECT SELECT Nurses.NurseID);

-- test the transfusion detail query
SELECT TransfusionOrders.TransfusionID, Patients.Name AS PatientName, Nurses.Name AS NurseName, BloodProducts.ProductTypeID, BloodProducts.BloodTypeID, TransfusionDetails.Volume, TransfusionOrders.InfusionRate
FROM TransfusionOrders
INNER JOIN Patients ON TransfusionOrders.PatientID = Patients.PatientID
INNER JOIN Nurses ON TransfusionOrders.NurseID = Nurses.NurseID
INNER JOIN TransfusionDetails ON TransfusionOrders.TransfusionID = TransfusionDetails.TransfusionID
INNER JOIN BloodProducts ON TransfusionDetails.BloodProductID = BloodProducts.BloodProductID
ORDER BY TransfusionOrders.TransfusionID ASC;