// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert"),
    form = document.querySelector(".grocery-form"),
    grocery = document.getElementById("grocery"),
    submitBtn = document.querySelector(".submit-btn"),
    container = document.querySelector(".grocery-container"),
    list = document.querySelector(".grocery-list"),
    clearBtn = document.querySelector(".clear-btn");




// edit option
let editElement;
let editFlag = false;
let editID = "";
const value = grocery.value
// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem)
// clear all the items
clearBtn.addEventListener("click", clearItems)
// load event
window.addEventListener("DOMContentLoaded", setupItems)
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault(); 
    // console.log(grocery.value);
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if(value && !editFlag) {
    createListItems(id, value)
    container.classList.add("show-container");
    displayAlert("The item added to the list", "success");
    // set item to the local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
    } else if(value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value has been changed",'success');
        // local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        displayAlert("Please, enter a value!", "danger");
    }
}

// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)
    // remove from the list
    setTimeout(function() {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000)
}
// clear all the items
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");
    if(items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    displayAlert("You cleared all the items", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}
// set back to default
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// delete the item
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // console.log(element);
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();
    // remove from the local storage
    removeFromLocalStorage(id);
}

function editItem(e) {
    // console.log("Item has been edited");
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // console.log(editElement);
    // set a value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    console.log(editID);
}



// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
    const grocery = {id, value};
    // console.log(grocery);
    let items = getLocalStorage();
    // console.log(items);
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));

}
function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(item => {
        if(item.id === id) {
            item.value = value
        }
        return item
    })
    localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    // console.log(id)
    // after removing we need to filter the items that have been removed with mathching id
    items = items.filter((item) => {
        if(item.id !== id) {
            return item
        }
    })
    localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}
// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();
    if(items.length > 0) {
        items.forEach(item => {
            createListItems(item.id, item.value)
        })
    }
    container.classList.add("show-container");
}

function createListItems(id, value) {
    const article = document.createElement("article");
       article.classList.add("grocery-item");
       const attribute = document.createAttribute("data-id");
       attribute.value = id;
       article.setAttributeNode(attribute);
       article.innerHTML = ` <p class="title">${value}</p>
       <div class="btn-container">
           <button type="button" class="edit-btn">
               <i class="fas fa-edit"></i>
           </button>
           <button type="button" class="delete-btn">
               <i class="fas fa-trash"></i>
           </button>
       </div>`;
       const deleteBtn = article.querySelector(".delete-btn");
       const editBtn = article.querySelector(".edit-btn");
       deleteBtn.addEventListener("click", deleteItem)
       editBtn.addEventListener("click", editItem)

    //    append child
    list.appendChild(article);
}