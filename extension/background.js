// EXPRESSO AI Agent — Background Service Worker
// Receives commands from the web app and routes them to the active tab's content script

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://expresooai.vercel.app"
];

// Listen for messages from the web app (externally_connectable)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  const origin = sender.origin || sender.url?.split("/").slice(0, 3).join("/");
  if (!ALLOWED_ORIGINS.some(o => origin?.startsWith(o))) {
    sendResponse({ success: false, error: "Unauthorized origin" });
    return;
  }

  handleCommand(message, sendResponse);
  return true; // keep channel open for async response
});

// Also listen from popup / internal pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.source === "popup" || message.source === "content") {
    handleCommand(message, sendResponse);
    return true;
  }
});

async function handleCommand(message, sendResponse) {
  const { action, payload } = message;

  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      sendResponse({ success: false, error: "No active tab found" });
      return;
    }

    // Inject content script if not already there
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    } catch (_) {
      // Already injected — ignore
    }

    // Forward command to content script
    const result = await chrome.tabs.sendMessage(tab.id, { action, payload });
    sendResponse({ success: true, result, tabUrl: tab.url, tabTitle: tab.title });

  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}

// Store extension ID in local storage so web app can read it
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ extensionId: chrome.runtime.id, installed: true });
  console.log("EXPRESSO AI Agent installed. Extension ID:", chrome.runtime.id);
});
