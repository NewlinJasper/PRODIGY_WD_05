document.addEventListener('DOMContentLoaded', function() {
    const weatherInfo = document.getElementById('weather-info');
    const locationInput = document.getElementById('location-input');
    const fetchWeatherButton = document.getElementById('fetch-weather');

    // Function to fetch weather data
    function fetchWeather(latitude, longitude) {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const { temperature, windspeed, weathercode } = data.current_weather;
                weatherInfo.innerHTML = `
                    <p>Temperature: ${temperature}°C</p>
                    <p>Windspeed: ${windspeed} m/s</p>
                    <p>Weather Code: ${weathercode}</p>
                `;
            })
            .catch(error => {
                weatherInfo.innerHTML = `<p>Unable to fetch weather data. Please try again later.</p>`;
            });
    }

    // Fetch weather data based on user input location
    fetchWeatherButton.addEventListener('click', function() {
        const location = locationInput.value.trim();
        if (location) {
            // Geocode the location to get latitude and longitude (using a public geocoding API)
            const geocodeApiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

            fetch(geocodeApiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const latitude = data[0].lat;
                        const longitude = data[0].lon;
                        fetchWeather(latitude, longitude);
                    } else {
                        weatherInfo.innerHTML = `<p>Location not found. Please try another location.</p>`;
                    }
                })
                .catch(error => {
                    weatherInfo.innerHTML = `<p>Error fetching location data. Please try again later.</p>`;
                });
        }
    });

    // Fetch weather data based on user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeather(latitude, longitude);
        }, error => {
            weatherInfo.innerHTML = `<p>Unable to retrieve your location. Please enter a location manually.</p>`;
        });
    } else {
        weatherInfo.innerHTML = `<p>Geolocation is not supported by your browser. Please enter a location manually.</p>`;
    }
});

