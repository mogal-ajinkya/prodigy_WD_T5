const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const userTab = document.querySelector("[data-Userweather]");
const searchTab = document.querySelector("[data-Searchweather]");
const userContainer = document.querySelector(".weather-container");
const grantAcessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-search-Form]");
const loadingScreen = document.querySelector(".loading-container");
const usershowweatherInfoContainer = document.querySelector(".user-info-Container");
const notFound = document.querySelector(".notfound");


let currentTab = userTab;
currentTab.classList.add("current-tab");


function switchTab(clickedTab) {
    if (currentTab != clickedTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        // onclick if searchForm is active then make it inactive when it is clicked
        if (searchForm.classList.contains("active")) {
            // if searchform is visible hence making it invisible
            usershowweatherInfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            getsessiondata();
        }
        else {
            // searchform is invisible making it visible
            grantAcessContainer.classList.remove("active");
            usershowweatherInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})


function getsessiondata() {
    let coordinatePrev = sessionStorage.getItem("user-coordinates");
    if (coordinatePrev) {
        // if coordinates are present 

        // the coordinatePrev is in string hence it is converted in json object by using this function 
        const coordinates = JSON.parse(coordinatePrev);
        fetchWeatheinfo(coordinates);
    }
    else {
        // if not present then take and the go ahead on click in gran button 
        grantAcessContainer.classList.add("active");
    }
}

async function fetchWeatheinfo(coordinates) {
    let latitude = coordinates.lat;
    let longitude = coordinates.long;
    // take the coordinates
    grantAcessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        loadingScreen.classList.remove("active");
        usershowweatherInfoContainer.classList.add("active");
        renderweatherData(data);
    }
    catch (error) {
        console.log("Error occurred in fetching data", error);
        loadingScreen.classList.remove("active");
        grantAcessContainer.classList.add("active");
    }
}

function renderweatherData(data) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-country-Icon]");
    const weatherDesc = document.querySelector("[data-weather-Desc]");
    const weatherIcon = document.querySelector("[data-weather-Icon]");
    const temp = document.querySelector("[ data-temp]");

    const windSpeed = document.querySelector("[data-Wind-speed]");
    const humidity = document.querySelector("[data-humidity]");
    const Cloudiness = document.querySelector("[data-Cloudiness]");

    // this is optional chaining operator ---->  data?.main?.temp.toFixed(2)
    // this operator acess the further value if they are present in data or not 

    // The optional chaining (?.) operator accesses an object's property or calls a function. If the object accessed or function called using this operator is undefined or null, the expression short circuits and evaluates to undefined instead of throwing an error.   MDN DEF

    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country?.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/01n.png`;
    // 01n is temporary change it -->${data?.weather?icon.png}
    temp.innerText = `${data?.main?.temp }°C`;
    windSpeed.innerText = `${data?.wind?.speed}m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    Cloudiness.innerText = `${data?.clouds?.all}%`;
}


// opening with grant acess 
grantAcessContainer.classList.add("active");
const grantLocationbtn = document.querySelector("[data-grant-Acess]");
grantLocationbtn.addEventListener("click", getloaction);

function getloaction() {
    console.log("grant acess is clicked");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
    else {
        // console.log("something went wrong");
        usershowweatherInfoContainer.classList.remove("active");
        grantAcessContainer.classList.add("active");
    }
}

const successCallback = (position) => {
    // console.log(position);
    let coordinates =
    {
        lat: position.coords.latitude,
        long: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(coordinates));
    fetchWeatheinfo(coordinates);
};

const errorCallback = (error) => {
    // console.log(error);
    usershowweatherInfoContainer.classList.remove("active");
    grantAcessContainer.classList.add("active");
};

const searchInput = document.querySelector("[data-search-form]");
const userinputtag = document.querySelector("[data-input-Form]")
searchInput.addEventListener("submit" , (even) =>
{
    event.preventDefault();
    let cityName = userinputtag.value;
    // console.log("submit event occurred" , cityName);
    // console.log("this is cityname" , cityName);
    if(cityName == "")
    {
        return;
    }
        // return;
    else
    {
        fetchsearchWeatherInfo(cityName);
    }

})

async function fetchsearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    usershowweatherInfoContainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        usershowweatherInfoContainer.classList.add("active");
        console.log("rendering.........................");
        renderweatherData(data);
    }
    catch(error)
    {
        notFound.classList.add("active");
        console.log("error occur in fetching");
    }
}







