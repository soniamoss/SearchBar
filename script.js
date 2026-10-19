const supabaseClient = window.supabase.createClient(
  window.SEARCHBAR_CONFIG.url,
  window.SEARCHBAR_CONFIG.key
);

const barList = document.querySelector("#bar-list");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#bar-search");

let bars = [];

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayBars(barData) {
  if (!barList) return;

  barList.innerHTML = "";

  if (barData.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  barData.forEach((bar, index) => {
    const card = document.createElement("article");
    card.className = "bar-card";

    const colors = ["purple", "orange", "green"];
    const symbols = ["✦", "◒", "✺"];

    card.innerHTML = `
      <div class="bar-image ${colors[index % colors.length]}">
        ${symbols[index % symbols.length]}
      </div>
      <div class="bar-card-body">
        <span class="location">${escapeHTML(bar.neighborhood)}</span>
        <h2>${escapeHTML(bar.bar_name)}</h2>
        <p>
          ${escapeHTML(bar.music_type || "Music details coming soon")}
          · ${escapeHTML(bar.vibe || "Vibe details coming soon")}
          · Best on ${escapeHTML(bar.best_day || "various days")}
        </p>
        <div class="rating">
          ★ ${escapeHTML(bar.overall_rating || "N/A")}
          <span>Safety ${escapeHTML(bar.safety_rating || "N/A")}</span>
        </div>
      </div>
    `;

    barList.appendChild(card);
  });
}

async function loadBars() {
  if (barList) {
    barList.innerHTML = "<p>Loading bars...</p>";
  }

  const { data, error } = await supabaseClient
    .from("bars")
    .select("*")
    .order("bar_name");

  if (error) {
    console.error("Error loading bars:", error);

    if (barList) {
      barList.innerHTML =
        "<p>Unable to load bars. Check the browser console for details.</p>";
    }

    return;
  }

  bars = data;
  displayBars(bars);
}

function filterBars() {
  const query = (searchInput?.value || "").trim().toLowerCase();

  const filteredBars = bars.filter((bar) => {
    const searchableText = [
      bar.bar_name,
      bar.neighborhood,
      bar.music_type,
      bar.vibe,
      bar.best_day,
      bar.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  displayBars(filteredBars);
}

function filterBy(value) {
  if (searchInput) {
    searchInput.value = value;
  }

  const filteredBars = bars.filter((bar) => {
    const searchableText = [
      bar.bar_name,
      bar.neighborhood,
      bar.music_type,
      bar.vibe,
      bar.best_day
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(value.toLowerCase());
  });

  displayBars(filteredBars);
}

function showAll() {
  if (searchInput) {
    searchInput.value = "";
  }

  displayBars(bars);
}

searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    filterBars();
  }
});

loadBars();