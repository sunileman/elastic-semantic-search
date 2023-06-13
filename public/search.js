async function doSearch() {
    const searchTerm = document.querySelector("#search").value;
    const response = await fetch(`http://localhost:3000/search?term=${searchTerm}`);
    const data = await response.json();

    const resultsDiv = document.querySelector("#results");
    resultsDiv.innerHTML = "";  // clear any previous results

    data.forEach(item => {
        const itemDiv = document.createElement("div");

        const title = document.createElement("h2");
        title.textContent = item.Title;
        itemDiv.appendChild(title);

        const plot = document.createElement("p");
        plot.textContent = item.Plot;
        itemDiv.appendChild(plot);

        // Add a hyperlink for WikiPage
        const wikiLink = document.createElement("a");
        wikiLink.href = item.WikiPage;
        wikiLink.textContent = "More on Wikipedia";
        wikiLink.target = "_blank";  // open in a new tab
        itemDiv.appendChild(wikiLink);

        resultsDiv.appendChild(itemDiv);
    });
}

document.querySelector("#searchButton").addEventListener("click", doSearch);

document.querySelector("#search").addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      doSearch();
    }
});
