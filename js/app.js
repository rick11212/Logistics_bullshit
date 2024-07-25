(() => {
    "use strict";
    const modules_flsModules = {};
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Такого попапа нету. Проверьте корректность введения.`);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    document.addEventListener("DOMContentLoaded", (function() {
        function fetchJsonData() {
            fetch("http://localhost:8080/api/track_pairs").then((response => {
                if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
                return response.json();
            })).then((data => {
                console.log("Success:", data);
                processJsonData(data);
            })).catch((error => {
                console.error("Error:", error);
            }));
        }
        function processJsonData(data) {
            var list = document.getElementById("list");
            data.forEach((function(item) {
                var row = document.createElement("div");
                row.className = "list__item";
                var headNumberCell = document.createElement("div");
                headNumberCell.className = "list__text";
                headNumberCell.setAttribute("data-id", "headNumber");
                headNumberCell.textContent = item.headNumber;
                row.appendChild(headNumberCell);
                var trailerNumberCell = document.createElement("div");
                trailerNumberCell.className = "list__text";
                trailerNumberCell.setAttribute("data-id", "trailerNumber");
                trailerNumberCell.textContent = item.trailerNumber;
                row.appendChild(trailerNumberCell);
                var dateCell = document.createElement("div");
                dateCell.className = "list__text";
                dateCell.setAttribute("data-id", "date");
                dateCell.textContent = item.date ? item.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3.$2.$1") : "";
                row.appendChild(dateCell);
                var fromCountryCell = document.createElement("div");
                fromCountryCell.className = "list__text";
                fromCountryCell.textContent = item.fromCountry || "";
                row.appendChild(fromCountryCell);
                var toCountryCell = document.createElement("div");
                toCountryCell.className = "list__text";
                toCountryCell.textContent = item.toCountry || "";
                row.appendChild(toCountryCell);
                var cargoCell = document.createElement("div");
                cargoCell.className = "list__text";
                cargoCell.textContent = item.cargo || "";
                row.appendChild(cargoCell);
                var commentCell = document.createElement("div");
                commentCell.className = "list__text";
                commentCell.textContent = item.comment || "";
                row.appendChild(commentCell);
                var buttonsCell = document.createElement("div");
                buttonsCell.className = "list__buttons";
                var editButton = document.createElement("button");
                editButton.className = "list__edit _icon-edit";
                var saveButton = document.createElement("button");
                saveButton.className = "list__save _icon-save";
                saveButton.style.display = "none";
                var exitButton = document.createElement("button");
                exitButton.className = "list__exit _icon-exit";
                exitButton.style.display = "none";
                var delButton = document.createElement("button");
                delButton.className = "list__del _icon-del";
                delButton.addEventListener("click", (function() {
                    list.removeChild(row);
                }));
                var flagButton = document.createElement("button");
                flagButton.className = "list__flag list__flag--passive";
                flagButton.addEventListener("click", (function() {
                    flagButton.classList.toggle("list__flag--passive");
                    flagButton.classList.toggle("list__flag--active");
                    row.classList.toggle("list__item--flag");
                }));
                buttonsCell.appendChild(editButton);
                buttonsCell.appendChild(saveButton);
                buttonsCell.appendChild(exitButton);
                buttonsCell.appendChild(delButton);
                buttonsCell.appendChild(flagButton);
                row.appendChild(buttonsCell);
                list.appendChild(row);
                editButton.addEventListener("click", (function() {
                    editButton.style.display = "none";
                    saveButton.style.display = "inline-block";
                    exitButton.style.display = "inline-block";
                    delButton.style.display = "none";
                    flagButton.style.display = "none";
                    row.querySelectorAll(".list__text").forEach((function(cell) {
                        if (!cell.querySelector("input")) {
                            var input = document.createElement("input");
                            input.type = "text";
                            input.value = cell.textContent;
                            cell.setAttribute("data-original-value", cell.textContent);
                            cell.textContent = "";
                            cell.appendChild(input);
                        }
                    }));
                    exitButton.addEventListener("click", (function() {
                        row.querySelectorAll(".list__text").forEach((function(cell) {
                            if (cell.querySelector("input")) {
                                var originalValue = cell.getAttribute("data-original-value");
                                cell.textContent = originalValue;
                            }
                        }));
                        editButton.style.display = "";
                        saveButton.style.display = "none";
                        exitButton.style.display = "none";
                        delButton.style.display = "";
                        flagButton.style.display = "";
                    }));
                }));
                saveButton.addEventListener("click", (function() {
                    row.querySelectorAll(".list__text").forEach((function(cell) {
                        if (cell.querySelector("input")) {
                            var input = cell.querySelector("input");
                            cell.textContent = input.value;
                        }
                    }));
                    editButton.style.display = "";
                    saveButton.style.display = "none";
                    exitButton.style.display = "none";
                    delButton.style.display = "";
                    flagButton.style.display = "";
                }));
            }));
            function filterRows() {
                const headFilter = document.getElementById("searchHeadNumber").value.toLowerCase();
                const trailerFilter = document.getElementById("searchTrailerNumber").value.toLowerCase();
                const dateFilter = document.getElementById("searchDate").value;
                const rows = document.querySelectorAll(".list__item");
                rows.forEach((row => {
                    const headNumber = row.querySelector("[data-id='headNumber']").textContent.toLowerCase();
                    const trailerNumber = row.querySelector("[data-id='trailerNumber']").textContent.toLowerCase();
                    const date = row.querySelector("[data-id='date']").textContent.replace(/(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                    if (headNumber.includes(headFilter) && trailerNumber.includes(trailerFilter) && date.includes(dateFilter)) row.style.display = ""; else row.style.display = "none";
                }));
            }
            document.getElementById("searchHeadNumber").addEventListener("input", filterRows);
            document.getElementById("searchTrailerNumber").addEventListener("input", filterRows);
            document.getElementById("searchDate").addEventListener("input", filterRows);
        }
        fetchJsonData();
        function jsonDataHeads() {
            fetch("http://localhost:8080/api/cargo_heads").then((response => {
                if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
                return response.json();
            })).then((data => {
                console.log("Success:", data);
                populateHeadNumbers(data);
            })).catch((error => {
                console.error("Error:", error);
            }));
        }
        function populateHeadNumbers(data) {
            var select = document.getElementById("headNumber");
            data.forEach((function(item) {
                var option = document.createElement("option");
                option.value = item.headNumber;
                option.textContent = item.headNumber;
                option.classList.add("form__value");
                select.appendChild(option);
            }));
        }
        jsonDataHeads();
        function jsonDataTrailers() {
            fetch("http://localhost:8080/api/cargo_trailers").then((response => {
                if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
                return response.json();
            })).then((data => {
                console.log("Success:", data);
                populateTrailerNumbers(data);
            })).catch((error => {
                console.error("Error:", error);
            }));
        }
        function populateTrailerNumbers(data) {
            var select = document.getElementById("trailerNumber");
            data.forEach((function(item) {
                var option = document.createElement("option");
                option.value = item.trailerNumber;
                option.textContent = item.trailerNumber;
                option.classList.add("form__value");
                select.appendChild(option);
            }));
        }
        jsonDataTrailers();
    }));
    document.getElementById("form").addEventListener("submit", (function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formData.entries()));
        console.log(json);
        fetch("http://localhost:8080/api/track_pairs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: json
        }).then((response => response.json())).then((data => {
            console.log("Success:", data);
            window.location.href = "index.html";
        })).catch((error => {
            console.error("Error:", error);
        }));
    }));
    window["FLS"] = true;
})();