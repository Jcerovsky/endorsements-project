//still need to figure out how to remove only the specific endorsement-individual and not the whole list

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://intranet-social-media-default-rtdb.firebaseio.com/"
}

const textAreaEl = document.getElementById('text-area')
const fromInputEl = document.getElementById('from-input')
const toInputEl = document.getElementById('to-input')
const publishBtn = document.getElementById('publish-btn')
const endorsementsDiv = document.getElementById('endorsements')
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsmentListInDB = ref(database, 'endorsments')
let endorsementsHtml = ''

publishBtn.addEventListener('click', (e) => {
    const textAreaValue = textAreaEl.value
    const fromValue = fromInputEl.value
    const toValue = toInputEl.value
    
    if (textAreaValue && fromValue && toValue) {
        push(endorsmentListInDB, {
            sender: fromValue,
            text: textAreaValue,
            receiver: toValue,
        })
    }
    textAreaEl.value = ''
    fromInputEl.value = ''
    toInputEl.value = ''
})

endorsementsDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('like-emoji')) {
        const likeBtn = document.querySelector('.like-emoji')
        const likeCountEl = e.target.nextElementSibling
        let likeCount = parseInt(likeCountEl.textContent)
        likeCount++
        likeCountEl.textContent = likeCount
    }
})



onValue(endorsmentListInDB, function(snapshot) {
    
    if (snapshot.exists()) {
        endorsementsDiv.replaceChildren()
        
        let itemsArray = Object.entries(snapshot.val())
        endorsementsHtml = ''

        for (let i=0; i<itemsArray.length; i++) {
            let currentItem = itemsArray[i]

            let currentItemId = currentItem[0]
            let currentItemFrom = currentItem[1].sender
            let currentItemText = currentItem[1].text
            let currentItemTo = currentItem[1].receiver
            
            const decko = document.createElement('div');
            decko.classList.add('endorsements-individual');
            
            decko.innerHTML = `
            <p class="endorsements-receiver"><strong>To ${currentItemTo}</strong></p>
                <p>${currentItemText}</p>
                <div class="endorsements-bottom">
                    <p class="endorsements-sender"><strong>From ${currentItemFrom}</strong></p>
                    <p class="like-emoji">❤</p>
                    <p class="like-count">${Math.floor(Math.random() * 10)}</p>
                </div>`
                
                  
            decko.addEventListener("dblclick", function(e) {
                
             console.log('klikol som na',currentItemId)
                
                    let exactLocationOfItemInDB = ref(database, `/endorsments/${currentItemId}`)
                    remove(exactLocationOfItemInDB)   
             }) 
            
            endorsementsDiv.appendChild(decko)
        
          


        }
  
        
    } else {
        endorsementsDiv.innerHTML = 'No endorsements here...'
    }
    
})



