// Pulling ZIP Code input from the user
function Info(zip, button, table){
    this.zip= document.querySelector(zip);
    this.button= document.querySelectorAll(button);
    this.table= document.querySelector(table);
    let input= this.zip;
    window.onload= function(){
        document.querySelector(zip).focus();
    };
    input.addEventListener('input', function(){ // There's no way of MAXLENGTH in html number input element, so it's needed to it ONINPUT action
        if(input.value.length >8){
            input.value= input.value.slice(0,8); 
        }
    }, false);
}

Info.prototype.on= function on(event, execution){      
    Array.prototype.forEach.call(this.button, function(item){
        item.addEventListener(event, execution, false);
    });    
};
Info.prototype.getCode= function getCode(){
    return this.zip;
};
Info.prototype.getTable= function getTable(){
    return this.table;
};
Info.prototype.getDataCep= function getDataCep(){
    let cep= new XMLHttpRequest();
    let table= this.getTable();
    cep.open('GET', 'https://viacep.com.br/ws/'+this.getCode().value+'/json/');
    cep.onreadystatechange= function(){
        if(cep.readyState === 4 && cep.status === 200){
            const data= JSON.parse(cep.responseText);
            setDataCep(data, table);
            return true;
        }
        if(cep.status === 0){
            throw Error('CEP invalid');
        }
    };
    cep.send();
    this.getCode().value= '';    
};

Info.prototype.getDataZip= function getDataZip(){
    const zip= new XMLHttpRequest();
    let table= this.getTable();
    zip.open('GET', 'http://api.zippopotam.us/us/'+this.getCode().value);
    zip.onreadystatechange= function(){
        if(zip.readyState === 4 && zip.status === 200){
            const data= JSON.parse(zip.responseText);
            setDataZip(data, table);
            return true;
        }
        if(zip.status === 0){
            throw Error('ZIP Code invalid');
        }
    };
    zip.send();
    this.getCode().value= '';    
};

function setDataZip(data, table){
    let tbody= document.querySelector('[data-id="tbody-zip"]');
    let line= document.createElement('tr');
    let zipType= document.createElement('th');
    zipType.setAttribute('scope', 'row');
    zipType.textContent= 'ZIP';
    let zipCode= document.createElement('td');
    zipCode.textContent= data['post code'];
    let zipAddress= document.createElement('td');
    zipAddress.textContent= 'No Address Information';
    let zipNeighborhood= document.createElement('td');
    zipNeighborhood.textContent= data.places[0]['place name'];
    let zipState = document.createElement('td');
    zipState .textContent= data.places[0]['state'];
    
    line.innerHTML+= zipType.outerHTML + zipCode.outerHTML + zipAddress.outerHTML + zipNeighborhood.outerHTML + zipState .outerHTML;
    tbody.appendChild(line);
    table.appendChild(tbody);
}
function setDataCep(data, table){
    let tbody= document.querySelector('[data-id="tbody-zip"]');
    let line= document.createElement('tr');
    let cepType= document.createElement('th');
    cepType.setAttribute('scope', 'row');
    cepType.textContent= 'CEP';
    let cepCode= document.createElement('td');
    cepCode.textContent= data.cep;
    let cepAddress= document.createElement('td');
    cepAddress.textContent= data.logradouro;
    let cepNeighborhood= document.createElement('td');
    cepNeighborhood.textContent= data.bairro;
    let cepState= document.createElement('td');
    cepState.textContent= data.localidade;
        line.innerHTML+= cepType.outerHTML + cepCode.outerHTML + cepAddress.outerHTML + cepNeighborhood.outerHTML + cepState.outerHTML;
    tbody.appendChild(line);
    table.appendChild(tbody);
}

let user= new Info('[data-id="zip"]', '[data-id="consult-zip"]', '[data-id="table-zip"]');
user.on('click', function(event){
    event.preventDefault();
    let input= user.getCode().value;
    if(input.length === 5){
        user.getDataZip();
    }
    if(input.length === 8){
        user.getDataCep();
    }
});