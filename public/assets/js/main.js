
/** */
var xmldata=['<?xml version="1.0"?>'];

/**
 * Download xml file
 * @param {*} contentType 
 * @param {*} data 
 * @param {*} filename 
 */
function downloadData(contentType,data,filename){
    var link=document.createElement("A");
    link.setAttribute("href",encodeURI("data:"+contentType+","+data));
    link.setAttribute("style","display:none");
    link.setAttribute("download",filename);
    document.body.appendChild(link);                                                        //needed for firefox
    link.click();
    setTimeout(function(){
      document.body.removeChild(link);
    },1000);
}

function fromToXml(form){
    var xmldata=['<?xml version="1.0"?>'];
    xmldata.push("<form>");
    xmldata.push('\t<InfoGazette>');
    var inputs=form.elements;
    for(var i=0;i<inputs.length;i++){
      // create chapter tag
      if (inputs[i].name === 'chapters') {
        xmldata.push(`\t<chapter name="${inputs[i].name}" value="${new String(inputs[i].value)}">`);
        continue;
      }
      // create mark tag
      if (inputs[i].id === 'start_mark')
        xmldata.push(`\t\t<mark>`);
      // create element tag
      var el=document.createElement("ELEMENT");
      if (inputs[i].name && !inputs[i].disabled){
        el.setAttribute("name",inputs[i].name);
        el.setAttribute("value",new String(inputs[i].value));
        xmldata.push('\t\t\t' + el.outerHTML);
      }
      // close InfoGazette tag
      if (inputs[i].name === '400-publication')
        xmldata.push('\t</InfoGazette>');
      // close mark tag
      if (inputs[i].id === 'end_mark')
        xmldata.push('\t\t</mark>');
      // close chapter tag
      if (inputs[i].id === 'end_chap')
        xmldata.push('\t</chapter>');

    }
    xmldata.push("</form>");
    return xmldata.join("\n");
}

// fonction pour compresser les images
function zipImageFile(fileName) {
  var zip = new JSZip();
  let i = 1;
  for (const input of document.querySelectorAll('.inputFile')) {
    const file = input.files[0];
    const fileName = `${file.name.split('.')[0]}_${i}.${file.name.split('.')[1]}`;
    zip.file(fileName, file);
    i++;
  }
  zip.generateAsync({
      type: "base64"
  }).then(function(content) {
      var link = document.createElement('a');
      link.href = "data:application/zip;base64," + content;
      link.download = fileName+".zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  });       
}

// télécharger le fichier xml et compresser les images
function download(frm, fileName){
  var data=fromToXml(frm);
  downloadData("text/xml",data,fileName + ".xml");
}



/**
 * Gestion d'erreur sur les champ
 * @param {*} e 
 */

/* Champ de type number entre 0 et 45 */
function check511Value(input) {
  if (input.value < 0) input.value = 0;
  else if (input.value > 45) input.value = 45;
  else input.value = parseInt(input.value);
}


function showError(input, message) {
  let p = document.createElement('p');
  let small = document.createElement('small');
  p.style.color = 'red';
  p.style.margin = 0;
  small.textContent = message;
  p.appendChild(small);
  // remove error
  if (input.parentElement.childElementCount === 2)
    input.parentElement.removeChild(input.parentElement.childNodes[1]);
  // display error
  input.parentNode.appendChild(p);
}

function uploadImageFile() {
  var inputFile = document.querySelector("#inputFile");
  var file = inputFile.files[0];
  if (typeof file !== 'undefined') { // si une image est séléctionnée
    if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.querySelector('#image').setAttribute('src', e.target.result);
        // document.querySelector('#imagePath').setAttribute('value', e.target.result);
      }
      reader.readAsDataURL(file);
    } else {
      alert('This field accept only an image file!');
      inputFile.value = null;
    }
  } else { // afficher la source par défaut
    document.querySelector('#image').setAttribute('src', 'assets/images/placeholder.png');
  }
}


/**
 * 
 * SELECTION D'UNE LANGUE
 * 
 */
function showCountryLangue() {
  const LANG = ['DZ', 'TN', 'TRNC', 'MS', 'LS', 'SZ', 'MG', 'MM', 'GM'];
  const country_select = document.getElementById('country');
  displayInSelect(country_select, LANG);
}
// fonction pour afficher les langues dans le champ select

// 

/**
 * Fonction pour afficher une liste sur une balise select
 * @var select input
 * @var array variable de type table qui contient les informations à afficher.
 */

 function displayInSelect(select, array) {
  // vider le champ select
  if (!select) return;
  select.innerHTML = '';
  array = array.sort();
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement('option');
    option.value = array[i];
    option.textContent = array[i];
    select.appendChild(option);
  }
}

// toutes les fonctions qui doivent dès que l'application démarre.
function main() {
  // get LocalStorage variable
  let pays = localStorage.getItem('GAZC');
  let chap = localStorage.getItem('chap');
  let chapId = chap.toUpperCase().split('_')[0];
  if (chapId.includes("APP")){
    disableFields(["111","141","151","156","171","176","180","186",]);
  }
  // functions 
  callScripts();
  tableScript();
  showCountryLangue();
  displayGazetteInfo();
}

/**
 * Fonction pour désactiver les champs par id
 * @param {array} fieldsId 
 */
 const disableFields = function(fieldsId = []) {
  var agentfield=0;
  var nicefield = 0;
  fieldsId.forEach(el => {
    if ($(`#${el}`).attr('name') == "740" || $(`#${el}`).attr('name') == "750" || $(`#${el}`).attr('name') == "770"){
      agentfield++;
    }
    else{
      if ($(`#${el}`).attr('name') == "511" || $(`#${el}`).attr('name') == "510"){
       nicefield++;
    }
    else{
      if ($(`#${el}`).attr('name') == "541"){
          if ($(`#${el}`).prop('disabled') === false){
            document.getElementById('trademark').remove();
            document.getElementById("ident-col-1").setAttribute("class","col-md-12 col-lg-12 col-xl-12 p-1")
          }
      }
      else{
        $(`#${el}`).parent().parent().remove();
        $(`#${el}`).attr('class', '');
      }
    }
    }
   
    // specified for applicant 
    let name = document.getElementsByName(el)[0];
    if (name) name.disabled = true;
    if (el === '731') {
      document.getElementById("applicant-field").remove();
    } else if (el === '732') {
      document.getElementById("owner-field").remove();
    }
  });
  if (agentfield >= 3){
    document.getElementById('agent-field').remove();
  }
  if (nicefield >= 2){
    document.getElementById('nice-field').remove();
  }
}

// disable fields applicant or owner
function disableSpecifiedField(name) {
  document.getElementById('name'+name+'-0').disabled = true;
  document.getElementById('address'+name+'-0').disabled = true;
  document.getElementById('country'+name+'-0').disabled = true;
}

// <!-- Script to allow copy/paste in input type of date -->
function callScripts() {
  $(() => {
      $(document).on("keydown", "input[type=date]", function (e) {
          if (e.ctrlKey === true) {
              if (e.keyCode === 67) {
                  $(this).attr("type", "text").select();
                  document.execCommand("copy");
                  $(this).attr("type", "date");
              }
          }
      });
      $(document).bind("paste", function (e) {
          let $input = $(document.activeElement);
          if ($input.attr("type") === "date") {
              let dateString = e.originalEvent.clipboardData.getData('text').trim();
              if (dateString.includes('-') || dateString.includes('/')) {
                  let [dd, mm, yyyy] = dateString.includes('-') ? dateString.split("-") : dateString.split("/");
                  let date = new Date(`${yyyy.trim()}-${mm.trim()}-${dd.trim()}`);
                  if (date != "Invalid Date")
                      $input.val(date.toISOString().split('T')[0]);
              }
          }
      });
      
      let inputs = document.querySelectorAll('.select');
      let i = 0;
      for (const input of inputs) {
        if (i < inputs.length - 1) {
          const nextInput = inputs[i+1];
          input.addEventListener("keyup", function (e) {
            e.preventDefault();
              if (e && e.keyCode == 13) {
                nextInput.focus();
              }
          });
        }
        i++;
      }
  });
}

function displayGazetteInfo() {
  // chapitre
  let chap_input = document.getElementById('chapter');
  if (chap_input)
    chap_input.innerHTML = `<option value="${localStorage.getItem('chap')}">${localStorage.getItem('chap').toUpperCase()}</option>`;
  // afficher pays
  let country_input = document.getElementById('GAZC')
  if (country_input)
    country_input.value = `${localStorage.getItem('GAZC')}`;
  // afficher number
  let number_input = document.getElementById('GAZN')
  if (number_input)
    number_input.value = localStorage.getItem('GAZN');
  // afficher date
  let date_input = document.getElementById('GAZD')
  if (date_input)
    date_input.value = localStorage.getItem('GAZD');
    // date of pub
  let datep_input = document.getElementById('GAZP')
  if (datep_input)
    datep_input.value = localStorage.getItem('GAZP');
}

function getAvailableChapter(country) {
  var obj = {}
  switch (country) {
    case 'DZ': // for DZ
    obj['Registration'] = ['REG'];
    obj['Renewal'] = ['REN'];
      break;
    case 'TN': // for TN
    obj['Application'] = ['APP_T','APP_M', 'APP_E'];
    obj['Changes/Corrrections/Concelations'] = ['COR'];
    obj['Renewal'] = ['REN'];
      break;
    case 'MG': // for MG
    obj['Changes/Corrrections/Concelations'] = ['COM'];
    obj['Registration'] = ['REG', 'REG_M'];
      break;
    case 'MM': // for MM
    obj['Application'] = ['APP'];
      break;
    case 'TRNC': // for TRNC
    obj['Application'] = ['APP'];
    obj['Changes/Corrrections/Concelations'] = ['ADD', 'TRA', 'CAN'];
    obj['Renewal'] = ['REN'];
      break;
    case 'MS': // for MS
    obj['Application'] = ['APP'];
    obj['Changes/Corrrections/Concelations'] = ['RES'];
    obj['Registration'] = ['REG'];
    obj['Renewal'] = ['REN'];
      break;
    case 'GM': // for GM
    obj['Application'] = ['APP'];
      break;
    case 'LS': // for LS
    obj['Application'] = ['APP'];
    obj['Changes/Corrrections/Concelations'] = ['ASS', 'MER', 'RUSER', 'ADD'];
    obj['Registration'] = ['REG'];
    obj['Renewal'] = ['REN'];
      break;
    case 'SZ': // for SZ
    obj['Application'] = ['APP'];
    obj['Registration'] = ['REG'];
    obj['Renewal'] = ['REN'];
      break;
  }
  return obj;
}

function displayAvailableChapters(country = 'DZ') {
  var obj = getAvailableChapter(country);
  // création d'élément et affichage des chapitres
  let chapter_select = document.getElementById('chapitre');
  chapter_select.innerHTML = '';
  Object.keys(obj).forEach(key => {
    let optgroup = document.createElement('optgroup');
    optgroup.label = key;
    obj[key].forEach(value => {
      let option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      optgroup.append(option);
    });
    chapter_select.appendChild(optgroup);
  });
}

function displayAvailableChaptersForNext(activeChapter, country) {
  var obj = getAvailableChapter(country);
  // création d'élément et affichage des chapitres
  let chapter_select = document.querySelector('#nextchap');
  chapter_select.innerHTML = '<option value=""></option>';
  Object.keys(obj).forEach(key => {
    let optgroup = document.createElement('optgroup');
    optgroup.label = key;
    obj[key].forEach(value => {
        let option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        optgroup.append(option);
    });
    chapter_select.appendChild(optgroup);
  });
}

//add image screenshoot
window.addEventListener("paste", e => {
  const pays = localStorage.getItem('GAZC');
  const chap = localStorage.getItem('chap');
 
  if (pays === 'TN' && chap === 'REN') return;
  // get current image and input file
  const pageId = parseInt(localStorage.getItem('current-pageId')) || 0;
  if (e.clipboardData.files.length > 0) {
      if (clickedImg) {
        let inputFile = clickedImg.nextSibling;
        while (inputFile.type !== 'file') {
          inputFile = inputFile.nextSibling;
        }
      }
      
      if (e.clipboardData.files[0].type.startsWith("image/")) {
        setPreviewImage(e.clipboardData.files[0])
      }
  }

  function setPreviewImage(file) {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (clickedImg) {
        clickedImg.src = fileReader.result;
        clickedImg.removeAttribute("width");
        clickedImg.removeAttribute("height");
        let inputFilehidden = clickedImg.nextElementSibling;
        while (inputFilehidden.type !== 'hidden') {
          inputFilehidden = inputFilehidden.nextElementSibling;
        }
        inputFilehidden.value = fileReader.result;
        
        // reset to null the image
        clickedImg.classList.remove('img-focused');
        clickedImg = null;
      }
    }
  }

});


/**
 * Evenement sur image 
 */
var clickedImg = null;
// envent handler
function handler(img) {
  if (clickedImg) clickedImg.classList.remove('img-focused') 
  if (clickedImg === img) {
    clickedImg = null;
  } else {
    img.classList.add('img-focused');
    clickedImg = img;
  }
}