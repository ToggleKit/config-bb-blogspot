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

fetch('https://raw.githubusercontent.com/ToggleKit/config-bb-blogspot/refs/heads/main/urls.json')
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
    
    const searchTerm = searchBar.value.toLowerCase();
    
    // Find first matching item where any key starts with search term
    const matchedEntry = window.suggestionsData.find(entry => 
        entry.key.some(key => key.toLowerCase().startsWith(searchTerm))
    );

    if (matchedEntry) {
        // Create matched item
        const a = document.createElement('a');
        a.id = 'matched-item';
        a.textContent = matchedEntry.key[0]; // Using first key for display
        a.href = matchedEntry.value;
        suggestionsContainer.appendChild(a);
        suggestionsContainer.style.display = "flex";

        // Find other suggestions excluding the matched entry
        const otherSuggestions = window.suggestionsData.filter(entry => 
            entry !== matchedEntry &&
            entry.key.some(key => key.toLowerCase().includes(searchTerm))
        );

        otherSuggestions.forEach(entry => {
            const a = document.createElement('a');
            a.className = 'suggestion-item';
            a.textContent = entry.key[0]; // Using first key for display
            a.href = entry.value;
            suggestionsContainer.appendChild(a);
        });
    } else {
        // Show all items that include the search term in any key
        const allSuggestions = window.suggestionsData.filter(entry => 
            entry.key.some(key => key.toLowerCase().includes(searchTerm))
        );

        allSuggestions.forEach(entry => {
            const a = document.createElement('a');
            a.className = 'suggestion-item';
            a.textContent = entry.key[0]; // Using first key for display
            a.href = entry.value;
            suggestionsContainer.appendChild(a);
        });

        if (allSuggestions.length > 0) {
            suggestionsContainer.style.display = "flex";
        } else {
            suggestionsContainer.style.display = "none";
        }
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
});
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
