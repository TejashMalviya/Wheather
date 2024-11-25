const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-SearchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-SearchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const searchInput = document.querySelector("[data-searchInput]");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const API_KEY = "151e9984ae65a82eb6299c31a426f9bf";

let currentTab = userTab;
currentTab.classList.add("current-tab");

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (clickedTab === searchTab) {
            searchForm.classList.add("active");
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
        } else {
            searchForm.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => switchTab(userTab));
searchTab.addEventListener("click", () => switchTab(searchTab));

grantAccessButton.addEventListener("click", getLocation);
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchWeatherByCity(searchInput.value);
});

function getFromSessionStorage() {
    const coordinates = sessionStorage.getItem("user-coordinates");
    if (!coordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        fetchWeatherByCoordinates(JSON.parse(coordinates));
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    const coords = { lat: position.coords.latitude, lon: position.coords.longitude };
    sessionStorage.setItem("user-coordinates", JSON.stringify(coords));
    fetchWeatherByCoordinates(coords);
}

async function fetchWeatherByCoordinates({ lat, lon }) {
    try {
        loadingScreen.classList.add("active");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        renderWeatherInfo(data);
    } catch (err) {
        console.error(err);
    } finally {
        loadingScreen.classList.remove("active");
    }
}

async function fetchWeatherByCity(city) {
    try {
        loadingScreen.classList.add("active");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        renderWeatherInfo(data);
    } catch (err) {
        console.error(err);
    } finally {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(data) {
    document.querySelector("[data-cityName]").innerText = data.name;
    document.querySelector("[data-weatherDesc]").innerText = data.weather[0].description;
    document.querySelector("[data-temp]").innerText = `${data.main.temp} °C`;
    document.querySelector("[data-windSpeed]").innerText = `${data.wind.speed} m/s`;
    document.querySelector("[data-humidity]").innerText = `${data.main.humidity}%`;
    document.querySelector("[data-cloudiness]").innerText = `${data.clouds.all}%`;

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelector("[data-weatherIcon]").src = iconUrl;

    const flagUrl = `https://flagcdn.com/144x108/${data.sys.country.toLowerCase()}.png`;
    document.querySelector("[data-countryIcon]").src = flagUrl;

    userInfoContainer.classList.add("active");
}
