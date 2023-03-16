/*
    Team Area X Blood Bankers
    Group 47
    Joanna Getek
    Brenda Huppenthal
*/

/* Disable foreign key checks to set up and populate all tables */
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

/* --- Creating Object Tables --- */
CREATE OR REPLACE TABLE BloodProducts (
    BloodProductID int AUTO_INCREMENT UNIQUE NOT NULL,
    ProductTypeID varchar(55) NOT NULL,
    BloodTypeID varchar(3) NOT NULL,
    DrawnDate datetime,
    ExpirationDate datetime,
    DonorID int NOT NULL,
    Volume int,
    PRIMARY KEY (BloodProductID),
    FOREIGN KEY (ProductTypeID) REFERENCES ProductTypes(ProductTypeID),
    FOREIGN KEY (BloodTypeID) REFERENCES BloodTypes(BloodTypeID)
);

CREATE OR REPLACE TABLE Patients (
    PatientID int AUTO_INCREMENT UNIQUE NOT NULL,
    Name varchar(55) UNIQUE NOT NULL,
    BirthDate date,
    MedicalRecordNumber int UNIQUE NOT NULL,
    BloodTypeID varchar(3),
    PRIMARY KEY (PatientID),
    FOREIGN KEY (BloodTypeID) REFERENCES BloodTypes(BloodTypeID)
);

CREATE OR REPLACE TABLE Nurses (
    NurseID int AUTO_INCREMENT UNIQUE NOT NULL,
    Name varchar(55) UNIQUE NOT NULL,
    Extension int UNIQUE,
    PRIMARY KEY (NurseID)
);

/* --- Creating Transaction Table --- */
CREATE OR REPLACE TABLE TransfusionOrders (
    TransfusionID int AUTO_INCREMENT UNIQUE NOT NULL,
    PatientID int,
    NurseID int,
    Date datetime NOT NULL,
    Description varchar(255),
    InfusionRate decimal NOT NULL,
    PRIMARY KEY (TransfusionID),
    CONSTRAINT PatientFK FOREIGN KEY (PatientID) REFERENCES Patients(PatientID) ON DELETE SET NULL,
    CONSTRAINT NurseFK FOREIGN KEY (NurseID) REFERENCES Nurses(NurseID) ON DELETE SET NULL
);

/* --- Creating Category Tables --- */
CREATE OR REPLACE TABLE ProductTypes (
    ProductTypeID varchar(55) UNIQUE NOT NULL,
    PRIMARY KEY (ProductTypeID)
);

CREATE OR REPLACE TABLE BloodTypes (
    BloodTypeID varchar(3) UNIQUE NOT NULL,
    PRIMARY KEY (BloodTypeID)
);

/* --- Creating Intersection Table --- */
CREATE OR REPLACE TABLE TransfusionDetails (
    TransfusionDetailID int UNIQUE NOT NULL AUTO_INCREMENT,
    TransfusionID int NOT NULL,
    BloodProductID int NOT NULL,
    Volume decimal NOT NULL,
    PRIMARY KEY (TransfusionDetailID),
    FOREIGN KEY (TransfusionID) REFERENCES TransfusionOrders(TransfusionID) ON DELETE CASCADE,
    FOREIGN KEY (BloodProductID) REFERENCES BloodProducts(BloodProductID)
);

/* --- Populating with sample data ---*/
INSERT INTO ProductTypes (ProductTypeID)
VALUES ('Packed Red Blood Cells'),
       ('Plasma'),
       ('Platelets'),
       ('Cryoprecipitate');

INSERT INTO BloodTypes (BloodTypeID)
VALUES ('AB+'),
       ('AB-'),
       ('O+'),
       ('O-'),
       ('A+'),
       ('A-'),
       ('B+'),
       ('B-');

INSERT INTO Patients (Name, BirthDate, MedicalRecordNumber, BloodTypeID)
VALUES ('Edmond Phillips', '1976-02-02', 23509120, (SELECT BloodTypeID FROM BloodTypes WHERE BloodTypeID = 'A-')),
       ('Elena Padilla', '2019-09-20', 20083118, (SELECT BloodTypeID FROM BloodTypes WHERE BloodTypeID = 'O+')),
       ('Maribelle Washington', '1923-03-23', 57912188, (SELECT BloodTypeID FROM BloodTypes WHERE BloodTypeID = 'AB+')),
       ('Eugene Anderson', '1951-08-07', 61083444, (SELECT BloodTypeID FROM BloodTypes WHERE BloodTypeID = 'A+'));

INSERT INTO Nurses (Name, Extension)
VALUES ('Joey Lee', 54017),
       ('Donny Bactol', 32101),
       ('Beth Wiendels', 59990),
       ('Brittany Hansen', 78123);

INSERT INTO BloodProducts (BloodProductID, ProductTypeID, BloodTypeID, DrawnDate, ExpirationDate, DonorID, Volume)
VALUES (1, (SELECT ProductTypeID FROM ProductTypes WHERE ProductTypeID = 'Packed Red Blood Cells'), (SELECT BloodTypeID FROM BloodTypes WHERE BloodTypeID = 'A-'), '2023-01-12 13:34:22', '2023-04-12 13:34:22', 2309971, 325),
       (2, (SELECT ProductTypeID FROM ProductTypes WHERE ProductTypeID = 'Platelets'), (SELECT BloodTypeID FROM BloodTypes WHERE BloodTypeID = 'AB+'), '2023-01-14 08:10:12', '2023-04-14 08:10:12', 3310317, 375),
       (3, (SELECT ProductTypeID FROM ProductTypes WHERE ProductTypeID = 'Plasma'), (SELECT BloodTypeID FROM BloodTypes WHERE BloodTypeID = 'A+'), '2023-01-29 09:44:10', '2023-04-29 09:44:10', 8210871, 220),
       (4, (SELECT ProductTypeID FROM ProductTypes WHERE ProductTypeID = 'Packed Red Blood Cells'), (SELECT BloodTypeID FROM BloodTypes WHERE BloodTypeID = 'O+'), '2023-02-01 13:34:09', '2023-05-01 13:34:09', 3410041, 325);

INSERT INTO TransfusionOrders (TransfusionID, PatientID, NurseID, Date, Description, InfusionRate)
VALUES (1, (SELECT PatientID FROM Patients WHERE Name = "Edmond Phillips"), (SELECT NurseID FROM Nurses WHERE Name = "Donny Bactol"), '2023-01-29 12:05:44', NULL, 100.0),
       (2, (SELECT PatientID FROM Patients WHERE Name = "Maribelle Washington"), (SELECT NurseID FROM Nurses WHERE Name = "Donny Bactol"), '2023-01-02 17:05:23', NULL, 112.0),
       (3, (SELECT PatientID FROM Patients WHERE Name = "Eugene Anderson"), (SELECT NurseID FROM Nurses WHERE Name = "Beth Wiendels"), '2023-01-20 02:23:19', NULL, 98.0);

INSERT INTO TransfusionDetails (TransfusionID, BloodProductID, Volume)
VALUES (1, 1, 200),
       (1, 3, 100),
       (2, 1, 100);

/* The select queries below can be uncommented to view the sample data. */
/*
SHOW TABLES;
SELECT * FROM Patients;
SELECT * FROM Nurses;
SELECT * FROM BloodProducts;
SELECT * FROM ProductTypes;
SELECT * FROM BloodTypes;
SELECT * FROM TransfusionDetails;
SELECT * FROM TransfusionOrders;
*/

/* Reset foreign key checks to protect the integrity of the database. */
SET FOREIGN_KEY_CHECKS=1;
COMMIT;