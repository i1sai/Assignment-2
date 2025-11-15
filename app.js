const cityInput = document.getElementById("city");
const statusEl = document.getElementById("status");
const summaryEl = document.getElementById("summary");
const lookupButton = document.getElementById("lookup");

const API_KEY = "1f0214cde5cb4525ab7200159251511";

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    statusEl.textContent = "Please enter a city.";
    return;
  }

  lookupButton.disabled = true;
  summaryEl.textContent = "";
  statusEl.textContent = "Fetching weather…";

  try {
    const url =
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=` +
      encodeURIComponent(city) +
      `&aqi=no`;

    const res = await fetch(url);

    if (!res.ok) {
      statusEl.textContent = "City not found.";
      lookupButton.disabled = false;
      return;
    }

    const data = await res.json();

    const temp = data.current.temp_c;
    const feels = data.current.feelslike_c;
    const condition = data.current.condition.text;
    const humidity = data.current.humidity;

    statusEl.textContent = "Weather loaded.";

    summaryEl.innerHTML = `
      🌡 Temperature: ${temp}°C<br>
      🤔 Feels Like: ${feels}°C<br>
      💧 Humidity: ${humidity}%<br>
      🌤 Condition: ${condition}
    `;

  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  }

  lookupButton.disabled = false;
}

lookupButton.addEventListener("click", getWeather);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") getWeather();
});
