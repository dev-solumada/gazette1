const tableScript = () => {
// document.getElementById("app_add").style.visibility = "hidden";
// document.getElementById("appagt_add").style.visibility = "hidden";
// document.getElementById("appnice_add").style.visibility = "hidden";
}


let number_trapp=1;
let number_trowner=1;
let number_trpowner=1;
let number_tragt=1;
let number_trnice=1;
function fieldempty(f1,f2,f3,app){
    f1 = document.getElementById(f1);
    f2 = document.getElementById(f2);
    f3 = document.getElementById(f3);
    if (f1.value == "" || f2.value == "" || f3.value == ""){
        document.getElementById(app).style.visibility = "hidden";
    }
    else{
        document.getElementById(app).style.visibility = "visible";
    }
}
function fieldemptynice(f1,f2,app){
    f1 = document.getElementById(f1);
    f2 = document.getElementById(f2);
    if (f1.value == 0 || f2.value == ""){
        document.getElementById(app).style.visibility = "hidden";
    }
    else{
        document.getElementById(app).style.visibility = "visible";
    }
}

function addelementapp(e){
    const table = e.parentElement.parentElement.nextSibling.nextSibling;
    let parentElement1 = document.getElementsByName('731-name')[0];
    let parentElement2 = document.getElementsByName('731-address')[0];
    let parentElement3 = document.getElementsByName('731-country')[0];
    if (parentElement1.hasAttribute('disabled') && parentElement2.hasAttribute('disabled') && parentElement3.hasAttribute('disabled')) return;
    if (table.childNodes[3].childElementCount < 5){
        let step =0;
        let apllicant = table.childNodes[3];
        let elementtr = document.createElement("tr");
        elementtr.setAttribute("id","trapp"+number_trapp);
        while(step <= 3 ){
            if (step<3){
                let elementtdname = document.createElement("td");
                let elementinput = document.createElement("input");
                let firstInputId = ''; 
                if (step === 0){
                    elementinput.name = '731-name';
                    firstInputId = 'name731';
                    elementinput.id = 'name731-'+number_trapp;
                }
                else if (step === 1){
                    elementinput.name = '731-address';
                    firstInputId = 'address731';
                    elementinput.id = 'address731-'+number_trapp;
                }
                else if(step === 2) {
                    elementinput.name = '731-country';
                    firstInputId = 'country731';
                    elementinput.id = 'country731-'+number_trapp;
                }
                // desactiver le champ si le premier element est désactivé
                const firstInput = document.getElementById(firstInputId+'-0');
                if (firstInput) {
                    if (firstInput.disabled)
                    elementinput.setAttribute("disabled",true);
                }

                elementinput.setAttribute("class", 'select');
                elementtdname.appendChild(elementinput);
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
            else{
                let elementtdname = document.createElement("td");
                let elementimg = document.createElement("img");
                elementimg.setAttribute("onclick", 'deleteRow(this)');
                elementimg.setAttribute("src",'assets/images/Delete-icon.png');
                elementimg.setAttribute("class","btn");
                elementimg.setAttribute("width",'24px');
                elementimg.setAttribute("height",'24px');
                elementtdname.appendChild(elementimg);
                elementtdname.setAttribute("align","center")
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
        
        step++;
    }
    number_trapp++;
    }
    callScripts(); // method from main.js
}

function addelementowner(e){
    const table = e.parentElement.parentElement.nextSibling.nextSibling;
    let parentElement1 = document.getElementsByName('732-name')[0];
    let parentElement2 = document.getElementsByName('732-address')[0];
    let parentElement3 = document.getElementsByName('732-country')[0];
    if (parentElement1.hasAttribute('disabled') && parentElement2.hasAttribute('disabled') && parentElement3.hasAttribute('disabled')) return;
    if (table.childNodes[3].childElementCount < 5){
        let step =0;
        let apllicant = table.childNodes[3];
        let elementtr = document.createElement("tr");
        elementtr.setAttribute("id","trowner"+number_trowner);
        while(step <= 3 ){
            if (step<3){
                let elementtdname = document.createElement("td");
                let elementinput = document.createElement("input");
                let firstInputId = ''; 
                if (step === 0){
                    elementinput.name = '732-name';
                    firstInputId = 'name732-0';
                    elementinput.id = 'name732-'+number_trowner;
                }
                else if (step === 1){
                    elementinput.name = '732-address';
                    firstInputId = 'address732-0';
                    elementinput.id = 'address732-'+number_trowner;
                }
                else if(step === 2) {
                    elementinput.name = '732-country';
                    firstInputId = 'country732-0';
                    elementinput.id = 'country732-'+number_trowner;
                }
                // desactiver le champ si le premier element est désactivé
                const firstInput = document.getElementById(firstInputId);
                if (firstInput) {
                    if (firstInput.disabled)
                    elementinput.setAttribute("disabled",true);
                }

                elementinput.setAttribute("class", 'select');
                elementtdname.appendChild(elementinput);
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
            else{
                let elementtdname = document.createElement("td");
                let elementimg = document.createElement("img");
                elementimg.setAttribute("onclick", 'deleteRow(this)');
                elementimg.setAttribute("src",'assets/images/Delete-icon.png');
                elementimg.setAttribute("class","btn");
                elementimg.setAttribute("width",'24px');
                elementimg.setAttribute("height",'24px');
                elementtdname.appendChild(elementimg);
                elementtdname.setAttribute("align","center")
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
        
        step++;
    }
    number_trowner++;
    }
    callScripts(); // method from main.js
}

function addelementpowner(e){
    const table = e.parentElement.parentElement.nextSibling.nextSibling;
    let parentElement1 = document.getElementsByName('770-name')[0];
    let parentElement2 = document.getElementsByName('770-address')[0];
    let parentElement3 = document.getElementsByName('770-country')[0];
    if (parentElement1.hasAttribute('disabled') && parentElement2.hasAttribute('disabled') && parentElement3.hasAttribute('disabled')) return;
    if (table.childNodes[3].childElementCount < 5){
        let step =0;
        let apllicant = table.childNodes[3];
        let elementtr = document.createElement("tr");
        elementtr.setAttribute("id","trpowner"+number_trpowner);
        while(step <= 3 ){
            if (step<3){
                let elementtdname = document.createElement("td");
                let elementinput = document.createElement("input");
                let firstInputId = ''; 
                if (step === 0){
                    elementinput.name = '770-name';
                    firstInputId = 'name770-0';
                    elementinput.id = 'name770-'+number_trpowner;
                }
                else if (step === 1){
                    elementinput.name = '770-address';
                    firstInputId = 'address770-0';
                    elementinput.id = 'address770-'+number_trpowner;
                }
                else if(step === 2) {
                    elementinput.name = '770-country';
                    firstInputId = 'country770-0';
                    elementinput.id = 'country770-'+number_trpowner;
                }
                // desactiver le champ si le premier element est désactivé
                const firstInput = document.getElementById(firstInputId);
                if (firstInput) {
                    if (firstInput.disabled)
                    elementinput.setAttribute("disabled",true);
                }

                elementinput.setAttribute("class", 'select');
                elementtdname.appendChild(elementinput);
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
            else{
                let elementtdname = document.createElement("td");
                let elementimg = document.createElement("img");
                elementimg.setAttribute("onclick", 'deleteRow(this)');
                elementimg.setAttribute("src",'/Delete-icon.png');
                elementimg.setAttribute("class","btn");
                elementimg.setAttribute("width",'24px');
                elementimg.setAttribute("height",'24px');
                elementtdname.appendChild(elementimg);
                elementtdname.setAttribute("align","center")
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
        
        step++;
    }
    number_trpowner++;
    }
    callScripts(); // method from main.js
}

function addelementagt(e){
    const table = e.parentElement.parentElement.nextSibling.nextSibling;
    let parent740name = document.getElementsByName('740-name')[0];
    let parent740addres = document.getElementsByName('740-address')[0];
    let parent740country = document.getElementsByName('740-country')[0];
    if (parent740name.hasAttribute('disabled') && parent740addres.hasAttribute('disabled') && parent740country.hasAttribute('disabled') ) return;
    if (table.childNodes[3].childElementCount < 5){
        var apllicant = table.childNodes[3];
        function field(name){
            let elementtdname = document.createElement("td");
            let elementinput = document.createElement("input");
            elementinput.setAttribute("name",name);
            const firstInput = document.getElementById(name);
            if (firstInput) {
                if (firstInput.disabled)
                    elementinput.setAttribute("disabled",true);
                else elementinput.setAttribute("class","select");
            }
            elementtdname.appendChild(elementinput);
            elementtr.appendChild(elementtdname);
            apllicant.appendChild(elementtr);
        }
        let step =0;
        let elementtr = document.createElement("tr");
        elementtr.setAttribute("id","tragt"+number_tragt);
        while(step <= 3 ){
                if (step === 0){
                    field("740-name");
                }
                else if (step === 1){
                    field("740-address");
                }
                else if (step === 2){
                    field("740-country");
                }
            else{
                let elementtdname = document.createElement("td");
                let elementimg = document.createElement("img");
                elementimg.setAttribute("onclick", 'deleteRow(this)');
                elementimg.setAttribute("src",'assets/images/Delete-icon.png')
                elementimg.setAttribute("class","btn");
                elementimg.setAttribute("width",'24px');
                elementimg.setAttribute("height",'24px');
                elementtdname.appendChild(elementimg);
                elementtdname.setAttribute("align","center")
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
        step++;
        }
        number_tragt++;
    }
    callScripts(); // method from main.js
}
function addelementnice(e){
    const table = e.parentElement.parentElement.nextSibling.nextSibling;
    if (table.childNodes[3].childElementCount < 5){
        let step =0;
        let apllicant = table.childNodes[3];
        let elementtr = document.createElement("tr");
        elementtr.setAttribute("id","trapp"+number_trnice);
        while(step <= 2 ){
            if (step === 0){
                let elementtdname = document.createElement("td");
                    let elementinput = document.createElement("input");
                    // desactiver le champ
                    const firstInput = document.getElementById('511');
                    if (firstInput) {
                        if (firstInput.disabled)
                            elementinput.setAttribute("disabled",true);
                        else elementinput.setAttribute("class","select");
                    }
                    elementinput.setAttribute("name","511");
                    elementinput.setAttribute("id","511");
                    elementinput.setAttribute("min","0");
                    elementinput.setAttribute("max","45");
                    elementinput.setAttribute("value","0");
                    elementinput.setAttribute("type","number");
                    elementinput.setAttribute("onchange","check511Value(this)");
                    elementtdname.appendChild(elementinput);
                    elementtr.appendChild(elementtdname);
                    apllicant.appendChild(elementtr);
            }
            else if (step === 1){
                let elementtdname = document.createElement("td");
                let elementinput = document.createElement("textarea");
                // desactiver le champ
                const firstInput = document.getElementById('510');
                if (firstInput) {
                    if (firstInput.disabled)
                        elementinput.setAttribute("disabled",true);
                    else elementinput.setAttribute("class","select");
                }
                elementinput.setAttribute("name","510");
                elementinput.setAttribute("id","510");
                elementinput.setAttribute("cols","30");
                elementinput.setAttribute("rows","1");
                elementtdname.appendChild(elementinput);
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
            else{
                let elementtdname = document.createElement("td");
                let elementimg = document.createElement("img");
                elementimg.setAttribute("onclick", 'deleteRow(this)');
                elementimg.setAttribute("src",'assets/images/Delete-icon.png');
                elementimg.setAttribute("class","btn");
                elementimg.setAttribute("width",'24px');
                elementimg.setAttribute("height",'24px');
                elementtdname.appendChild(elementimg);
                elementtdname.setAttribute("align","center")
                elementtr.appendChild(elementtdname);
                apllicant.appendChild(elementtr);
            }
        
        step++;
    }
    number_trnice++;
    
    }
    callScripts(); // method from main.js
}

function deleteRow(btn) {
    btn.parentElement.parentElement.remove();
}