const dBTN = document.querySelector("div#screen-bright");
const nBTN = document.querySelector("div#screen-dark");
if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark");
    if (dBTN.classList.contains("hide")) {
        dBTN.classList.remove("hide");
    }
    nBTN.classList.add("hide");
}
dBTN.addEventListener("click", () => {
    modeSwap();
    localStorage.removeItem("darkMode")
})
nBTN.addEventListener("click", () => {
    modeSwap();
    localStorage.setItem("darkMode", "on")
})

function modeSwap() {
    document.body.classList.toggle("dark");
    dBTN.classList.toggle("hide");
    nBTN.classList.toggle("hide");
    console.log("fix");
}




document.querySelector("#cleaner").addEventListener("click", () => {
    document.querySelector("#text-input").value = ""
})
document.querySelector("#closer").addEventListener("click", () => {
    document.querySelector("#search-input").removeAttribute("data-nextsiblingon")
})
fetch('https://raw.githubusercontent.com/ToggleKit/config-bp-pps/refs/heads/main/url.json')
    .then(response => response.json())
    .then(data => {
        window.suggestionsData = data;
    });
const searchBar = document.querySelector("#input-div>input");

searchBar.addEventListener("keyup", () => {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    
    if (searchBar.value.length === 0) {
        suggestionsContainer.style.display = "none";
        return;
    }
    const matched = Object.keys(window.suggestionsData)
        .find(key => key.toLowerCase().startsWith(searchBar.value.toLowerCase()));
    
    if (matched) {
        const a = document.createElement('a');
        a.id = 'matched-item';
        a.textContent = matched;
        a.href = window.suggestionsData[matched];
        suggestionsContainer.appendChild(a);
        suggestionsContainer.style.display = "flex";
        const newSuggestionsData = Object.assign({}, window.suggestionsData);
        delete newSuggestionsData[matched];
        const suggestions = Object.keys(newSuggestionsData)
            .filter(key => key.toLowerCase().includes(searchBar.value.toLowerCase()))
            .map(key => {
                const a = document.createElement('a');
                a.className = 'suggestion-item';
                a.textContent = key;
                a.href = newSuggestionsData[key]
                return a;
            });
        
        suggestions.forEach(suggestion => {
            suggestionsContainer.style.display = "flex";
            suggestionsContainer.appendChild(suggestion)
            let pageLinks = suggestionsContainer.querySelectorAll("a");
            pageLinks.forEach(pageLink => {
                pageLink.addEventListener("click", () => {
                    suggestionsContainer.style.display = "none";
                    searchBar.value = ""
                })
            })
        });
        
    } else {
        const suggestions = Object.keys(window.suggestionsData)
            .filter(key => key.toLowerCase().includes(searchBar.value.toLowerCase()))
            .map(key => {
                const a = document.createElement('a');
                a.className = 'suggestion-item';
                a.textContent = key;
                a.href = window.suggestionsData[key]
                return a;
            });
        
        suggestions.forEach(suggestion => {
            suggestionsContainer.style.display = "flex";
            suggestionsContainer.appendChild(suggestion)
        });
    }
});
searchBar.addEventListener("keyup", (e) => {
    const suggestionsContainer = document.getElementById('suggestions');
    let pageLinks = suggestionsContainer.querySelectorAll("a");
    if (e.key === "Enter") {
        const matchedItem = document.querySelector("#matched-item");
        if (matchedItem) {
            matchedItem.click();
            suggestionsContainer.style.display = "none";
            searchBar.value = "";
        }
    }
    pageLinks.forEach(pageLink => {
        pageLink.addEventListener("click", () => {
            suggestionsContainer.style.display = "none";
            searchBar.value = ""
        })
    })
})
document.addEventListener("keydown", (e) => {
    if (e.key === "/") {
        const searchInput = document.querySelector("#search-input")
        searchInput.toggleAttribute("data-nextsiblingon")
        if (searchInput.getAttribute("data-nextsiblingon") === "") {
            document.querySelector("#text-input").focus()
        }
        e.preventDefault()
    }
});
