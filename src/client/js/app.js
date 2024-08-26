// Function to retrieve geographic coordinates and country name based on a location
const getGeoCoordinates = async (destination) => {
    const geoResponse = await fetch(`http://api.geonames.org/searchJSON?q=${destination}&maxRows=1&username=halamallak`);
    if (!geoResponse.ok) {
        throw new Error(`GeoNames API encountered an issue: ${geoResponse.status}`);
    }
    const geoData = await geoResponse.json();
    if (geoData.geonames && geoData.geonames.length > 0) {
        const { lat, lng, countryName } = geoData.geonames[0];
        return { lat, lng, countryName };
    } else {
        throw new Error('Destination not found');
    }
};

// Function to fetch the weather forecast for a specific set of coordinates
const getWeatherForecast = async (latitude, longitude) => {
    const weatherResponse = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=38bb4a36030e4ccbb0f3ec10b6ee3302`);
    const weatherData = await weatherResponse.json();
    return weatherData;
};

// Function to fetch an image for a given destination using the Pixabay API
const getImageForLocation = async (destination) => {
    const imageResponse = await fetch(`https://pixabay.com/api/?key=45627598-47083d3921db7dc19858b9c05&q=${encodeURIComponent(destination)}&image_type=photo`);
    const imageData = await imageResponse.json();
    if (imageData.hits.length > 0) {
        return imageData.hits[0].webformatURL;
    } else {
        return 'default_image_url';
    }
};

// Function to calculate the number of days until the trip starts
const calculateDaysUntilTrip = (tripStartDate) => {
    const tripDate = new Date(tripStartDate);
    const currentDate = new Date();
    const timeDifference = tripDate - currentDate;
    const daysUntilTrip = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysUntilTrip;
};

// Function to calculate the duration of the trip in days
const calculateTripLength = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const tripLength = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return tripLength;
};

// Function to display trip details in the UI
const renderTripDetails = (geoCoordinates, weatherForecast, locationImage, start, end, tripLength) => {
    const tripDetailsContainer = document.getElementById('trip-info');
    const daysUntilTrip = calculateDaysUntilTrip(start);

    tripDetailsContainer.innerHTML = `
      <h2>Journey to ${geoCoordinates.countryName}</h2>
      <img src="${locationImage}" alt="${geoCoordinates.countryName}" class="trip-img">
      <p>Departure Date: ${start}</p>
      <p>Return Date: ${end}</p>
      <p>Days until departure: ${daysUntilTrip}</p>
      <p>Trip Length: ${tripLength} days</p>
      <p>Weather Forecast: ${weatherForecast.data[0].temp}°C, ${weatherForecast.data[0].weather.description}</p>
    `;
};

export { getGeoCoordinates, getWeatherForecast, getImageForLocation, renderTripDetails, calculateTripLength };
