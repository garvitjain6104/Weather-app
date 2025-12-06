const apiKey = "e2f6806712ffce2b988456515854ed8d";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.querySelector(".error");
const loader = document.querySelector(".loader");

// Feature: Live Clock & Date
function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    document.getElementById("date").innerText = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById("time").innerText = now.toLocaleTimeString('en-US', timeOptions);
}
setInterval(updateDateTime, 1000); 
updateDateTime(); 

// Helper to format Unix timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

async function fetchWeather(url) {
    loader.style.display = "block";
    weatherDiv.style.display = "none";
    errorDiv.style.display = "none";

    try {
        const response = await fetch(url);
        
        if (response.status == 404) {
            errorDiv.style.display = "block";
            loader.style.display = "none";
            return;
        }

        const data = await response.json();

        // --- Update Data Points ---
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".description").innerHTML = data.weather[0].description;
        
        // Grid Details
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".feels-like").innerHTML = Math.round(data.main.feels_like) + "°C";
        document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
        document.querySelector(".sunrise").innerHTML = formatTime(data.sys.sunrise);
        document.querySelector(".sunset").innerHTML = formatTime(data.sys.sunset);

        // --- UPDATED ICON LOGIC HERE ---
        const weatherCondition = data.weather[0].main;

        if (weatherCondition == "Clouds") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
        } 
        else if (weatherCondition == "Clear") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
        } 
        else if (weatherCondition == "Rain") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
        } 
        else if (weatherCondition == "Drizzle") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/3076/3076129.png";
        } 
        // FIX: Grouped Mist, Haze, Fog, and Smoke together
        else if (["Mist", "Haze", "Fog", "Smoke"].includes(weatherCondition)) {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
        } 
        else if (weatherCondition == "Snow") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/642/642000.png";
        } 
        else if (weatherCondition == "Thunderstorm") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1146/1146860.png";
        }
        else {
            // Default fallback icon for unknown weather
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
        }
        // -------------------------------

        // Animation Reset
        weatherDiv.style.animation = 'none';
        weatherDiv.offsetHeight; 
        weatherDiv.style.animation = null; 

        loader.style.display = "none";
        weatherDiv.style.display = "block";

    } catch (error) {
        console.error("Error:", error);
        loader.style.display = "none";
    }
}

function checkWeatherByCity(city) {
    if (city.trim() === "") return;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
    fetchWeather(apiUrl);
}

function checkWeatherByCoords(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetchWeather(apiUrl);
}

searchBtn.addEventListener("click", () => checkWeatherByCity(searchBox.value));
searchBox.addEventListener("keypress", (e) => { if (e.key === "Enter") checkWeatherByCity(searchBox.value); });

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => checkWeatherByCoords(position.coords.latitude, position.coords.longitude),
            () => checkWeatherByCity("New York")
        );
    } else {
        checkWeatherByCity("New York");
    }
});