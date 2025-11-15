const urlInput = document.getElementById("url");
const statusEl = document.getElementById("status");
const summaryEl = document.getElementById("summary");
const lookupButton = document.getElementById("lookup");

const API_KEY = "b5646bfb70bebbf3f770501842ab57bfc58362427091223bacdeb0440ae66b7d";

async function scanUrl() {
  const targetUrl = urlInput.value.trim();

  if (!targetUrl) {
    statusEl.textContent = "Please enter a URL.";
    return;
  }

  summaryEl.textContent = "";
  lookupButton.disabled = true;
  statusEl.textContent = "Submitting URL to VirusTotal…";

  try {
    const submitRes = await fetch("https://www.virustotal.com/api/v3/urls", {
      method: "POST",
      headers: {
        "x-apikey": API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `url=${encodeURIComponent(targetUrl)}`
    });

    const submitData = await submitRes.json();
    const analysisId = submitData.data.id;

    statusEl.textContent = "Waiting for VirusTotal to finish…";

    let analysisData;
    while (true) {
      const pollRes = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { "x-apikey": API_KEY }
        }
      );
      analysisData = await pollRes.json();

      const state = analysisData.data.attributes.status;
      if (state === "completed") break;

      await new Promise(res => setTimeout(res, 1000));
    }

    const stats = analysisData.data.attributes.stats;

    statusEl.textContent = "Scan complete.";
    summaryEl.textContent =
      `Malicious: ${stats.malicious}, ` +
      `Suspicious: ${stats.suspicious}, ` +
      `Harmless: ${stats.harmless}`;

  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
  } finally {
    lookupButton.disabled = false;
  }
}

lookupButton.addEventListener("click", scanUrl);
urlInput.addEventListener("keydown", e => {
  if (e.key === "Enter") scanUrl();
});
