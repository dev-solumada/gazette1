
function openFile(file) {
  var f = new XMLHttpRequest();
  f.open("GET", file, false);
  f.onreadystatechange = function () {
    if(f.readyState === 4) {
        if(f.status === 200 || f.status == 0) {
          var res= f.responseText;
          document.getElementById('left-page').innerHTML = res;
          window.scrollTo(0, 0);
        }
    }
  }
  f.send(null);
}


// dernier forme sur la page
function getLastForm() {
  return document.forms[document.forms.length - 1];
}

/**
 * UPLOAD PDF
 */
 var img = document.getElementById("pdf");
 function uploadPDF(){
     document.getElementById("show").setAttribute("data",URL.createObjectURL(img.files[0]));
     document.getElementById("show").setAttribute("style", 'width:100% !important;height: 100vh !important;zoom: 0% !important;');
 }


 /**
  * Page
  * 
  */
 
// get all input values of page1
function getPage1Values() {
  const pays_input = document.getElementById("GAZC");                      
  const date_input = document.getElementById("GAZD");                      
  const number_input = document.getElementById("GAZN");                      
  const datep_input = document.getElementById("GAZP"); 
  const pdf_viewer = document.getElementById('show');

  var pays = pays_input.value;
  var date = date_input.value;
  var number = number_input.value;
  var date_p = datep_input.value;

  let validation = true;
  // vider la liste
  showWarnings();
  
  // non fichier séléctionné
  if(pdf_viewer.data.includes('/pdf_paceholder.png')) {
    showWarnings(pdf_viewer, 'Please, open a PDF file.')
    validation = false;
  } else {
    // gestion d'erreur
    if (pays.value === '') {
      showWarnings(pays_input, "Select the country.");
      validation = false;
    }
    if (number.trim().length == 0) {
      showWarnings(number_input, "Number of Gazette is empty.");
      validation = false;
    }
    if (!isDate(date)) {
      showWarnings(date_input, "Date of Gazette is invalid.");
      validation = false;
    }
    if (!isDate(date_p)) {
      showWarnings(datep_input, "Date of Publication is invalid.");
      validation = false;
    }
  
    /* Affiche le popup */
    let ul = document.createElement('ul');
    var wul = document.querySelectorAll('#warnings-ul > li');
    for (const li_ of wul) {
      let li = document.createElement('li');
      li.innerHTML = li_.childNodes[0].textContent;
      li.className = 'text-start text-danger';
      ul.appendChild(li);
    }
    if (!validation) {
      swal({
        title: "Are you sure to pass this step?",  
        text: "There are some warnings:", 
        icon: "warning",
        content: ul,
        buttons: {
          cancel: "No",
          confirm: "Yes"
      }
      }).then( val => {
        if(val) {
          // go to next
          // local storage variables
          localStorage.setItem('GAZC', pays);
          localStorage.setItem('GAZD', date);
          localStorage.setItem('GAZN', number);
          localStorage.setItem('GAZP', date_p);
          showWarnings();
          openFile('plateforme/page2.html');
          // afficher les chapitre valable pour le pays séléctionné
          displayAvailableChapters(localStorage.getItem('GAZC').toUpperCase());
        }
      }); 
    } else {
      // local storage variables
      localStorage.setItem('GAZC', pays);
      localStorage.setItem('GAZD', date);
      localStorage.setItem('GAZN', number);
      localStorage.setItem('GAZP', date_p);
      showWarnings();
      openFile('plateforme/page2.html');
      // afficher les chapitre valable pour le pays séléctionné
      displayAvailableChapters(localStorage.getItem('GAZC').toUpperCase());
    }
  }
}

// vérifier une date
const isDate = (date) => {
  return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

var Pages = {}

// get all input values of page2
function getPage2Values() {
  
  // navbar fixed on scroll  
  window.addEventListener('scroll', onScroll);

  var chap = document.getElementById("chapitre").value;
  // local storage variables
  localStorage.setItem('chap', chap);

  openFile('plateforme/page3.html');
  // fonction venant du fichier main.js
  // storer une forme de page
  originalSection.innerHTML = getSection(0).innerHTML;
  main();
  localStorage.setItem('current-pageId', 0);
  // toutes les pages origines
  Pages.ident1 = document.getElementById('ident-col-1').innerHTML;
  Pages.ident2 = document.getElementById('ident-col-2').innerHTML;
  if (document.getElementById('applicant-field')){
    Pages.app = document.getElementById('applicant-field').innerHTML;
  }
  else{
    Pages.app = null;
  }
  if (document.getElementById('owner-field')){
    Pages.owner = document.getElementById('owner-field').innerHTML;
  }
  else{
    Pages.owner = null;
  }
  if (document.getElementById('agent-field')){
    Pages.agent = document.getElementById('agent-field').innerHTML;
  }
  else{
    Pages.agent = null;
  }
  Pages.nice = document.getElementById('nice-field').innerHTML;

  // afficher les chapitres sur next chapter
  displayAvailableChaptersForNext(chap, localStorage.getItem('GAZC').toUpperCase());

  // nextpage.js set original page
  originalPage.innerHTML = document.querySelectorAll('.page-to-repeat')[0].innerHTML;


  // vider l'array pour page 
  chapterPage_Array = []; 
  // Créer les page pour chapitre
  let chapters = getAvailableChapter(localStorage.getItem('GAZC').toUpperCase());
  Object.keys(chapters).forEach(key => {
    chapters[key].forEach(value => {
      if (value !== chap) {
        // field set
        let fieldset = document.createElement('fieldset');
        let legend = document.createElement('legend');
        legend.className = 'text-end';
        let img = document.createElement('img');
        img.src = '/Delete-icon.png';
        img.className="btn";
        img.width="24";
        img.height="24";
        img.setAttribute('onclick', "deleteSection(this)");
        legend.append(img);
        fieldset.append(legend);
        let section = document.createElement('section');
        let sectionContent = value.includes("APP") ? getSectionContentFile('/app.html') : originalSection.innerHTML;
        fieldset.innerHTML += sectionContent;
        section.append(fieldset);
        section.id = value;
        section.className = 'hidden-page deleted mt-2';
        let select = section.firstChild.firstChild.nextSibling.nextSibling.firstChild.nextSibling.firstChild.nextSibling.nextSibling.nextSibling.firstChild.nextSibling.nextSibling.nextSibling;
        select.innerHTML = `<option value="${value}">${value}</option>`;
        let pageButtons = section.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling;
        if (pageButtons.classList.contains('page-buttons')); 
          pageButtons.classList.add('pagebtn-' + value);

        // page to repat
        let pageToRepeat = section.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling;
        pageToRepeat.className = 'page-to-repeat-' + value     + ' active-page';
        
        chapterPage_Array.push(section);

      } else {
        localStorage.setItem('prevchap', chap);
        let section = document.createElement('section');
        getSection(0).id = chap;
        getSection(0).innerHTML = value.includes("APP") ? getSectionContentFile('/app.html') : originalSection.innerHTML;
        getSection(0).classList.add('showing-page');
        let select = getSection(0).firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;
        select.innerHTML = `<option value="${chap}">${chap}</option>`;
        let pageButtons = getSection(0).firstElementChild.nextElementSibling.nextElementSibling;
        if (pageButtons.classList.contains('page-buttons')) 
          pageButtons.classList.add('pagebtn-' + chap);
        // page to repat
        let pageToRepeat = getSection(0).firstElementChild.nextElementSibling;
        pageToRepeat.classList.replace('page-to-repeat', 'page-to-repeat-' + chap);

        chapterPage_Array.push(getSection(0));
      }
    })
  })

  showFinishedChapter();
  

  // action sur choisir nextchapter
  const nextchap_select = document.querySelector('#nextchap');
  nextchap_select.addEventListener('change', (e) => {
    if (e.target.value === '') return;
    appendSection(e.target.value)
    showSection(e.target.value);
    localStorage.setItem('prevchap', e.target.value);
  });

}

// revenir dans la première page
function previousToPage1() {
  openFile('plateforme/page1.html');
  let country = localStorage.getItem('GAZC');
  if (country) document.getElementById('GAZC').value = country;
  let date = localStorage.getItem('GAZD');
  if (date) document.getElementById('GAZD').value = date;
  let datep = localStorage.getItem('GAZP');
  if (datep) document.getElementById('GAZP').value = datep;
  let number = localStorage.getItem('GAZN');
  if (number) document.getElementById('GAZN').value = number;
}

// revenir dans la deuxième page
function previousToPage2() {
  if (confirm("Do you want to exit this page? Some recordings may be lost.")) {
    document.getElementById('navbar_top').classList.remove('fixed-top');
		// remove navbar fixed on scroll  
		window.removeEventListener('scroll', onScroll);

    let page = document.getElementById('left-page');
    let pageLeft = page.innerHTML;
    localStorage.setItem('pageLeft', pageLeft);
    document.getElementById('warnings-ul').innerHTML = '';
    openFile('plateforme/page2.html');
    // afficher les chapitre valable pour le pays séléctionné
    displayAvailableChapters(localStorage.getItem('GAZC').toUpperCase());
    // select by value
    let selected_chap = localStorage.getItem('chap');
    if (selected_chap)
      document.getElementById('chapitre').value = selected_chap;
  }
}

/**
 * Fonction pour afficher les erreurs sur les champs.
 * @param {DOM} input 
 * @param {String} message 
 * @returns 
 */
const showWarnings = (input = null, message = '') => {
  let warning_ul = document.getElementById('warnings-ul');
  if (input === null && message === '') {
    if (document.getElementById("already").value == ""){
      warning_ul.innerHTML = '';
    }
    else{
      warning_ul.innerHTML = "<li style ='font-weight:500;' class='col-md-6 succes' >"+ document.getElementById("already").value+"</li>";
    }
    for (const i of document.querySelectorAll('.select')) {
      // supprimer la class invalid
      i.classList.remove('is-invalid');
    }
    return;
  } 

  let li = document.createElement('li');
  li.className = 'col-md-3 error';
  let label = document.createElement('label');
  label.className = 'error';
  label.textContent = message;
  label.style.fontWeight = '500';
  label.style.cursor = 'pointer';
  
  if (!input.hasAttribute('data') && input.type !== 'file')  {
    input.classList.add('is-invalid');
  }
  // evénement pour faire un focus sur le champ
  label.onclick = () => {
    if (!input.hasAttribute('data')) input.focus();
    else document.getElementById('pdf').click();
  }
  li.append(label);
  warning_ul.appendChild(li);

}


// download xml file
function downloadXML() {
  // changement sur le priorities
  localStorage.setItem('GAZD', document.getElementById('GAZD').value);
  localStorage.setItem('GAZN', document.getElementById('GAZN').value);

  // verication des champs
  let validation = true;
  showWarnings(); // balayer le champ pour warnings
  for (const input of document.querySelectorAll('.select')) {
    if (!input.disabled)
      if (input.type === 'date') { // verifier date
        if (! isDate(input.value)) {
          showWarnings(input, `The field ${input.name} has an invalid date.`);
          validation = false;
        }
      } else {
        if (input.value.trim().length === 0) {
          let textid = input.id.split('-')[0] + ' at row ' +  (parseInt(input.id.split('-')[1]) + 1);
          showWarnings(input, `The field ${input.name !== '' ? input.name : textid} has an empty value.`);
          validation = false;
        }
      }
  }
  
  /* Affiche le popup */
  let ul = document.createElement('ul');
  var wul = document.querySelectorAll('#warnings-ul > li');
  for (const li_ of wul) {
    let li = document.createElement('li');
    li.innerHTML = li_.childNodes[0].textContent;
    li.className = 'text-start text-danger';
    ul.appendChild(li);
  }

  // effacer tous les avertissements
  document.getElementById('warnings-ul').innerHTML = '';

  if (!validation) {
    swal({
      title: "Are you to download the file?",  
      text: "There are some warnings:", 
      icon: "warning",
      content: ul,
      buttons: {
        cancel: "No",
        confirm: "Yes"
      }
    }).then( val => {
      if(val) {
        // country
        let GAZC = localStorage.getItem('GAZC');
        // chapter
        let chapter = localStorage.getItem('chap');
        // gazette number
        let GAZN = localStorage.getItem('GAZN');
        // gazette date
        const dateStr = localStorage.getItem('GAZD');
        let GAZD = dateStr.replace('-', '').replace('-', '');
        if (localStorage.getItem('version') != 1 ){
          download(document.forms[0], `${GAZC}_${GAZD}_${GAZN}_V${localStorage.getItem('version')}`);
        } else{
          download(document.forms[0], `${GAZC}_${GAZD}_${GAZN}`);
        } 
        window.onbeforeunload = function () {};
        sendRequest("/download",document.getElementById("pdf").files[0].name);
        showWarnings();
      }
    });
  }
  // si tous ont été validés
  else {
    // country
    let GAZC = localStorage.getItem('GAZC');
    // chapter
    let chapter = localStorage.getItem('chap');
    // gazette number
    let GAZN = localStorage.getItem('GAZN');
    // gazette date
    const dateStr = localStorage.getItem('GAZD');
    let GAZD = dateStr.replace('-', '').replace('-', ''); 
    // telecharger les ficher zip et xml
    if (localStorage.getItem('version') != 1 ){
      download(document.forms[0], `${GAZC}_${GAZD}_${GAZN}_V${localStorage.getItem('version')}`);
    } else {
      download(document.forms[0], `${GAZC}_${GAZD}_${GAZN}`);
    }
    window.onbeforeunload = function () {};
    sendRequest("/download",document.getElementById("pdf").files[0].name);
    showWarnings();
  } 
}
//sending request in server
function sendRequest(url,filename) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location = "/";
    }
  };
  http.send("filename=" + filename +"&version="+localStorage.getItem('version'));
}

/**
 * Bouton annuler
 */
function cancel() {
  swal({
    title: "Are you sure to cancel?",
    text: "Once canceled, you will no longer be able to recover the data!",
    icon: "warning",
    buttons: {
      cancel: "No",
      confirm: "Yes",
    },
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      window.location.href = '/';
    } else {
      swal("Your data is safe!");
    }
  });
}

/**
 * Chapitre suivant
 */

function onScroll() {
  navbar_height = document.getElementById('navbar_top').offsetHeight;
  if (window.scrollY > 0) {
    document.getElementById('navbar_top').classList.add('fixed-top');
  } else {
    document.getElementById('navbar_top').classList.remove('fixed-top');
    // remove padding top from body
    document.body.style.paddingTop = '0';
  }
}
