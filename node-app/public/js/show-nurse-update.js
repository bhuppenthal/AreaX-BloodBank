function showNurseEditForm (NurseID, NurseExtension) {
    console.log(`show edit form for ${NurseID}`);

    document.getElementById("update-section").hidden = false;

    let NurseIDCell = document.getElementById("update-nurseID");
    NurseIDCell.value = NurseID;

    let ExtensionCell = document.getElementById("update-extension");
    ExtensionCell.value = NurseExtension;

    // auto scroll down to form
    let nurseform = document.getElementById("update-nurse-form-ajax");
    nurseform.scrollIntoView();
}