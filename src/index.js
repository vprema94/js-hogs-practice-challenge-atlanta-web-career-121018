document.addEventListener('DOMContentLoaded', setupPage)
const hogContainer = document.querySelector('#hog-container')
const hogForm = document.querySelector('#form')

function setupPage() {
    addFormHandler()
    renderAllHogs()
} 

function renderAllHogs() {
    hogContainer.textContent = ""
    getHogs().then(function(data){
        data.forEach(renderHog)
    })
} 

function getHogs() {
    return fetch('http://localhost:3000/hogs').then(res => res.json())
} 

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
            if (hog.greased) {
                hogGrease.checked = true
            } 
            hogGrease.dataset.id = hog.id
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
            deleteBtn.addEventListener("click", () => removeHog(hog))
            deleteContainer.appendChild(deleteBtn)

    hogContainer.appendChild(hogCard)
} 

function addFormHandler() {
    hogForm.addEventListener('submit', newHog)
}  

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
    let byeHog = event.target.parentElement.parentElement
    byeHog.parentElement.removeChild(byeHog)

    let id = hog.id 
    deleteHog(id) 
} 

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
    let update = event.target.checked
    let id = event.target.dataset.id 

    if (event.target.checked) {
        event.target.checked = false 
        update = false
    } else {
        event.target.checked = true
        update = true
    } 
    debugger
    // updateGrease(id, update) 
}

// function updateGrease(id, update) {
//     return fetch(`http://localhost:3000/hogs/${id}`,{
//       method: 'PATCH',
//       headers: 
//       {
//         "Content-Type": "application/json",
//         Accept: "application/json"
//       }, 
//       body: JSON.stringify({
//         greased: update
//       })
//     })     
// }  