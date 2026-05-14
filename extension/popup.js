// Show extension ID
document.getElementById("extId").textContent = chrome.runtime.id;

// Show active tab URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (tab) {
    const url = tab.url || "—";
    const short = url.length > 40 ? url.slice(0, 40) + "…" : url;
    document.getElementById("tabUrl").textContent = short;
  }
});

// Check if content script is ready
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab?.id) return;

  chrome.tabs.sendMessage(tab.id, { action: "readPage", payload: {} }, (response) => {
    const dot = document.getElementById("statusDot");
    const text = document.getElementById("statusText");
    if (chrome.runtime.lastError || !response) {
      dot.classList.add("inactive");
      text.innerHTML = "<strong>Standby</strong> — no active page detected";
    } else {
      dot.classList.remove("inactive");
      text.innerHTML = `<strong>Ready</strong> — ${response.platform || "page"} detected`;
    }
  });
});
