const countElement = document.getElementById("count");
const setCountElement = document.getElementById("setCount");
const increaseButton = document.getElementById("increaseButton");
const decreaseButton = document.getElementById("decreaseButton");
const increaseSetButton = document.getElementById("increaseSetButton");
const decreaseSetButton = document.getElementById("decreaseSetButton");
const saveButton = document.getElementById("saveButton");
const resetButton = document.getElementById("resetButton");
const resetSetButton = document.getElementById("resetSetButton");
const savedEntriesButton = document.getElementById("savedEntriesButton");
const savedListElement = document.getElementById("savedList");

const saveModal = document.getElementById("saveModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalCurrentCount = document.getElementById("modalCurrentCount");
const modalCurrentSetCount = document.getElementById("modalCurrentSetCount");
const saveNameInput = document.getElementById("saveNameInput");
const saveError = document.getElementById("saveError");
const cancelSaveButton = document.getElementById("cancelSaveButton");
const confirmSaveButton = document.getElementById("confirmSaveButton");

const savedEntriesModal = document.getElementById("savedEntriesModal");
const savedEntriesBackdrop = document.getElementById("savedEntriesBackdrop");
const closeSavedEntriesButton = document.getElementById("closeSavedEntriesButton");
const menuModal = document.getElementById("menuModal");
const menuBackdrop = document.getElementById("menuBackdrop");
const menuSavedButton = document.getElementById("menuSavedButton");
const themeToggleButton = document.getElementById("themeToggleButton");
const settingsButton = document.getElementById("settingsButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const themeModal = document.getElementById("themeModal");
const themeBackdrop = document.getElementById("themeBackdrop");
const themeCafeLatteButton = document.getElementById("themeCafeLatteButton");
const themeMilkButton = document.getElementById("themeMilkButton");
const closeThemeButton = document.getElementById("closeThemeButton");
const settingsModal = document.getElementById("settingsModal");
const settingsBackdrop = document.getElementById("settingsBackdrop");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const confirmResetModal = document.getElementById("confirmResetModal");
const confirmResetBackdrop = document.getElementById("confirmResetBackdrop");
const cancelResetButton = document.getElementById("cancelResetButton");
const confirmResetButton = document.getElementById("confirmResetButton");
const confirmResetDescription = document.getElementById("confirmResetDescription");

const STORAGE_KEY = "knit-counter-value";
const SET_STORAGE_KEY = "knit-counter-set-value";
const SAVED_COUNTS_KEY = "knit-counter-saved-counts";
const THEME_STORAGE_KEY = "knit-counter-theme";

let audioContext;
let lastFocusedElement = null;
let activeModal = null;
let pendingResetType = null;

let count = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
let setCount = Number.parseInt(localStorage.getItem(SET_STORAGE_KEY) ?? "1", 10);
let savedCounts = readSavedCounts();
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
let currentTheme = ["classic", "clean", "mochi"].includes(savedTheme) ? savedTheme : "classic";

if (Number.isNaN(count) || count < 0) {
    count = 0;
}

if (Number.isNaN(setCount) || setCount < 1) {
    setCount = 1;
}

function readSavedCounts() {
    try {
        const raw = localStorage.getItem(SAVED_COUNTS_KEY);

        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.flatMap((item) => {
            if (
                !item ||
                typeof item.id !== "string" ||
                typeof item.name !== "string" ||
                !Number.isInteger(item.count) ||
                item.count < 0 ||
                typeof item.savedAt !== "string"
            ) {
                return [];
            }

            const normalizedSetCount = Number.isInteger(item.setCount) && item.setCount >= 1
                ? item.setCount
                : 1;

            return [{
                ...item,
                setCount: normalizedSetCount
            }];
        });
    } catch {
        return [];
    }
}

function writeSavedCounts() {
    localStorage.setItem(SAVED_COUNTS_KEY, JSON.stringify(savedCounts));
}

function animateCounter(element) {
    element.classList.remove("bump");
    void element.offsetWidth;
    element.classList.add("bump");
}

function renderCount() {
    countElement.textContent = String(count);
    localStorage.setItem(STORAGE_KEY, String(count));
    animateCounter(countElement);
}

function renderSetCount() {
    setCountElement.textContent = String(setCount);
    localStorage.setItem(SET_STORAGE_KEY, String(setCount));
    animateCounter(setCountElement);
}

function formatSavedDate(savedAt) {
    const date = new Date(savedAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("ja-JP", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function renderSavedCounts() {
    if (savedCounts.length === 0) {
        savedListElement.innerHTML = '<p class="saved-empty">まだ保存された段数はありません。</p>';
        return;
    }

    savedListElement.innerHTML = savedCounts.map((item) => `
        <article class="saved-item">
            <button
                class="saved-item-button"
                type="button"
                data-action="load"
                data-id="${item.id}"
                aria-label="${escapeHtml(item.name)} を読み込む"
            >
                <span class="saved-item-name">${escapeHtml(item.name)}</span>
                <span class="saved-item-meta">${item.count}段 ・ ${item.setCount}セット ・ ${escapeHtml(formatSavedDate(item.savedAt))}</span>
            </button>
            <div class="saved-item-actions">
                <button
                    class="saved-delete-button"
                    type="button"
                    data-action="delete"
                    data-id="${item.id}"
                    aria-label="${escapeHtml(item.name)} を削除"
                >
                    <svg class="saved-delete-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M6 6l1 15h10l1-15" />
                        <path d="M10 10v7" />
                        <path d="M14 10v7" />
                    </svg>
                </button>
            </div>
        </article>
    `).join("");
}

function renderTheme() {
    document.body.classList.toggle("theme-clean", currentTheme === "clean");
    document.body.classList.toggle("theme-mochi", currentTheme === "mochi");
    themeToggleButton.textContent = "テーマ変更";
    themeCafeLatteButton.setAttribute("aria-pressed", String(currentTheme === "classic"));
    themeMilkButton.setAttribute("aria-pressed", String(currentTheme === "clean"));
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
}

function openModal(modalElement, focusElement) {
    if (activeModal && activeModal !== modalElement) {
        activeModal.hidden = true;
    }

    if (!activeModal) {
        lastFocusedElement = document.activeElement;
        document.body.style.overflow = "hidden";
    }

    activeModal = modalElement;
    modalElement.hidden = false;

    if (focusElement instanceof HTMLElement) {
        window.setTimeout(() => {
            focusElement.focus();
        }, 0);
    }
}

function closeModal(modalElement) {
    modalElement.hidden = true;

    if (activeModal === modalElement) {
        activeModal = null;
        document.body.style.overflow = "";

        if (lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus();
        }
    }
}

function openSaveModal() {
    modalCurrentCount.textContent = String(count);
    modalCurrentSetCount.textContent = String(setCount);
    saveNameInput.value = "";
    saveError.hidden = true;
    openModal(saveModal, saveNameInput);
}

function closeSaveModal() {
    saveError.hidden = true;
    closeModal(saveModal);
}

function closeSaveModalWithSound() {
    playSaveClickSound();
    window.setTimeout(closeSaveModal, 60);
}

function openSavedEntriesModal() {
    renderSavedCounts();
    openModal(savedEntriesModal, closeSavedEntriesButton);
}

function closeSavedEntriesModal() {
    closeModal(savedEntriesModal);
}

function openMenuModal() {
    openModal(menuModal, menuSavedButton);
}

function closeMenuModal() {
    closeModal(menuModal);
}

function openThemeModal() {
    renderTheme();
    const focusElement = currentTheme === "clean"
        ? themeMilkButton
        : themeCafeLatteButton;

    openModal(themeModal, focusElement);
}

function closeThemeModal() {
    closeModal(themeModal);
}

function openSettingsModal() {
    openModal(settingsModal, closeSettingsButton);
}

function closeSettingsModal() {
    closeModal(settingsModal);
}

function selectTheme(theme) {
    currentTheme = theme;
    renderTheme();
    playSaveClickSound();
    closeThemeModal();
}

function openConfirmResetModal(type) {
    pendingResetType = type;
    confirmResetDescription.innerHTML = type === "count"
        ? "現在の段数を0に戻します。<br>よろしいですか？"
        : "現在のセット数を1に戻します。<br>よろしいですか？";
    openModal(confirmResetModal, cancelResetButton);
}

function closeConfirmResetModal() {
    pendingResetType = null;
    closeModal(confirmResetModal);
}

function closeConfirmResetModalWithSound() {
    playSaveClickSound();
    closeConfirmResetModal();
}

function confirmReset() {
    if (pendingResetType === "count") {
        if (count > 0) {
            count = 0;
            playResetSound();
            renderCount();
        }

        closeConfirmResetModal();
        return;
    }

    if (pendingResetType === "set") {
        if (setCount !== 1) {
            setCount = 1;
            playResetSound();
            renderSetCount();
        }

        closeConfirmResetModal();
    }
}

function saveCurrentCount() {
    const name = saveNameInput.value.trim();

    if (!name) {
        saveError.hidden = false;
        saveNameInput.focus();
        return;
    }

    savedCounts.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name,
        count,
        setCount,
        savedAt: new Date().toISOString()
    });

    writeSavedCounts();
    renderSavedCounts();
    playSaveClickSound();
    closeSaveModal();
}

function loadSavedCount(id) {
    const item = savedCounts.find((entry) => entry.id === id);

    if (!item) {
        return;
    }

    playSaveClickSound();
    count = item.count;
    setCount = item.setCount;
    renderCount();
    renderSetCount();
    closeSavedEntriesModal();
}

function deleteSavedCount(id) {
    const nextSavedCounts = savedCounts.filter((entry) => entry.id !== id);

    if (nextSavedCounts.length === savedCounts.length) {
        return;
    }

    playSaveClickSound();
    savedCounts = nextSavedCounts;
    writeSavedCounts();
    renderSavedCounts();
}

function getAudioContext() {
    if (!audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
    }

    return audioContext;
}

function playPokoSound(pitch = "up") {
    if (currentTheme === "mochi") {
        playMochiSound(pitch);
        return;
    }

    const context = getAudioContext();

    if (!context) {
        return;
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const overtone = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();
    const isLowerPitch = pitch === "down";

    const baseFrequency = isLowerPitch ? 360 : 420;
    const endFrequency = isLowerPitch ? 240 : 280;
    const overtoneStart = isLowerPitch ? 560 : 680;
    const overtoneEnd = isLowerPitch ? 390 : 480;

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(baseFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + 0.12);

    overtone.type = "sine";
    overtone.frequency.setValueAtTime(overtoneStart, now);
    overtone.frequency.exponentialRampToValueAtTime(overtoneEnd, now + 0.09);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    oscillator.connect(filter);
    overtone.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + 0.2);
    overtone.stop(now + 0.2);
}

function playMochiSound(pitch = "up") {
    const context = getAudioContext();

    if (!context) {
        return;
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const wobble = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();
    const isLowerPitch = pitch === "down";

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(isLowerPitch ? 210 : 250, now);
    oscillator.frequency.exponentialRampToValueAtTime(isLowerPitch ? 145 : 175, now + 0.18);

    wobble.type = "triangle";
    wobble.frequency.setValueAtTime(isLowerPitch ? 155 : 190, now);
    wobble.frequency.exponentialRampToValueAtTime(isLowerPitch ? 118 : 136, now + 0.22);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(760, now);
    filter.Q.setValueAtTime(0.8, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.13, now + 0.018);
    gainNode.gain.exponentialRampToValueAtTime(0.06, now + 0.11);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    oscillator.connect(filter);
    wobble.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(now);
    wobble.start(now + 0.025);
    oscillator.stop(now + 0.28);
    wobble.stop(now + 0.25);
}

function playResetSound() {
    const context = getAudioContext();

    if (!context) {
        return;
    }

    const now = context.currentTime;
    const firstOscillator = context.createOscillator();
    const secondOscillator = context.createOscillator();
    const shimmer = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();

    firstOscillator.type = "sine";
    firstOscillator.frequency.setValueAtTime(520, now);
    firstOscillator.frequency.exponentialRampToValueAtTime(390, now + 0.14);

    secondOscillator.type = "triangle";
    secondOscillator.frequency.setValueAtTime(390, now + 0.06);
    secondOscillator.frequency.exponentialRampToValueAtTime(260, now + 0.24);

    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(780, now);
    shimmer.frequency.exponentialRampToValueAtTime(620, now + 0.12);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1500, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.09, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    firstOscillator.connect(filter);
    secondOscillator.connect(filter);
    shimmer.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    firstOscillator.start(now);
    shimmer.start(now);
    secondOscillator.start(now + 0.06);

    firstOscillator.stop(now + 0.16);
    shimmer.stop(now + 0.14);
    secondOscillator.stop(now + 0.28);
}

function playSaveClickSound() {
    const context = getAudioContext();

    if (!context) {
        return;
    }

    const now = context.currentTime;
    const mainOscillator = context.createOscillator();
    const accentOscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();

    mainOscillator.type = "square";
    mainOscillator.frequency.setValueAtTime(2100, now);
    mainOscillator.frequency.exponentialRampToValueAtTime(1100, now + 0.018);

    accentOscillator.type = "triangle";
    accentOscillator.frequency.setValueAtTime(3200, now);
    accentOscillator.frequency.exponentialRampToValueAtTime(1800, now + 0.012);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1900, now);
    filter.Q.setValueAtTime(1.8, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.018, now + 0.012);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    mainOscillator.connect(filter);
    accentOscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    mainOscillator.start(now);
    accentOscillator.start(now);
    mainOscillator.stop(now + 0.035);
    accentOscillator.stop(now + 0.022);
}

increaseButton.addEventListener("click", () => {
    count += 1;
    playPokoSound("up");
    renderCount();
});

decreaseButton.addEventListener("click", () => {
    if (count === 0) {
        return;
    }

    count -= 1;
    playPokoSound("down");
    renderCount();
});

increaseSetButton.addEventListener("click", () => {
    setCount += 1;
    playPokoSound("up");
    renderSetCount();
});

decreaseSetButton.addEventListener("click", () => {
    if (setCount === 1) {
        return;
    }

    setCount -= 1;
    playPokoSound("down");
    renderSetCount();
});

saveButton.addEventListener("click", () => {
    playSaveClickSound();
    openSaveModal();
});
savedEntriesButton.addEventListener("click", () => {
    playSaveClickSound();
    openMenuModal();
});

menuSavedButton.addEventListener("click", () => {
    playSaveClickSound();
    openSavedEntriesModal();
});

themeToggleButton.addEventListener("click", () => {
    playSaveClickSound();
    openThemeModal();
});

themeCafeLatteButton.addEventListener("click", () => {
    selectTheme("classic");
});

themeMilkButton.addEventListener("click", () => {
    selectTheme("clean");
});

settingsButton.addEventListener("click", () => {
    playSaveClickSound();
    openSettingsModal();
});

closeMenuButton.addEventListener("click", () => {
    playSaveClickSound();
    closeMenuModal();
});

menuBackdrop.addEventListener("click", closeMenuModal);
closeThemeButton.addEventListener("click", () => {
    playSaveClickSound();
    closeThemeModal();
});
themeBackdrop.addEventListener("click", closeThemeModal);
closeSettingsButton.addEventListener("click", () => {
    playSaveClickSound();
    closeSettingsModal();
});
settingsBackdrop.addEventListener("click", closeSettingsModal);

cancelSaveButton.addEventListener("click", closeSaveModalWithSound);
confirmSaveButton.addEventListener("click", saveCurrentCount);
modalBackdrop.addEventListener("click", closeSaveModal);

closeSavedEntriesButton.addEventListener("click", () => {
    playSaveClickSound();
    closeSavedEntriesModal();
});
savedEntriesBackdrop.addEventListener("click", closeSavedEntriesModal);
cancelResetButton.addEventListener("click", closeConfirmResetModalWithSound);
confirmResetBackdrop.addEventListener("click", closeConfirmResetModal);
confirmResetButton.addEventListener("click", confirmReset);

saveNameInput.addEventListener("input", () => {
    if (!saveError.hidden) {
        saveError.hidden = true;
    }
});

saveNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        saveCurrentCount();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !activeModal) {
        return;
    }

    if (activeModal === saveModal) {
        closeSaveModal();
    }

    if (activeModal === savedEntriesModal) {
        closeSavedEntriesModal();
    }

    if (activeModal === menuModal) {
        closeMenuModal();
    }

    if (activeModal === themeModal) {
        closeThemeModal();
    }

    if (activeModal === settingsModal) {
        closeSettingsModal();
    }

    if (activeModal === confirmResetModal) {
        closeConfirmResetModal();
    }
});

savedListElement.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
        return;
    }

    const actionElement = target.closest("[data-action]");

    if (!(actionElement instanceof HTMLElement)) {
        return;
    }

    const id = actionElement.dataset.id;

    if (!id) {
        return;
    }

    if (actionElement.dataset.action === "load") {
        loadSavedCount(id);
    }

    if (actionElement.dataset.action === "delete") {
        deleteSavedCount(id);
    }
});

resetButton.addEventListener("click", () => {
    playSaveClickSound();

    if (count === 0) {
        return;
    }

    openConfirmResetModal("count");
});

resetSetButton.addEventListener("click", () => {
    playSaveClickSound();

    if (setCount === 1) {
        return;
    }

    openConfirmResetModal("set");
});

renderCount();
renderSetCount();
renderSavedCounts();
renderTheme();
