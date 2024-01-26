function renderCart(data) {
    const tours = data;
    console.log("tourdata", data);

    const tourCountainer = document.querySelector(".tours");

    tourCountainer.innerHTML = "";

    tours.forEach((tour) => {
        const tourElement = document.createElement("div");
        tourElement.classList.add("row", "p-0");

        
        tourElement.innerHTML = `
            <div class="inner-list mb-3">
                                    <div class="list-items">
                                        <div class="tour-container row">
                                            <div class="tour-image col-3">
                                                <img src="${tour.img}" style="max-width: 300px;;">
                                            </div>
                                            <div class="tour-info col-9">
                                                <div class="item-hotel"><span class="item-brand">${tour.hotel}</span></div>
                                                <div class="item-location"><span class="tour-country">${tour.country}</span>, <span class="tour-city"> ${tour.city}</span></div>
                                                <div class="item-date">
                                                    <div class="arrival">Arrival Date: <span class="date-arrival">${tour.arrival}</span></div>    
                                                    <div class="departure">Departure Date: <span class="date-arrival">${tour.departure}</span></div>    
                                                </div>  
                                                <div class="people">
                                                    <div class="adults">&#x1F9D2:  ${tour.adults}</div>
                                                    <div class="children">&#x1F465:   ${tour.children}</div>
                                                </div>
                                                <div class="item-price">Total Price: <span class="tour-price">${tour.price}</span>$</div>
                                            </div> 
                                        </div>
                                    </div>
                                    <hr class="solid liner mt-4">
                                </div>
        `;
        

        tourCountainer.appendChild(tourElement);
    });

    const amountOfTours = document.getElementById("amountOfTours");
    amountOfTours.textContent = tours.length;
    const plural = document.getElementById("plural");
    plural.textContent = tours.length === 1 ? "" : "s";
}

async function renderPage() {
    try {
        const queryString = window.location.search;
        console.log(queryString);
        const serverURL = `http://localhost:3000/travel/search${queryString}`;
        console.log(serverURL);
        
        // Use await to wait for the data to be fetched
        const data = await getDataFromServer(serverURL);
        console.log("query Data", data);
        
        // Now you can safely pass the data to your render function
        renderCart(data);
    } catch (error) {
        console.error("Error rendering page:", error);
    }
}

window.addEventListener('load', async () => {
    await renderPage();
});

async function getDataFromServer(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}