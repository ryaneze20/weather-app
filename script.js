const MY_API_KEY = config.API_KEY; // OpenWeatherMap API key

document.getElementById("search-btn").addEventListener("click", () => {
    const cityInput = document.getElementById("city-input").value.trim();
    if (cityInput === "") {
        alert("Please enter a city name.");
        return;
    }

    fetchUserLocation(cityInput)
        .then(location => {
            if (location) {
                console.log("User selected location:", location);
                console.log("Latitude:", location.lat);
                console.log("Longitude:", location.lon);

                // Now fetch weather
                fetchWeather(location.lat, location.lon)
                    .then(weatherData => {
                        console.log("Current:", weatherData.current);
                        console.log("Hourly (next 6):", weatherData.hourly.slice(0, 6));
                    })
                    .catch(error => {
                        console.error("Error fetching weather:", error);
                    });
            }
        })
        .catch(error => {
            console.error("Error fetching user location:", error);
            alert("Could not find the specified city. Please try again.");
        });
});

function fetchUserLocation(cityInput) {
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=5&appid=${MY_API_KEY}`;
    return fetch(geoURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network Response was not ok: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                throw new Error("No result for specified city");
            }
            return data[0]; // Return the first match
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        });
}

function fetchWeather(lat, lon) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=metric&appid=${MY_API_KEY}`;
    return fetch(weatherURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Weather API response not ok: " + response.statusText);
            }
            return response.json();
        });
}
