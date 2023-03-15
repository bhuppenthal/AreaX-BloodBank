function showEditForm (TransfusionID, PatientName, NurseName, Date, Description, InfusionRate) {
    console.log("in show edit form transfusion order")
    document.getElementById("update-section").hidden = false;

    let TransfusionIDCell = document.getElementById("update-transfusion-id");
    TransfusionIDCell.value = TransfusionID;

    // let PatientCell = document.getElementById("update-patientID");
    // PatientCell.value = PatientName;

    // let NurseCell = document.getElementById("update-nurseID");
    // NurseCell.value = NurseName;

    let DateCell = document.getElementById("update-date-time");
    DateCell.value = Date;

    let DescriptionCell = document.getElementById("update-description");
    DescriptionCell.value = Description;

    let InfusionRateCell = document.getElementById("update-infusion-rate");
    InfusionRateCell.value = InfusionRate;

    let data = {
        PatientName: PatientName,
        NurseName: NurseName
    }

    // console.log(`in show edit form, patients are: ${JSON.stringify(patients)}`)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/show-transfusion-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(`Successful addition! here's rows: ${xhttp.response}`);

            response = JSON.parse(xhttp.response);
            PatientID = response.newPatientID;
            NurseID = response.newNurseID;

            let PatientCell = document.getElementById("update-patientID");
            PatientCell.value = `${PatientID}, ${PatientName}`;
        
            let NurseCell = document.getElementById("update-nurseID");
            NurseCell.value = `${NurseID}, ${NurseName}`;
    
        }
    }
      // Send the request and wait for the response
    console.log(JSON.stringify(data));
    xhttp.send(JSON.stringify(data));


};