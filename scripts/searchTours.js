function searchTours() {
    console.log("Search button clicked!");

    var country = document.getElementById('countryInput').value;
    var city = document.getElementById('cityInput').value;
    var hotel = document.getElementById('hotelInput').value;
    var dateRange = document.getElementById('dateRange').value;
    var persons = document.getElementById('persons').value;

    var queryParams = `ppl=${persons}&country=${country}&hotel=${hotel}&city=${city}&night=4&to=${dateRange.split(" to ")[1]}&from=${dateRange.split(" to ")[0]}`;

    fetch(`http://localhost:3000/search?${queryParams}`, {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'search.html';
        } else {
            showCustomAlert("Internal Server Error");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}