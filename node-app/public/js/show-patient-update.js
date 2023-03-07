function showEditForm (PatientID, BirthDate, MedicalRecordNumber, BloodTypeID) {
    console.log("in show edit form")
    document.getElementById("update-section").hidden = false;
    
    let PatientIDCell = document.getElementById("update-patientID");
    PatientIDCell.value = PatientID;

    let BirthDateCell = document.getElementById("update-birth-date");
    BirthDateCell.value = BirthDate;

    let MedicalRecordNumberCell = document.getElementById("update-medical-record-number");
    MedicalRecordNumberCell.value = MedicalRecordNumber;

    let BloodTypeIDCell = document.getElementById("update-blood-type-id");
    BloodTypeIDCell.value = BloodTypeID;
};