//Selectores 
const form = document.querySelector('#form');
const inputName = document.querySelector('#nameFigure');
const selectFigure = document.querySelector('#selectFigure');
const divNamePrev = document.querySelector('.name-prev');
const divFigurePrev = document.querySelector('.figure-prev');
const card = document.querySelector('.card');
const tbody = document.querySelector('#listFigures');
const alertMessage = document.querySelector('.alert-message');
const btnAdd = document.querySelector('.btn-add');
const selectSearch = document.querySelector('#selectSearch');
const inputSearch = document.querySelector('#inputSearch');
let figures = [];
let figuresEdit = [];



loadEvent();
function loadEvent(){
    inputName.addEventListener('keyup', addPreviewName);

    selectFigure.addEventListener('change', addPreviewFigure);
    
    form.addEventListener('submit', addFigure);
    
    selectSearch.addEventListener('change', searchSelectFigures);

    inputSearch.addEventListener('keyup', searchInputFigures);

    document.addEventListener('DOMContentLoaded', () => {
        figures = JSON.parse(localStorage.getItem('figures') || []);
        listFigures(figures);
    });
}

function addPreviewName(e) {
    
    if(document.querySelector('.exist-name')){
        document.querySelector('.exist-name').remove()
    }
    const h5 = document.createElement('h5');
    h5.classList.add('exist-name');
    h5.classList.add('text-center');
    h5.textContent = e.target.value;
    divNamePrev.append(h5);
}

function addPreviewFigure(e){
    if(document.querySelector('.exist-figure')){
        document.querySelector('.exist-figure').remove()
    }

    const div = document.createElement('div');
    div.classList.add('exist-figure');
    div.classList.add(e.target.value);
    divFigurePrev.append(div);
}

function addFigure(e){
    e.preventDefault();
    if(!inputName.value || selectFigure.value === 'null'){
       generateAlert('alert-danger', 'Necesitas llenar todos los campos');
       return;
    }

    if(!form.setAttribute('is-edit', 'true')){
        infoFigure = {
            id: Date.now(),
            name: inputName.value,
            figure: selectFigure.value
        };
        figures.push(infoFigure);
    }else{
        figuresEdit.forEach(figure => {
            figure.name = inputName.value;
            figure.figure = selectFigure.value;
        });

        figures.push(figuresEdit);
        
    }

    btnAdd.textContent = 'Agregar Figura'; 
    btnAdd.classList.remove('btn-warning');
    btnAdd.classList.add('btn-success');

    listFigures(figures);
    divNamePrev.innerHTML = "";
    divFigurePrev.innerHTML = "";
    form.reset();
}

function deleteFigure(id){
    figures = figures.filter(figure => figure.id !== id);
    listFigures(figures);
    generateAlert('alert-success', 'Figura Eliminada Satisfactoriamente');
}
 function editFigure(id){
     figuresEdit = figures.filter(figure => figure.id === id);
     figures = figures.filter(figure => figure.id !== id);
    loadDataForm(figuresEdit);
 }

 function searchSelectFigures(e){
     if(e.target.value === 'all'){
        listFigures(figures);
     }else{
        const searchFigures = figures.filter(figure => figure.figure === e.target.value);
        listFigures(searchFigures);
     }
}

function searchInputFigures(e){
    const text = e.target.value.toLowerCase();
    let newList = [];

    figures.forEach(figure => {
        let name = figure.name.toLowerCase();
        if(name.indexOf(text) !== -1){
            newList.push({
                id: figure.id,
                name: figure.name,
                figure: figure.figure
            });
            listFigures(newList);
        }else{
            listFigures([]);
        }
    });
}

function generateAlert(typeAlert, msg){
    alertMessage.innerHTML = "";
    const divAlert = document.createElement('div');
    divAlert.classList.add('alert');
    divAlert.classList.add(typeAlert);
    divAlert.classList.add('alert-dismissible');
    divAlert.classList.add('fade');
    divAlert.classList.add('show');

    divAlert.innerHTML= `
    <strong>${msg}.</strong>
    `;
    
    alertMessage.appendChild(divAlert);
    setTimeout(() => {
        divAlert.remove();
    }, 3000);
}

function listFigures(data){
    tbody.innerHTML = "";
    data.forEach(figure => {
        tbody.innerHTML += `
        <tr id="${figure.id}">
            <td class="text-center">${figure.name}</td>
            <td>
                <div class=${figure.figure}></div>
            </td>
            <td>
                <button class="btn btn-primary btn-edit" onclick="editFigure(${figure.id})">
                    Editar
                </button>
                <button class="btn btn-danger btn-delete" onclick="deleteFigure(${figure.id})">
                    Eliminar
                </button>
            </td> 
        </tr>
        `;
    });

    syncStorage();

}

function loadDataForm(data){
    let name = '';
    let selectFigure = '';
    data.forEach(figure => {
        name = figure.name;
        selectFigure = figure.figure;
    });
    form.setAttribute('is-edit', 'true');
    inputName.value = name;
    document.querySelector(`#selectFigure option[value="${selectFigure}"]`).setAttribute('selected', true);
    btnAdd.textContent = 'Editar Figura'; 
    btnAdd.classList.remove('btn-success');
    btnAdd.classList.add('btn-warning');
    
    loadDivEdit(name, selectFigure);

}

function syncStorage(){
    localStorage.setItem('figures', JSON.stringify(figures));
}

function loadDivEdit(name, figure){
    divFigurePrev.innerHTML = "";
    divNamePrev.innerHTML = "";

    const h5 = document.createElement('h5');
    h5.classList.add('exist-name');
    h5.classList.add('text-center');
    h5.textContent = name;
    divNamePrev.append(h5);

    const div = document.createElement('div');
    div.classList.add('exist-figure');
    div.classList.add(figure);
    divFigurePrev.append(div); 
}