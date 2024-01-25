function searchTours() {
    console.log("Search button clicked!");

    const country = document.getElementById('countryInput').value;
    const city = document.getElementById('cityInput').value;
    const hotel = document.getElementById('hotelInput').value;
    const dateRange = document.getElementById('dateRange').value;
    const adults = document.getElementById('adults').value;
    const children = document.getElementById('children').value;

    const queryParams = `ad=${adults}&ch=${children}&country=${country}&hotel=${hotel}&city=${city}&to=${dateRange.split(" to ")[1]}&from=${dateRange.split(" to ")[0]}`;

    fetch(`http://localhost:3000/search?${queryParams}`, {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            console.log(response)
        } else {
            showCustomAlert("Internal Server Error");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}