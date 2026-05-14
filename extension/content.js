// EXPRESSO AI Agent — Content Script
// Injected into every tab. Executes real DOM actions on behalf of the AI agent.

(function () {
  "use strict";

  // ── Utilities ──────────────────────────────────────────────────────────────

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Human-like typing: dispatches input events character by character
  async function humanType(element, text, clearFirst = true) {
    element.focus();
    if (clearFirst) {
      element.select?.();
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);
      element.value = "";
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }
    for (const char of text) {
      element.value += char;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
      element.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));
      await sleep(18 + Math.random() * 30);
    }
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Type into contenteditable (Gmail compose, WhatsApp, etc.)
  async function humanTypeContentEditable(element, text, clearFirst = true) {
    element.focus();
    if (clearFirst) {
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);
    }
    for (const char of text) {
      document.execCommand("insertText", false, char);
      await sleep(18 + Math.random() * 30);
    }
  }

  // Find element by multiple strategies
  function findElement(selector, labelText, placeholder, role) {
    if (selector) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    if (placeholder) {
      const el = document.querySelector(`[placeholder*="${placeholder}" i]`);
      if (el) return el;
    }
    if (labelText) {
      const labels = Array.from(document.querySelectorAll("label"));
      const label = labels.find(l => l.textContent?.toLowerCase().includes(labelText.toLowerCase()));
      if (label?.htmlFor) return document.getElementById(label.htmlFor);
    }
    if (role) {
      return document.querySelector(`[role="${role}"]`);
    }
    return null;
  }

  // Click with human-like delay
  async function humanClick(element) {
    await sleep(80 + Math.random() * 120);
    element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(40);
    element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await sleep(30);
    element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    element.click();
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }

  // Press keyboard shortcut
  function pressKey(key, modifiers = {}) {
    const opts = { key, bubbles: true, cancelable: true, ...modifiers };
    document.activeElement?.dispatchEvent(new KeyboardEvent("keydown", opts));
    document.activeElement?.dispatchEvent(new KeyboardEvent("keyup", opts));
  }

  // ── Platform Detectors ─────────────────────────────────────────────────────

  function detectPlatform() {
    const url = window.location.href;
    if (url.includes("mail.google.com")) return "gmail";
    if (url.includes("outlook.live.com") || url.includes("outlook.office.com")) return "outlook";
    if (url.includes("web.whatsapp.com")) return "whatsapp";
    if (url.includes("linkedin.com")) return "linkedin";
    if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
    if (url.includes("facebook.com")) return "facebook";
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("slack.com")) return "slack";
    if (url.includes("notion.so")) return "notion";
    if (url.includes("docs.google.com")) return "gdocs";
    return "generic";
  }

  // ── Action Handlers ────────────────────────────────────────────────────────

  const actions = {

    // ── CLICK ──────────────────────────────────────────────────────────────
    async click({ selector, text, role }) {
      let el = selector ? document.querySelector(selector) : null;
      if (!el && text) {
        el = Array.from(document.querySelectorAll("button, a, [role=button], span, div"))
          .find(e => e.textContent?.trim().toLowerCase().includes(text.toLowerCase()));
      }
      if (!el && role) el = document.querySelector(`[role="${role}"]`);
      if (!el) return { done: false, error: `Element not found: ${selector || text}` };
      await humanClick(el);
      return { done: true, element: el.tagName, text: el.textContent?.trim().slice(0, 50) };
    },

    // ── TYPE ───────────────────────────────────────────────────────────────
    async type({ selector, placeholder, label, text, clearFirst = true }) {
      const el = findElement(selector, label, placeholder, null);
      if (!el) return { done: false, error: "Input element not found" };
      if (el.isContentEditable) {
        await humanTypeContentEditable(el, text, clearFirst);
      } else {
        await humanType(el, text, clearFirst);
      }
      return { done: true, typed: text.slice(0, 80) };
    },

    // ── SEND MESSAGE (WhatsApp, Slack, etc.) ───────────────────────────────
    async sendMessage({ text }) {
      const platform = detectPlatform();
      let inputEl = null;
      let sendBtn = null;

      if (platform === "whatsapp") {
        inputEl = document.querySelector('[contenteditable="true"][data-tab="10"]')
          || document.querySelector('[contenteditable="true"][title="Type a message"]')
          || document.querySelector('[contenteditable="true"]');
        sendBtn = document.querySelector('[data-testid="send"]')
          || document.querySelector('button[aria-label="Send"]');
      } else if (platform === "slack") {
        inputEl = document.querySelector('[data-qa="message_input"] [contenteditable="true"]')
          || document.querySelector('.ql-editor');
        sendBtn = document.querySelector('[data-qa="texty_send_button"]');
      } else if (platform === "twitter") {
        inputEl = document.querySelector('[data-testid="tweetTextarea_0"]')
          || document.querySelector('[role="textbox"]');
        sendBtn = document.querySelector('[data-testid="tweetButtonInline"]')
          || document.querySelector('[data-testid="tweetButton"]');
      } else {
        inputEl = document.querySelector('[contenteditable="true"]')
          || document.querySelector('textarea[placeholder*="message" i]')
          || document.querySelector('textarea');
      }

      if (!inputEl) return { done: false, error: "Message input not found on this page" };

      if (inputEl.isContentEditable) {
        await humanTypeContentEditable(inputEl, text, true);
      } else {
        await humanType(inputEl, text, true);
      }

      await sleep(300);

      if (sendBtn) {
        await humanClick(sendBtn);
      } else {
        pressKey("Enter");
      }

      return { done: true, platform, sent: text.slice(0, 80) };
    },

    // ── SEND EMAIL (Gmail / Outlook) ───────────────────────────────────────
    async sendEmail({ to, subject, body, openCompose = true }) {
      const platform = detectPlatform();

      if (platform === "gmail") {
        // Open compose if needed
        if (openCompose) {
          const composeBtn = document.querySelector('[gh="cm"]')
            || document.querySelector('[data-tooltip="Compose"]')
            || Array.from(document.querySelectorAll("div[role=button]"))
                .find(el => el.textContent?.trim() === "Compose");
          if (composeBtn) {
            await humanClick(composeBtn);
            await sleep(800);
          }
        }

        // Fill To
        if (to) {
          const toField = document.querySelector('[name="to"]')
            || document.querySelector('[aria-label="To recipients"]')
            || document.querySelector('[data-hovercard-id]');
          if (toField) {
            await humanType(toField, to, true);
            pressKey("Tab");
            await sleep(300);
          }
        }

        // Fill Subject
        if (subject) {
          const subjectField = document.querySelector('[name="subjectbox"]')
            || document.querySelector('[aria-label="Subject"]');
          if (subjectField) {
            await humanType(subjectField, subject, true);
            await sleep(200);
          }
        }

        // Fill Body
        if (body) {
          const bodyField = document.querySelector('[aria-label="Message Body"]')
            || document.querySelector('[role="textbox"][aria-multiline="true"]')
            || document.querySelector('.Am.Al.editable');
          if (bodyField) {
            bodyField.focus();
            await sleep(200);
            await humanTypeContentEditable(bodyField, body, true);
          }
        }

        return { done: true, platform: "gmail", to, subject };

      } else if (platform === "outlook") {
        if (openCompose) {
          const newMailBtn = document.querySelector('[aria-label="New mail"]')
            || document.querySelector('button[title="New message"]');
          if (newMailBtn) {
            await humanClick(newMailBtn);
            await sleep(800);
          }
        }

        if (to) {
          const toField = document.querySelector('[aria-label="To"]')
            || document.querySelector('input[placeholder*="To" i]');
          if (toField) {
            await humanType(toField, to, true);
            pressKey("Tab");
            await sleep(300);
          }
        }

        if (subject) {
          const subjectField = document.querySelector('[aria-label="Add a subject"]')
            || document.querySelector('input[placeholder*="subject" i]');
          if (subjectField) {
            await humanType(subjectField, subject, true);
          }
        }

        if (body) {
          const bodyField = document.querySelector('[aria-label="Message body, press Alt+F10 to exit"]')
            || document.querySelector('[role="textbox"]');
          if (bodyField) {
            bodyField.focus();
            await humanTypeContentEditable(bodyField, body, true);
          }
        }

        return { done: true, platform: "outlook", to, subject };
      }

      return { done: false, error: "Not on Gmail or Outlook" };
    },

    // ── SUBMIT EMAIL (click Send button) ──────────────────────────────────
    async submitEmail() {
      const platform = detectPlatform();
      let sendBtn = null;

      if (platform === "gmail") {
        sendBtn = document.querySelector('[data-tooltip="Send ‪(Ctrl-Enter)‬"]')
          || document.querySelector('[aria-label*="Send"]')
          || Array.from(document.querySelectorAll("div[role=button]"))
              .find(el => el.textContent?.trim() === "Send");
      } else if (platform === "outlook") {
        sendBtn = document.querySelector('[aria-label="Send"]')
          || document.querySelector('button[title="Send"]');
      }

      if (!sendBtn) return { done: false, error: "Send button not found" };
      await humanClick(sendBtn);
      return { done: true, action: "email_sent" };
    },

    // ── FILL FORM ──────────────────────────────────────────────────────────
    async fillForm({ fields }) {
      // fields: [{ selector, placeholder, label, value }]
      const results = [];
      for (const field of fields) {
        const el = findElement(field.selector, field.label, field.placeholder, null);
        if (el) {
          if (el.tagName === "SELECT") {
            el.value = field.value;
            el.dispatchEvent(new Event("change", { bubbles: true }));
            results.push({ field: field.label || field.placeholder, done: true });
          } else if (el.isContentEditable) {
            await humanTypeContentEditable(el, field.value, true);
            results.push({ field: field.label || field.placeholder, done: true });
          } else {
            await humanType(el, field.value, true);
            results.push({ field: field.label || field.placeholder, done: true });
          }
          await sleep(150);
        } else {
          results.push({ field: field.label || field.placeholder, done: false, error: "Not found" });
        }
      }
      return { done: true, results };
    },

    // ── SCROLL ─────────────────────────────────────────────────────────────
    async scroll({ direction = "down", amount = 400 }) {
      window.scrollBy({ top: direction === "down" ? amount : -amount, behavior: "smooth" });
      return { done: true, direction, amount };
    },

    // ── NAVIGATE ───────────────────────────────────────────────────────────
    async navigate({ url }) {
      window.location.href = url;
      return { done: true, url };
    },

    // ── READ PAGE ──────────────────────────────────────────────────────────
    async readPage() {
      const text = document.body.innerText?.slice(0, 3000) || "";
      const title = document.title;
      const url = window.location.href;
      const platform = detectPlatform();
      return { done: true, title, url, platform, text };
    },

    // ── REPLY (detect reply button and click it) ───────────────────────────
    async clickReply() {
      const platform = detectPlatform();
      let replyBtn = null;

      if (platform === "gmail") {
        replyBtn = document.querySelector('[data-tooltip="Reply"]')
          || Array.from(document.querySelectorAll("span[role=link]"))
              .find(el => el.textContent?.trim() === "Reply");
      } else if (platform === "whatsapp") {
        // Hover last message to reveal reply
        const msgs = document.querySelectorAll('[data-testid="msg-container"]');
        const last = msgs[msgs.length - 1];
        if (last) {
          last.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
          await sleep(300);
          replyBtn = last.querySelector('[data-testid="reply-message"]')
            || last.querySelector('[aria-label="Reply"]');
        }
      }

      if (!replyBtn) return { done: false, error: "Reply button not found" };
      await humanClick(replyBtn);
      return { done: true, action: "reply_opened" };
    },

    // ── LINKEDIN POST ──────────────────────────────────────────────────────
    async linkedinPost({ text }) {
      const startPostBtn = document.querySelector('[aria-label="Start a post"]')
        || Array.from(document.querySelectorAll("button"))
            .find(el => el.textContent?.includes("Start a post"));
      if (startPostBtn) {
        await humanClick(startPostBtn);
        await sleep(800);
      }

      const editor = document.querySelector('[role="textbox"][aria-multiline="true"]')
        || document.querySelector('.ql-editor');
      if (!editor) return { done: false, error: "LinkedIn post editor not found" };

      await humanTypeContentEditable(editor, text, true);
      return { done: true, posted: text.slice(0, 80) };
    },

    // ── SUBMIT (generic form submit) ───────────────────────────────────────
    async submit({ selector, text }) {
      let btn = selector ? document.querySelector(selector) : null;
      if (!btn && text) {
        btn = Array.from(document.querySelectorAll("button[type=submit], input[type=submit], button"))
          .find(el => el.textContent?.toLowerCase().includes(text.toLowerCase()));
      }
      if (!btn) return { done: false, error: "Submit button not found" };
      await humanClick(btn);
      return { done: true };
    },
  };

  // ── Message Listener ───────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, payload } = message;

    if (!actions[action]) {
      sendResponse({ done: false, error: `Unknown action: ${action}` });
      return;
    }

    actions[action](payload || {})
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ done: false, error: err.message }));

    return true; // async
  });

  // Signal ready
  window.__expressoAgentReady = true;
})();
