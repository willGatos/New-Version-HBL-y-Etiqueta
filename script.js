// this source code used updated google sign in options 
// after the previous button is deprecated
window.onload = () => {
    gapiLoaded();
    gisLoaded()
}

var CLIENT_ID = '660421977408-t9eeagv3s23hmngalpeocjp4b6e5p6km.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAn2ZNSKkYvSkNvPfDJQkWKIhDrRSk_h7M';
let tokenClient;
let gapiInited = false;
let gisInited = false;
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive';
var signinButton = document.getElementsByClassName('signin')[0];
var signoutButton = document.getElementsByClassName('signout')[0];
var uploadButton = document.getElementsByClassName('upload')[0];
// this source code used updated google sign in options 
// after the previous button is deprecated
window.onload = () => {
    gapiLoaded();
    gisLoaded()
}




function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: ''
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        signinButton.style.display = 'block'
    }
}

signinButton.onclick = () => handleAuthClick()
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        signinButton.style.display = 'none';
        signoutButton.style.display = 'block';
        uploadButton.style.cursor = 'pointer';
        uploadButton.onclick = generatePDF();
        
        checkFolder()
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

signoutButton.onclick = () => handleSignoutClick()
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        signinButton.style.display = 'block'
        signoutButton.style.display = 'none'
    }
}

// check for a Backup Folder in google drive
function checkFolder() {
    gapi.client.drive.files.list({
        'q': 'name = "Backup Folder"',
    }).then(function (response) {
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                localStorage.setItem('parent_folder', file.id);
                console.log('Folder Available');
                // get files if folder available
                showList();
            }
        } else {
            // if folder not available then create
            createFolder();
        }
    })
}
function getParamsFromURL(){
    const urlParams = new URLSearchParams(window.location.search);
    const dataString = urlParams.get('data');
    const dataObject = JSON.parse(dataString);
    return(dataObject);
}
async function ejecutarOperacion(text) {
        
    document.getElementById('status').textContent = text;
  }
async function generatePDF() {
    
    var query = getParamsFromURL();
    
    console.log(query)
    // Assuming you have the following data
    const dates = new Date()
    const imageUrl = "./Logo.png";
    const headerData = 
    [
        { key: "totalWeight", description: "Peso Total: " + query.totalWeight },
        { key: "totalImport", description: "Importe Total: " + query.totalImport },
        { key: "packagesQuantity", description: "Cantidad de Paquetes: " + query.packagesQuantity },
        { key: "shipmentsAmount", description: "Cantidad de Ordenes: " + query.shipmentsAmount },
        { key: "date", description: `Fecha: ${dates.getDate()} - ${dates.getMonth()} - ${dates.getFullYear()}` },
      ];
  
    const merchandise = [
      {
        NoBultos: "No Bultos 1",
        Remitente: "Remitente 1",
        Destinatario: "Destinatario 1",
        Descripcion: "Descripcion 1",
        Peso: "Peso 1",
        Costo: "Costo 1",
        Tarifa: "Tarifa 1",
      },
      {
        NoBultos: "No Bultos 1",
        Remitente: "Remitente 1",
        Destinatario: "Destinatario 1",
        Descripcion: "Descripcion 1",
        Peso: "Peso 1",
        Costo: "Costo 1",
        Tarifa: "Tarifa 1",
      },
      {
        NoBultos: "No Bultos 1",
        Remitente: "Remitente 1",
        Destinatario: "Destinatario 1",
        Descripcion: "Descripcion 1",
        Peso: "Peso 1",
        Costo: "Costo 1",
        Tarifa: "Tarifa 1",
      },
      {
        NoBultos: "No Bultos 1",
        Remitente: "Remitente 1",
        Destinatario: "Destinatario 1",
        Descripcion: "Descripcion 1",
        Peso: "Peso 1",
        Costo: "Costo 1",
        Tarifa: "Tarifa 1",
      },
      // Add more merchandise objects here
    ];

    const pdf = new jsPDF("p", "mm", "a4");

    // Add image to the top center
    const img = await fetch(imageUrl).then((response) => response.blob());
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      pdf.addImage(base64Image, "PNG", (210 - 80) / 2, 10, 80, 30);
  

      const keyOrder = [
        { key: "NoBultos", description: "No. de Bultos: " },
        { key: "Remitente", description: "Remitente: " },
        { key: "Destinatario", description: "Destinatario: " },
        { key: "Descripcion", description: "Descripción: " },
        { key: "Peso", description: "Peso(Kg): " },
        { key: "Costo", description: "Costo: " },
        { key: "Tarifa", description: "Tarifa: " },
      ];


      // Add header
      let yOffset = 70;
      headerData.forEach((header) => {
        pdf.setFontSize(12);
        console.log(header.description)
        pdf.text(header.description, 10, yOffset);
        yOffset += 8;
      });
  
      yOffset += 10;
  
      // Add merchandise data
    const addMerchandiseData = (merch, yOffset) => {
        const xOffset = 10;
        keyOrder.forEach(({ key, description }) => {
          pdf.setFontSize(10);
          // Include the explanatory text before the value
          switch(key){
            case "NoBultos":
                pdf.text(description + merch.merchandise.packagesQuantity, xOffset, yOffset);
            break;

            case "Remitente":
                pdf.text(description + merch.sender.name + merch.sender.surnames, xOffset, yOffset);
            break;

            case "Destinatario":
                pdf.text(description + merch.receiver.name + merch.receiver.surnames, xOffset, yOffset);
            break;

            case "Descripcion":
                pdf.text(description + merch.merchandise.description, xOffset, yOffset);
            break;
            
            case "Peso":
                pdf.text(description + merch.merchandise.weight, xOffset, yOffset);
            break;
            
            case "Costo":
                pdf.text(description + merch.payment.toPay, xOffset, yOffset);
            break;

            case "Tarifa":
                pdf.text(description + merch.payment.toPay * 1.5 + 5, xOffset, yOffset);
            break;
          }
          
          yOffset += 6; // Decrease the space between fields
        });
        return yOffset + 8; // Adjust the space after each merchandise item
    };

    let pageCount = 0;
    for (let i = 0; i < query.HBL.length; i++) {
        if (i !== 0 && i % 3 === 0) {
          pageCount += 1;
          pdf.addPage();
          yOffset = 10;
        }
        yOffset = addMerchandiseData(query.HBL[i], yOffset);
      }
  
      const pdfBlob = pdf.output("blob");
      upload(pdfBlob);
    };
  }
  
// now create a function to upload file
async function upload(pdfData) {
    const metadata = {
        name: 'filename.pdf',
        mimeType: 'application/pdf',
    };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', new Blob([pdfData], {type: 'application/pdf'}));

    ejecutarOperacion("Cargando")
    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: 'POST',
        headers: new Headers({ "Authorization": "Bearer " + gapi.auth.getToken().access_token }),
        body: form
    })
    .then(res => {
        ejecutarOperacion("Operación Exitosa")
        console.log(res)})
    .catch(e => {
        ejecutarOperacion("ERROR, INTENTELO DE NUEVO O CONTACTENOS")
        console.log(e)
    })
  }

    //var worker = html2pdf().from(document.body).output('blob')
//    console.log(worker)



        //const blob = new Blob([text.value], { type: 'plain/text' });
        // get parent folder id from localstorage
        //const pdfAsArray = Uint8Array.from(atob(pdfData.split(',')[1]), c => c.charCodeAt(0));
        
        //const parentFolder = localStorage.getItem('parent_folder');
        //var twoWords = text.value.split(' ')[0] + '-' + text.value.split(' ')[1];
        // set file metadata




            //parents: ['Backup Folder'] // Optional: specify the folder ID to upload the file to a specific folder
/*         const fileMetadata = {
            name: 'Generated-PDF.pdf',
            mimeType: 'application/pdf'
          };
        
          const media = {
            mimeType: 'application/pdf',
            body: pdfData
          };
        
          const request = gapi.client.drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
          })
          request.execute(file => {
            console.log('File ID: ' + file.id);
            alert('The generated PDF has been uploaded to your Google Drive');
          }); */
function createFolder() {
    var access_token = gapi.auth.getToken().access_token;
    var request = gapi.client.request({
        'path': 'drive/v2/files',
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        },
        'body': {
            'title': 'Backup Folder',
            'mimeType': 'application/vnd.google-apps.folder'
        }
    });
    request.execute(function (response) {
        localStorage.setItem('parent_folder', response.id);
    })
}

var expandContainer = document.querySelector('.expand-container');
var expandContainerUl = document.querySelector('.expand-container ul');
//var listcontainer = document.querySelector('.list ul');
// create a function to show hide options
function expand(v) {
    var click_position = v.getBoundingClientRect();
    if (expandContainer.style.display == 'block') {
        expandContainer.style.display = 'none';
        expandContainerUl.setAttribute('data-id', '');
        expandContainerUl.setAttribute('data-name', '');
    } else {
        expandContainer.style.display = 'block';
        expandContainer.style.left = (click_position.left + window.scrollX) - 120 + 'px';
        expandContainer.style.top = (click_position.top + window.scrollY) + 25 + 'px';
        // get data name & id and store it to the options
        expandContainerUl.setAttribute('data-id', v.parentElement.getAttribute('data-id'));
        expandContainerUl.setAttribute('data-name', v.parentElement.getAttribute('data-name'));
    }
}

// function for files list
/* function showList() {
    gapi.client.drive.files.list({
        // get parent folder id from localstorage
        'q': `parents in "${localStorage.getItem('parent_folder')}"`
    }).then(function (response) {
        var files = response.result.files;
        if (files && files.length > 0) {
            listcontainer.innerHTML = '';
            for (var i = 0; i < files.length; i++) {
                listcontainer.innerHTML += `
                
                <li data-id="${files[i].id}" data-name="${files[i].name}">
                <span>${files[i].name}</span>
                <svg onclick="expand(this)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
                </li>
                
                `;
            }
        } else {
            listcontainer.innerHTML = '<div style="text-align: center;">No Files</div>'
        }
    })
} */

function readEditDownload(v, condition) {
    var id = v.parentElement.getAttribute('data-id');
    var name = v.parentElement.getAttribute('data-name');
    v.innerHTML = '...';
    gapi.client.drive.files.get({
        fileId: id,
        alt: 'media'
    }).then(function (res) {
        expandContainer.style.display = 'none';
        expandContainerUl.setAttribute('data-id', '');
        expandContainerUl.setAttribute('data-name', '');
        if (condition == 'read') {
            v.innerHTML = 'Read';
            document.querySelector('textarea').value = res.body;
            document.documentElement.scrollTop = 0;
            console.log('Read Now')
        } else if (condition == 'edit') {
            v.innerHTML = 'Edit';
            document.querySelector('textarea').value = res.body;
            document.documentElement.scrollTop = 0;
            var updateBtn = document.getElementsByClassName('upload')[0];
            updateBtn.innerHTML = 'Update';
            // we will make the update function later
            updateBtn.setAttribute('onClick', 'update()');
            document.querySelector('textarea').setAttribute('data-update-id', id);
            console.log('File ready for update');
        } else {
            v.innerHTML = 'Download';
            var blob = new Blob([res.body], { type: 'plain/text' });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = name;
            a.click();
        }
    })
}

// new create update function
function update() {
    var updateId = document.querySelector('textarea').getAttribute('data-update-id');
    var url = 'https://www.googleapis.com/upload/drive/v3/files/' + updateId + '?uploadType=media';
    fetch(url, {
        method: 'PATCH',
        headers: new Headers({
            Authorization: 'Bearer ' + gapi.auth.getToken().access_token,
            'Content-type': 'plain/text'
        }),
        body: document.querySelector('textarea').value
    }).then(value => {
        console.log('File updated successfully');
        document.querySelector('textarea').setAttribute('data-update-id', '');
        var updateBtn = document.getElementsByClassName('upload')[0];
        updateBtn.innerHTML = 'Backup';
        updateBtn.setAttribute('onClick', 'generatePDF()');
    }).catch(err => console.error(err))
}

function deleteFile(v) {
    var id = v.parentElement.getAttribute('data-id');
    v.innerHTML = '...';
    var request = gapi.client.drive.files.delete({
        'fileId': id
    });
    request.execute(function (res) {
        console.log('File Deleted');
        v.innerHTML = 'Delete';
        expandContainer.style.display = 'none';
        expandContainerUl.setAttribute('data-id', '');
        expandContainerUl.setAttribute('data-name', '');
        // after delete update the list
        showList();
    })
}