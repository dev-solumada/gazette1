/**
 * List of page
 */

var originalPage = document.createElement('div');

function getPages(index = -1) {
    return index < 0  ? document.querySelectorAll('.' + getPageRepeatClass()) :
    document.querySelectorAll('.' + getPageRepeatClass())[index];
}

function newPage() {
    return originalPage;
}

// ajouter une page aprés la premiere page
function addPage(page = document.createElement('div')) {
    page.className = `${getPageRepeatClass()} row p-1 active-page`;
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.className = 'text-end';
    const img = document.createElement('img');
    img.src = '/Delete-icon.png';
    img.className = 'btn';
    img.width = '24';
    img.height = '24';
    img.setAttribute('onclick', 'deletePage(this)');
    legend.append(img);
    fieldset.append(legend);
    fieldset.innerHTML += getPages(0).innerHTML;
    page.classList.add('active-page');
    page.append(fieldset);
    // chercher img tag
    let imgTag = page.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.lastElementChild.
        firstElementChild.lastElementChild.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;
    imgTag.src = '/placeholder.png';
    imgTag.width = '150';
    imgTag.height = '150';
    imgTag.className = 'image';
    // hide all page
    hideAllPage();
    // afficher
    getPages(getPages().length - 1).after(page);
}

function addNewPage(btn) {
    addPage();
    let div = btn.parentElement.nextElementSibling;
    showBtnControllerPage(div);
}

// supprimer une page
function deletePage(btn) {
    swal({
        title: "Do you want to delete this section?",  
        text: "All data in this section may be lost.", 
        icon: "warning",
        buttons: {
          cancel: "No",
          confirm: "Yes"
        }
    }).then( val => {
        if(val) {
            let page = btn.parentElement.parentElement.parentElement;
            let indexOfPage = Array.from(getPages()).indexOf(page);
            
            let pageBtn = document.querySelector('.pagebtn-' + localStorage.getItem('prevchap')).firstElementChild.firstElementChild.nextElementSibling;
            let span1 = pageBtn.firstElementChild;
            let bPrev = span1.nextElementSibling;
            let span = bPrev.nextElementSibling;
            let bNext = span.nextElementSibling;
            prevPage(bPrev, span, bNext);
            
            if (indexOfPage === getPages().length - 1) {
                bNext.disabled = true;
                bNext.classList.replace('btn-dark', 'btn-light');
            }
            // supprimer dans la liste
            Array.from(getPages()).splice(Array.from(getPages()).indexOf(page), 1);
        
            hidePage(page);
            page.remove();
            span1.textContent = 'Number of pages: ' + getPages().length;
            if (getPages().length <= 1) {
                bPrev.disabled = true;
                bNext.disabled = true;
                bNext.classList.replace('btn-dark', 'btn-light');
                bPrev.classList.replace('btn-dark', 'btn-light');
            } 
        }
    });
}

function showPageOn(index) {
    hideAllPage();
    let page = document.querySelectorAll('.' + getPageRepeatClass())[index];
    page.classList.replace('hidden-page', 'active-page');
}

function hidePage(page = document.createElement('div')) {
    page.classList.replace('active-page', 'hidden-page');
}

function hideAllPage() {
    for (const page of document.querySelectorAll('.' + getPageRepeatClass())) {
        hidePage(page);
    }
}

function showBtnControllerPage(div = document.createElement("div")) {
    div.innerHTML = '';
    const span1 = document.createElement('span');
    span1.className = 'badge bg-primary mx-4';
    span1.textContent = 'Number of pages: ' + getPages().length;
    const btnPrev = document.createElement('button');
    const btnNext = document.createElement('button');
    btnNext.innerHTML = 'Next &xrArr;';
    btnNext.className = 'btn btn-dark text-white';
    btnNext.type = 'button';
    btnPrev.innerHTML = '&xlArr; Previous';
    btnPrev.className = 'btn btn-dark text-white';
    btnPrev.type = 'button';
    const span = document.createElement('span');
    span.className = 'text-white badge bg-dark mx-1';
    span.textContent = '1';

    nextPage(btnPrev, span, btnNext);

    btnNext.addEventListener('click', function() {nextPage(btnPrev, span, btnNext)});
    btnPrev.addEventListener('click', function() {prevPage(btnPrev, span, btnNext)});
    

    div.append(span1);
    div.append(btnPrev);
    div.append(span);
    div.append(btnNext);
}

function nextPage(btnPrev, span, btnNext) {
    const list_page = Array.from(getPages());
    let activePage = list_page.find(div => div.classList.contains('active-page'));
    let pageIndex = list_page.indexOf(activePage);
    if (pageIndex === list_page.length - 1) {
        showPageOn(pageIndex);
        span.innerHTML = pageIndex + 1;
        btnNext.disabled = true;
        btnNext.classList.replace('btn-dark', 'btn-light');
        btnPrev.disabled = false;
        btnPrev.classList.replace('btn-light', 'btn-dark');
    } else {
        showPageOn(pageIndex+1);
        span.innerHTML = pageIndex + 2;
        btnPrev.disabled = false;
        btnPrev.classList.replace('btn-light', 'btn-dark');
        if (pageIndex + 1 === list_page.length - 1) {
            btnNext.disabled = true;
            btnNext.classList.replace('btn-dark', 'btn-light');
        }
    }
}

function prevPage(btnPrev, span, btnNext) {
    const list_page = Array.from(getPages());
    let activePage = list_page.find(div => div.classList.contains('active-page'));
    let pageIndex = list_page.indexOf(activePage) - 1;
    if (pageIndex <= 0) {
        showPageOn(0);
        span.innerHTML = 1;
        btnPrev.disabled = true;
        btnPrev.classList.replace('btn-dark', 'btn-light');
    } else {
        showPageOn(pageIndex);
        span.innerHTML = pageIndex + 1;
        btnNext.disabled = false;
        btnNext.classList.replace('btn-light', 'btn-dark');
    }

    if (list_page.length === 0) {
        btnNext.disabled = true;
        btnNext.classList.replace('btn-dark', 'btn-light');
    } else {
        btnNext.disabled = false;
        btnNext.classList.replace('btn-light', 'btn-dark');
    }
}

function getPageRepeatClass() {
    return `page-to-repeat-${localStorage.getItem('prevchap')}`;
}
