/*Country*/
let availableCountries = [
    'UAE',
    'Egypt',
    'Turkey',
    'USA',
    'England',
    'China',
];

const countryResultBox = document.querySelector(".country-result-box");
const countryInput = document.getElementById("countryInput");

countryInput.onkeyup = function(){
    let result = [];
    let input = countryInput.value;
    if(input.length){
        result = availableCountries.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
        console.log(result);
    }
    displayCountry(result);

    if(!result.length){
        countryResultBox.innerHTML = '';
    }
}

function displayCountry(result){
    const content = result.map((list)=>{
        return "<li onclick=selectCountryInput(this)>" + list + "</li>";
    })

    countryResultBox.innerHTML = "<ul>" + content.join('') + "</ul>"
}

function selectCountryInput(list){
    countryInput.value = list.innerHTML;
    countryResultBox.innerHTML = ""
}
/*City*/
let availableCities = [
    'Dubai',
    'Almaty',
    'Sharm-El-Sheikh',
    'Barcelona',
    'Rome',
    'Jupute',
    'Vanco',
]

const cityResultBox = document.querySelector(".city-result-box");
const cityInput = document.getElementById("cityInput");

cityInput.onkeyup = function(){
    let country = countryInput.value;
    if(!country.length){
        showCustomAlert("Please enter a country");
        cityResultBox.innerHTML = '';
        return
    }
    
    let result = [];
    let input = cityInput.value;

    if(input.length){
        result = availableCities.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
        console.log(result);
    }
    displayCity(result);

    if(!result.length){
        cityResultBox.innerHTML = '';
    }
}

function displayCity(result){
    const content = result.map((list)=>{
        return "<li onclick=selectCityInput(this)>" + list + "</li>";
    })

    cityResultBox.innerHTML = "<ul>" + content.join('') + "</ul>"
}

function selectCityInput(list){
    cityInput.value = list.innerHTML;
    cityResultBox.innerHTML = ""
}


/*Hotel*/
let availableHotels = [
    'Dubai Marine',
    'Elite Resort',
    'Global Class',
    'Best Hotel',
    'UAE Pearl',
    'Hello Amigo',
    'Nariman',
]

const hotelResultBox = document.querySelector(".hotel-result-box");
const hotelInput = document.getElementById("hotelInput");

hotelInput.onkeyup = function(){
    let city = cityInput.value;
    if(!city.length){
        showCustomAlert("Please enter a city");
        hotelResultBox.innerHTML = '';
        return
    }
    
    let result = [];
    let input = hotelInput.value;

    if(input.length){
        result = availableHotels.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
        console.log(result);
    }
    displayHotel(result);

    if(!result.length){
        hotelResultBox.innerHTML = '';
    }
}

function displayHotel(result){
    const content = result.map((list)=>{
        return "<li onclick=selectHotelInput(this)>" + list + "</li>";
    })

    hotelResultBox.innerHTML = "<ul>" + content.join('') + "</ul>"
}

function selectHotelInput(list){
    hotelInput.value = list.innerHTML;
    hotelResultBox.innerHTML = ""
}