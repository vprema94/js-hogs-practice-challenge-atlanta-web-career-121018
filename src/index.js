//first thing that is run is the setupPage function, once the DOM has been loaded 
document.addEventListener('DOMContentLoaded', setupPage)

//variables for where the hogs will go & where the form is 
const hogContainer = document.querySelector('#hog-container')
const hogForm = document.querySelector('#form')

//addFormHandler is run first, this gives the form a eventListener for submit, then all the piggies go on the page 
function setupPage() {
    addFormHandler()
    renderAllHogs()
} 

//first the container for all the hogs is cleared out (this prevents from having duplicates if you want to use this function again later)
//then 'getHogs()' brings us back JSON data from the url 
//then for each hog, a 'renderHog' is performed
function renderAllHogs() {
    hogContainer.textContent = ""
    getHogs().then(function(data){
        data.forEach(renderHog)
    })
} 

//fetches all the hogs, and turns it into JSON data
function getHogs() {
    return fetch('http://localhost:3000/hogs').then(res => res.json())
} 

//takes in ONE hog and creates a "card" for that hog
//then adds it to the hog container 
function renderHog(hog) {
    let hogCard = document.createElement('div')
    hogCard.className = 'hog-card'
    hogCard.dataset.id = hog.id 

        let hogName = document.createElement('h2')
        hogName.textContent = hog.name
        hogName.className = 'center-text'
        hogCard.appendChild(hogName) 

        let hogSpecialty = document.createElement('p')
        hogSpecialty.textContent = 'Specialty: ' + hog.specialty 
        hogCard.appendChild(hogSpecialty)

        let greaseContainer = document.createElement('span')
        greaseContainer.textContent = 'Greased?: '
        hogCard.appendChild(greaseContainer)

            let hogGrease = document.createElement('input')
            hogGrease.type = 'checkbox'
            //checks the box on the browser if the hog.greased value is true
            if (hog.greased) {
                hogGrease.checked = true
            } 
            hogGrease.dataset.id = hog.id
            //adds an event listener if this checkbox is checked
            hogGrease.addEventListener('change', changeGrease)
            greaseContainer.appendChild(hogGrease)

        let hogWeight = document.createElement('p')
        hogWeight.textContent = 'Ratio: ' + hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']
        hogCard.appendChild(hogWeight) 
        
        let hogMedal = document.createElement('p')
        hogMedal.textContent = 'Highest Medal Achieved: ' + hog['highest medal achieved']
        hogCard.appendChild(hogMedal) 

        let hogImage = document.createElement('img')
        hogImage.src = hog.image 
        hogCard.appendChild(hogImage) 

        let deleteContainer = document.createElement('div')
        hogCard.appendChild(deleteContainer)
            
            let deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'Delete Me :('
            //adds an event listener to the delete button, NOTE: the arrow function is vital bc it allows you to pass in the hog object to removeHog
            deleteBtn.addEventListener("click", () => removeHog(hog))
            deleteContainer.appendChild(deleteBtn)

    hogContainer.appendChild(hogCard)
} 

//adds an event listener to the new hog form 
function addFormHandler() {
    hogForm.addEventListener('submit', newHog)
}  

//takes the input values from the hog form and sends it to createHog()
function newHog() {
    event.preventDefault();
    
    let name = event.target.name.value
    let specialty = event.target.specialty.value 
    let medal = event.target.medal.value  
    let weight = event.target.weight.value 
    let img = event.target.img.value 
    let grease = event.target.greased.checked

    createHog(name, specialty, medal, weight, img, grease).then(renderHog)
    event.target.reset() // clears form
} 

//runs a fetch to POST a new hog in the database (using the user input from newHog())
function createHog(name, specialty, medal, weight, img, grease) {
    return fetch('http://localhost:3000/hogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            specialty: specialty,
            greased: grease,
            'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water': weight,
            'highest medal achieved': medal, 
            image: img
        })
    }).then(res => res.json())
} 

function removeHog(hog) {
    //the event.target is the button, the parent to that is the button container, the parent to that is the hog card (which is what we want to remove)
    let byeHog = event.target.parentElement.parentElement
    //we remove here by telling THAT parent to delete its child
    byeHog.parentElement.removeChild(byeHog)

    //we need the hog id to know which hog to delete from the database
    let id = hog.id 
    deleteHog(id) 
} 

//runs a fetch to DELETE the hog you selected using the id
function deleteHog(id) {
    return fetch(`http://localhost:3000/hogs/${id}`,{
        method: 'DELETE',
        headers: 
        {
          "Content-Type": "application/json",
          Accept: "application/json"
        }, 
      })  
} 

function changeGrease() {
    //newGrease is the new value of the check box (.checked function returns a true/false)
    let newGrease = event.target.checked
    //the id is needed to update that specific hog in the database, i put it on the button for easy acces (see line 55)
    let id = event.target.dataset.id 
    updateGrease(id, newGrease) 
}

//runs a fetch to PATCH the hog who had the checkbox changed 
function updateGrease(id, newGrease) {
    return fetch(`http://localhost:3000/hogs/${id}`,{
      method: 'PATCH',
      headers: 
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      }, 
      body: JSON.stringify({
        greased: newGrease
      })
    })     
}  