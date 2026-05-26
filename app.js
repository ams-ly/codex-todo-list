const STORAGE_KEY = "codex.todo-list";
const LANGUAGE_KEY = "codex.todo-language";
const THEME_KEY = "codex.todo-theme";

const i18n = {
  en: {
    eyebrow: "Focus mode",
    title: "Todo List",
    subtitle: "Drop your tasks here, then add, complete, filter, and clear them. Everything saves locally, so a refresh will not wipe your list.",
    addButton: "Add",
    filterAll: "All",
    filterActive: "Active",
    filterDone: "Done",
    emptyState: "No tasks yet. Create your first one.",
    shortcut: "Shortcut: press Enter to add a task",
    clearCompleted: "Clear completed",
    presetNow: "Now",
    preset1h: "+1h",
    presetTomorrow: "Tomorrow 9:00",
    timePlaceholder: "YYYY-MM-DD HH:mm",
    toggleLabel: "Chinese",
    toggleAria: "Switch to Chinese",
    total: "Total",
    active: "Active",
    done: "Done",
    ariaCompletion: "Completion state",
    badgeDone: "Done",
    badgeActive: "Active",
    badgeOverdue: "Overdue",
    edit: "Edit",
    delete: "Delete",
    editPrompt: "Edit task",
    editTimePrompt: "Edit due time, use YYYY-MM-DD HH:mm. Leave blank to clear it.",
    invalidTime: "Invalid time format.",
    placeholder: "Add a task, like: finish the weekly report",
    due: "Due",
    timeLabel: "Due time",
    switchToLightTheme: "Switch to light theme",
    switchToDarkTheme: "Switch to dark theme"
  },
  zh: {
    eyebrow: "\u4e13\u6ce8\u6a21\u5f0f",
    title: "\u5f85\u529e\u6e05\u5355",
    subtitle: "\u628a\u8981\u505a\u7684\u4e8b\u653e\u8fdb\u6765\uff0c\u968f\u624b\u65b0\u589e\u3001\u5b8c\u6210\u3001\u7b5b\u9009\u548c\u6e05\u7406\u3002\u9875\u9762\u4f1a\u81ea\u52a8\u4fdd\u5b58\u5728\u672c\u5730\uff0c\u5237\u65b0\u4e5f\u4e0d\u4f1a\u4e22\u3002",
    addButton: "\u6dfb\u52a0",
    filterAll: "\u5168\u90e8",
    filterActive: "\u672a\u5b8c\u6210",
    filterDone: "\u5df2\u5b8c\u6210",
    emptyState: "\u8fd8\u6ca1\u6709\u5f85\u529e\uff0c\u5148\u521b\u5efa\u4e00\u6761\u5427\u3002",
    shortcut: "\u5feb\u6377\u952e\uff1a\u6309 Enter \u6dfb\u52a0\u4efb\u52a1",
    clearCompleted: "\u6e05\u9664\u5df2\u5b8c\u6210",
    presetNow: "\u73b0\u5728",
    preset1h: "+1\u5c0f\u65f6",
    presetTomorrow: "\u660e\u5929 9:00",
    timePlaceholder: "YYYY\u5e74MM\u6708DD\u65e5 HH:mm",
    toggleLabel: "English",
    toggleAria: "Switch to English",
    total: "\u603b\u8ba1",
    active: "\u672a\u5b8c\u6210",
    done: "\u5df2\u5b8c\u6210",
    ariaCompletion: "\u5b8c\u6210\u72b6\u6001",
    badgeDone: "\u5df2\u5b8c\u6210",
    badgeActive: "\u8fdb\u884c\u4e2d",
    badgeOverdue: "\u5df2\u8d85\u65f6",
    edit: "\u7f16\u8f91",
    delete: "\u5220\u9664",
    editPrompt: "\u7f16\u8f91\u5f85\u529e\u4e8b\u9879",
    editTimePrompt: "\u7f16\u8f91\u5230\u671f\u65f6\u95f4\uff0c\u683c\u5f0f YYYY\u5e74MM\u6708DD\u65e5 HH:mm\u3002\u7559\u7a7a\u53ef\u6e05\u9664\u3002",
    invalidTime: "\u65f6\u95f4\u683c\u5f0f\u4e0d\u6b63\u786e\u3002",
    placeholder: "\u8f93\u5165\u4e00\u4e2a\u5f85\u529e\u4e8b\u9879\uff0c\u6bd4\u5982\uff1a\u6574\u7406\u5468\u62a5",
    due: "\u622a\u6b62",
    timeLabel: "\u5230\u671f\u65f6\u95f4",
    switchToLightTheme: "\u5207\u6362\u5230\u6d45\u8272\u4e3b\u9898",
    switchToDarkTheme: "\u5207\u6362\u5230\u6df1\u8272\u4e3b\u9898"
  }
};

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const timeInput = document.getElementById("todo-time");
const timePresets = document.getElementById("time-presets");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const filters = document.getElementById("filters");
const clearCompletedBtn = document.getElementById("clear-completed");
const langToggle = document.getElementById("lang-toggle");
const themeToggle = document.getElementById("theme-toggle");
const countTotal = document.getElementById("count-total");
const countActive = document.getElementById("count-active");
const countDone = document.getElementById("count-done");

let state = loadState();
let filter = "all";
let language = localStorage.getItem(LANGUAGE_KEY) || "en";
let theme = localStorage.getItem(THEME_KEY) || "dark";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function t(key) {
  return i18n[language][key];
}

function pad2(num) {
  return String(num).padStart(2, "0");
}

function formatTime(value) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function toTimeInputValue(date) {
  if (language === "zh") {
    return `${date.getFullYear()}\u5e74${pad2(date.getMonth() + 1)}\u6708${pad2(date.getDate())}\u65e5 ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  }
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function parseTimeInputValue(value) {
  if (!value) return null;

  const text = value.trim();
  const patterns = [
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/,
    /^(\d{4})年(\d{2})月(\d{2})日\s+(\d{2}):(\d{2})$/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;

    const date = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
      0,
      0
    );

    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }

  const fallback = new Date(text);
  return Number.isNaN(fallback.getTime()) ? null : fallback.getTime();
}

function setPresetTime(preset) {
  const now = new Date();
  if (preset === "now") {
    timeInput.value = toTimeInputValue(now);
    return;
  }
  if (preset === "1h") {
    timeInput.value = toTimeInputValue(new Date(now.getTime() + 60 * 60 * 1000));
    return;
  }
  if (preset === "tomorrow") {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
    timeInput.value = toTimeInputValue(next);
  }
}

function formatTimeForEdit(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : toTimeInputValue(date);
}

function createTodo(title) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: Date.now(),
    dueAt: null
  };
}

function visibleTodos() {
  if (filter === "active") return state.filter((todo) => !todo.completed);
  if (filter === "completed") return state.filter((todo) => todo.completed);
  return state;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getThemeIcon() {
  if (theme === "light") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4.5" fill="currentColor"></circle>
        <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <path d="M12 2.5v2.5"></path>
          <path d="M12 19v2.5"></path>
          <path d="M4.93 4.93l1.77 1.77"></path>
          <path d="M17.3 17.3l1.77 1.77"></path>
          <path d="M2.5 12h2.5"></path>
          <path d="M19 12h2.5"></path>
          <path d="M4.93 19.07l1.77-1.77"></path>
          <path d="M17.3 6.7l1.77-1.77"></path>
        </g>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M20.8 15.6A8.9 8.9 0 0 1 8.4 3.2a1 1 0 0 0-1.2-1.2A10.9 10.9 0 1 0 22 16.8a1 1 0 0 0-1.2-1.2Z"></path>
    </svg>
  `;
}

function applyTheme() {
  document.body.classList.toggle("theme-light", theme === "light");
  localStorage.setItem(THEME_KEY, theme);
  themeToggle.innerHTML = getThemeIcon();
  themeToggle.setAttribute(
    "aria-label",
    theme === "light" ? t("switchToDarkTheme") : t("switchToLightTheme")
  );
}

function applyLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (i18n[language][key]) {
      node.textContent = i18n[language][key];
    }
  });

  input.placeholder = t("placeholder");
  timeInput.placeholder = t("timePlaceholder");
  timeInput.setAttribute("aria-label", t("timeLabel"));
  langToggle.textContent = t("toggleLabel");
  langToggle.setAttribute("aria-label", t("toggleAria"));

  timePresets.querySelectorAll("button").forEach((button) => {
    const preset = button.dataset.timePreset;
    if (preset === "now") button.textContent = t("presetNow");
    if (preset === "1h") button.textContent = t("preset1h");
    if (preset === "tomorrow") button.textContent = t("presetTomorrow");
  });

  applyTheme();
}

function render() {
  const total = state.length;
  const done = state.filter((todo) => todo.completed).length;
  const active = total - done;
  const todos = visibleTodos();

  countTotal.textContent = `${t("total")} ${total}`;
  countActive.textContent = `${t("active")} ${active}`;
  countDone.textContent = `${t("done")} ${done}`;

  list.innerHTML = "";
  emptyState.hidden = todos.length !== 0;

  todos.forEach((todo) => {
    const isOverdue = Boolean(todo.dueAt && !todo.completed && todo.dueAt < Date.now());
    const item = document.createElement("li");
    item.className = `todo${todo.completed ? " completed" : ""}`;
    item.dataset.id = todo.id;

    item.innerHTML = `
      <input type="checkbox" ${todo.completed ? "checked" : ""} aria-label="${t("ariaCompletion")}" />
      <div>
        <div class="todo-title">${escapeHtml(todo.title)}</div>
        <div class="todo-meta">
          <span class="todo-badge${isOverdue ? " overdue" : ""}">${todo.completed ? t("badgeDone") : (isOverdue ? t("badgeOverdue") : t("badgeActive"))}</span>
          ${todo.dueAt ? `<span class="todo-badge">${t("due")} ${formatTime(todo.dueAt)}</span>` : ""}
          <span>${formatTime(todo.createdAt)}</span>
        </div>
      </div>
      <div class="todo-actions">
        <button type="button" data-action="edit" aria-label="${t("edit")}">${t("edit")}</button>
        <button type="button" data-action="delete" class="danger" aria-label="${t("delete")}">${t("delete")}</button>
      </div>
    `;

    item.querySelector('input[type="checkbox"]').addEventListener("change", (event) => {
      todo.completed = event.target.checked;
      saveState();
      render();
    });

    item.querySelector('[data-action="edit"]').addEventListener("click", () => {
      const nextTitle = prompt(t("editPrompt"), todo.title);
      if (nextTitle === null) return;

      const trimmed = nextTitle.trim();
      if (!trimmed) return;

      const nextTime = prompt(t("editTimePrompt"), formatTimeForEdit(todo.dueAt));
      if (nextTime === null) return;

      const parsedTime = nextTime.trim() ? parseTimeInputValue(nextTime) : null;
      if (nextTime.trim() && parsedTime === null) {
        alert(t("invalidTime"));
        return;
      }

      todo.title = trimmed;
      todo.dueAt = parsedTime;
      saveState();
      render();
    });

    item.querySelector('[data-action="delete"]').addEventListener("click", () => {
      state = state.filter((current) => current.id !== todo.id);
      saveState();
      render();
    });

    list.appendChild(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  const todo = createTodo(value);
  todo.dueAt = parseTimeInputValue(timeInput.value);

  state.unshift(todo);
  input.value = "";
  timeInput.value = "";
  saveState();
  render();
  input.focus();
});

timePresets.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-time-preset]");
  if (!button) return;

  setPresetTime(button.dataset.timePreset);
  timeInput.focus();
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;

  filter = button.dataset.filter;
  filters.querySelectorAll("button").forEach((node) => {
    node.classList.toggle("active", node === button);
  });
  render();
});

clearCompletedBtn.addEventListener("click", () => {
  state = state.filter((todo) => !todo.completed);
  saveState();
  render();
});

langToggle.addEventListener("click", () => {
  language = language === "en" ? "zh" : "en";
  localStorage.setItem(LANGUAGE_KEY, language);
  applyLanguage();
  render();
});

themeToggle.addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  applyTheme();
});

applyLanguage();
render();
input.focus();
