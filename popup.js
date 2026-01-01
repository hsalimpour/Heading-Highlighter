document.getElementById("show").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs?.[0]?.id) return;

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: highlightHeadings
    });
  });
});

document.getElementById("hide").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs?.[0]?.id) return;

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: clearHighlights
    });
  });
});

function highlightHeadings() {
  // Remove old labels first
  document.querySelectorAll(".hh-label").forEach((el) => el.remove());

  const tagStyles = {
    h1: "#ae0000",
    h2: "#0051ffff",
    h3: "#f2af2f",
    h4: "#01a511ff",
    h5: "#a910c4ff",
    h6: "#00bfdcff" 
  };

  Object.entries(tagStyles).forEach(([tag, color]) => {
    document.querySelectorAll(tag).forEach((el) => {
      // Save original inline styles (only once)
      if (!el.dataset.hhOriginalBg) el.dataset.hhOriginalBg = el.style.backgroundColor || "";
      if (!el.dataset.hhOriginalPos) el.dataset.hhOriginalPos = el.style.position || "";

      // Apply highlight
      el.style.backgroundColor = color;

      // Ensure label can position properly
      const computedPos = window.getComputedStyle(el).position;
      if (computedPos === "static") {
        el.style.position = "relative";
      }

      // Create label
      const label = document.createElement("span");
      label.textContent = tag.toUpperCase();
      label.className = "hh-label";
      label.style.position = "absolute";
      label.style.top = "-26px";
      label.style.right = "0px";
      label.style.backgroundColor = color;
      label.style.color = "white";
      label.style.padding = "2px 6px";
      label.style.fontSize = "12px";
      label.style.fontWeight = "700";
      label.style.borderRadius = "6px";
      label.style.zIndex = "2147483647";
      label.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
      label.style.lineHeight = "1.4";
      label.style.pointerEvents = "none";

      el.appendChild(label);
    });
  });
}

function clearHighlights() {
  document.querySelectorAll(".hh-label").forEach((el) => el.remove());

  const tags = ["h1", "h2", "h3", "h4", "h5", "h6"];
  tags.forEach((tag) => {
    document.querySelectorAll(tag).forEach((el) => {
      // Restore original inline styles
      el.style.backgroundColor = el.dataset.hhOriginalBg ?? "";
      el.style.position = el.dataset.hhOriginalPos ?? "";

      // Cleanup dataset to avoid clutter
      delete el.dataset.hhOriginalBg;
      delete el.dataset.hhOriginalPos;
    });
  });
}
