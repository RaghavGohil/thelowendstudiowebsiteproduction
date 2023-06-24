const searchInput = document.getElementById('search-input')
const resultsContainer = document.getElementById('result-container')
const resultItem = document.getElementById('result-item')
const noResultItem = document.getElementById('no-result')
const resultItemContainer = document.getElementById('result-item-container')

// On start
resultsContainer.style.display = "none"
noResultItem.style.display = "none"

// TODO: make the directories better

searchInput.addEventListener('keyup' , async(e) => {
    resultItemContainer.innerHTML = ""
    resultsContainer.style.display = "block"
    let searchString = e.target.value.trim()
    if(searchString != "")
    {
        noResultItem.style.display = "none"
        await fetch('/games', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({payload:searchString})
        })
        .then(res=>res.json())
        .then(data=>{
            let payload = data.payload
            if(payload.length < 1)
            {
                noResultItem.style.display = "block"
                return
            }
            else
            {
                resultItemContainer.innerHTML = ""
                payload.forEach((item,index) => {
                    resultItemContainer.innerHTML += `<div class="result-item-container"><div class="result-item"> <div class="result-text"><p><a href="${item.d_link}"> ${item.title} </a> </p></div></div></div>`
                })
                return
            }
        })
        .catch(err => {
            console.error(err)
        })   
    }
    else
    {
        resultsContainer.style.display = "none"
    }
})