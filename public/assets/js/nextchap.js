
/**
 * Array form chapter page
 */
var chapterPage_Array = []; 


var originalSection = document.createElement('section');

function getSections() {
    return document.getElementsByTagName('section');
}

function getSection(index) {
    return document.getElementsByTagName('section')[index];
}

function newSection() {
    return getSection(getSections().length - 1);
}

function addNewSection(section = document.createElement('section')) {
    section.classList.remove('deleted');
    newSection().after(section);
    // afficher les boutons pour chapitres
    showFinishedChapter();
}

function hideAllSection() {
    for (const section of getSections()) {
        section.classList.replace('showing-page', 'hidden-page');
        if (!section.classList.contains('hidden-page')) section.classList.add('hidden-page');
    }
}

function showSection(id) {
    hideAllSection();
    for (const section of getSections())
        if (section.id === id) {
            section.classList.replace('hidden-page', 'showing-page');
            section.classList.remove('deleted');
            break;
        }
    localStorage.setItem('prevchap', id);
    // afficher les boutons pour chapitres
    showFinishedChapter();
}

function deleteSection(e) {
    swal({
        title: "Do you want to delete this field?",  
        text: "All data in this chapter may be lost.", 
        icon: "warning",
        buttons: {
          cancel: "No",
          confirm: "Yes"
        }
      }).then( val => {
        if(val) {
            hideAllSection();
            // afficher les chapitre précédente;
            let section1 = chapterPage_Array.find(e => !e.classList.contains('deleted'));

            showSection(section1.id);
            // supprimer section
            let section = e.parentElement.parentElement.parentElement;
            // set deleted
            chapterPage_Array.forEach(e => {
                if (e.id === section.id) e.classList.add('deleted');
            })
            section.remove();
            // afficher les boutons pour chapitres
            showFinishedChapter();
            // verifier
            if (chapterPage_Array.some(e => e.classList.contains('showing-page') && e.classList.contains('deleted'))) {
                showSection(chapterPage_Array.find(e => !e.classList.contains('deleted')).id)
            }
            // set select value
            document.getElementById('nextchap').value = section1.id;
        }
      });
}

function resetDeletedSection() {
    for (const section of getSections())
        if (section.classList.contains('deleted'))
            section.remove();
}

function appendSection(id) {
    let section = chapterPage_Array.find(e => e.id === id);
    addNewSection(section);
}


// fonciton pour ajouter un nouveau page
function getSectionContentFile(file) {
    var section = '';
    var f = new XMLHttpRequest();
    f.open("GET", file, false);
    f.onreadystatechange = function () {
      if(f.readyState === 4) {
          if(f.status === 200 || f.status == 0) {
            section += f.responseText;
          }
      }
    }
    f.send(null);
    return section;
}

function showFinishedChapter() {
    document.getElementById('chapfinished').innerHTML = '';
    chapterPage_Array.forEach(e => {
        if (!e.classList.contains('deleted')) {
            let btn = document.createElement('button');
            btn.innerHTML = e.id;
            btn.className = 'btn '+ (!e.classList.contains('showing-page') ? 'btn-light text-dark' : 'btn-info text-white') +' float-start mr-2 px-3 my-2 sectionbtn';
            btn.type = "button";
            btn.target = e.id;
            btn.addEventListener('click', function() {
                showSection(this.target);
                this.classList.replace('btn-dark', 'btn-danger');
            })
            document.getElementById('chapfinished').append(btn);
        }
    });

}
