function showEditForm (TransfusionID, PatientName, NurseName, Date, Description, InfusionRate) {
    console.log("in show edit form transfusion order")
    document.getElementById("update-section").hidden = false;
    
    let TransfusionIDCell = document.getElementById("update-transfusion-id");
    TransfusionIDCell.value = TransfusionID;

    let PatientCell = document.getElementById("update-patientID");
    PatientCell.value = PatientName;

    let NurseCell = document.getElementById("update-nurseID");
    NurseCell.value = NurseName;

    let DateCell = document.getElementById("update-date-time");
    DateCell.value = Date;

    let DescriptionCell = document.getElementById("update-description");
    DescriptionCell.value = Description;

    let InfusionRateCell = document.getElementById("update-infusion-rate");
    InfusionRateCell.value = InfusionRate;
};