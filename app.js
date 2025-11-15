const urlInput = document.getElementById("url");
const statusEl = document.getElementById("status");
const summaryEl = document.getElementById("summary");
const lookupButton = document.getElementById("lookup");

const API_KEY = "YOUR_API_KEY_HERE";

function encodeURL(url) {
  return btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function scanUrl() {
  const rawUrl = urlInput.value.trim();

  if (!rawUrl) {
    statusEl.textContent = "Please enter a URL.";
    return;
  }

  summaryEl.textContent = "";
  lookupButton.disabled = true;
  statusEl.textContent = "Scanning…";

  try {
    const encoded = encodeURL(rawUrl);

    const report = await fetch(
      `https://www.virustotal.com/api/v3/urls/${encoded}`,
      { headers: { "x-apikey": API_KEY } }
    );

    const data = await report.json();

    const stats = data.data.attributes.last_analysis_stats;

    statusEl.textContent = "Scan complete.";
    summaryEl.textContent =
      `Malicious: ${stats.malicious}, ` +
      `Suspicious: ${stats.suspicious}, ` +
      `Harmless: ${stats.harmless}`;

  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  }

  lookupButton.disabled = false;
}

lookupButton.addEventListener("click", scanUrl);
urlInput.addEventListener("keydown", e => {
  if (e.key === "Enter") scanUrl();
});
