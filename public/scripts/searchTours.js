function searchTours() {
    console.log("Search button clicked!");

    const country = document.getElementById('countryInput').value;
    const city = document.getElementById('cityInput').value;
    const hotel = document.getElementById('hotelInput').value;
    const dateRange = document.getElementById('dateRange').value;
    const adults = document.getElementById('adults').value;
    const children = document.getElementById('children').value;

    const queryParamsObject = {
        ad: adults,
        ch: children,
        country: country,
        city: city,
        hotel: hotel,
        to: dateRange ? dateRange.split(" to ")[1] : undefined,
        from: dateRange ? dateRange.split(" to ")[0] : undefined,
    };

    const queryParams = Object.entries(queryParamsObject)
        .filter(([key, value]) => value !== '' && value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

   
        const url = `http://localhost:3000/travel/tours?${queryParams}`;
        console.log(url);
        window.location.href = url;
}