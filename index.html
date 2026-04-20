<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#faf5ee">
    <meta name="apple-mobile-web-app-title" content="Knit Counter">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>Knit Counter</title>
    <link rel="icon" type="image/x-icon" href="img/favicon.ico?v=20260420-5">
    <link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico?v=20260420-5">
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png?v=20260420-5">
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png?v=20260420-5">
    <link rel="icon" type="image/png" href="img/favicon.png?v=20260420-5">
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png?v=20260420-5">
    <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-precomposed.png?v=20260420-5">
    <link rel="manifest" href="manifest.webmanifest?v=20260420-5">
    <link rel="stylesheet" href="styles.css?v=20260420-6">
</head>
<body>
<div class="app-background" aria-hidden="true"></div>
<main class="counter-app">
    <section class="counter-card" aria-labelledby="app-title">
        <button id="savedEntriesButton" class="saved-entries-button" type="button" aria-label="保存した段数を見る">
            <span class="saved-entries-icon" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </span>
        </button>
        <h1 id="app-title">Knit Counter</h1>
        <!--<p class="description">＋ボタンで段数を増やし、－ボタンで減らせます。</p> -->

        <div class="count-display" aria-live="polite" aria-atomic="true">
            <div class="count-surface">
                <span class="count-label">現 在 の 段 数</span>
                <span id="count" class="count-value">0</span>
                <button id="resetButton" class="card-reset-button" type="button" aria-label="段数をリセットする">↺</button>
            </div>
        </div>

        <div class="set-counter-card">
            <span id="setCount" class="set-counter-value">0</span>
            <div class="set-counter-controls">
                <div class="set-counter-stepper">
                    <button id="decreaseSetButton" class="mini-count-button secondary" type="button" aria-label="セット数を1つ減らす">−</button>
                    <button id="increaseSetButton" class="mini-count-button primary" type="button" aria-label="セット数を1つ増やす">＋</button>
                </div>
                <button id="resetSetButton" class="card-reset-button set-reset-button" type="button" aria-label="セット数をリセットする">↺</button>
            </div>
        </div>

        <div class="button-group">
            <div class="button-section">
<!--                <p class="button-section-label">段数</p>-->
                <div class="button-row">
                    <button id="decreaseButton" class="count-button secondary" type="button" aria-label="段数を1つ減らす">−</button>
                    <button id="increaseButton" class="count-button primary" type="button" aria-label="段数を1つ増やす">＋</button>
                </div>
            </div>
        </div>

        <button id="saveButton" class="save-button" type="button">記 録 す る</button>
    </section>

    <nav class="app-footer-links" aria-label="フッターリンク">
        <a class="footer-link" href="privacy.html">プライバシーポリシー</a>
    </nav>
</main>

<div id="saveModal" class="modal" hidden>
    <div id="modalBackdrop" class="modal-backdrop"></div>
    <section
        class="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saveModalTitle"
        aria-describedby="saveModalDescription"
    >
        <h2 id="saveModalTitle">記 録 す る</h2>
        <p id="saveModalDescription" class="modal-description">名前をつけて記録できます。</p>

        <div class="modal-count-grid">
            <div class="modal-count-box">
                <span class="modal-count-label">現在の段数</span>
                <span id="modalCurrentCount" class="modal-count-value">0</span>
            </div>

            <div class="modal-count-box">
                <span class="modal-count-label">現在のセット数</span>
                <span id="modalCurrentSetCount" class="modal-count-value modal-set-count-value">0</span>
            </div>
        </div>

        <label class="modal-label" for="saveNameInput">保存名</label>
        <input
            id="saveNameInput"
            class="modal-input"
            type="text"
            maxlength="40"
            placeholder="例: 身頃 "
        >

        <p id="saveError" class="modal-error" hidden>名前を入力してください。</p>

        <div class="modal-actions">
            <button id="cancelSaveButton" class="modal-button secondary" type="button">キャンセル</button>
            <button id="confirmSaveButton" class="modal-button primary" type="button">保存する</button>
        </div>
    </section>
</div>

<div id="savedEntriesModal" class="modal" hidden>
    <div id="savedEntriesBackdrop" class="modal-backdrop"></div>
    <section
        class="modal-card saved-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="savedEntriesTitle"
    >
        <div class="saved-modal-header">
            <div>
                <h2 id="savedEntriesTitle">これまでの記録</h2>

            </div>
            <span id="savedCount" class="saved-count">0件</span>
        </div>

        <div id="savedList" class="saved-list" aria-live="polite"></div>

        <div class="modal-actions single-action">
            <button id="closeSavedEntriesButton" class="modal-button secondary" type="button">閉じる</button>
        </div>
    </section>
</div>

<div id="confirmResetModal" class="modal" hidden>
    <div id="confirmResetBackdrop" class="modal-backdrop"></div>
    <section
        class="modal-card confirm-reset-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmResetTitle"
        aria-describedby="confirmResetDescription"
    >
        <h2 id="confirmResetTitle">リセットの確認</h2>
        <p id="confirmResetDescription" class="modal-description">この値を0に戻します。よろしいですか？</p>
        <div class="modal-actions">
            <button id="cancelResetButton" class="modal-button secondary" type="button">キャンセル</button>
            <button id="confirmResetButton" class="modal-button primary" type="button">戻す</button>
        </div>
    </section>
</div>

<script src="script.js?v=20260420-6"></script>
</body>
</html>
