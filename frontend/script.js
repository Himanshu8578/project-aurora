/* =========================================================
   AURORA — MAIN FRONTEND ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

/*
   IMPORTANT:
   Agar tumhara Render backend kisi aur URL par hai,
   sirf BACKEND_URL ko change karna hai.

   Example:
   const BACKEND_URL = "https://aurora-backend.onrender.com";
*/

const BACKEND_URL =
    window.AURORA_BACKEND_URL ||
    "http://localhost:8000";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

const Aurora = {

    currentSection: "overview",

    messages: [],

    isSending: false,

    backendOnline: false,

    startedAt: Date.now(),

    universe: {
        mouseX: 0,
        mouseY: 0,
        targetX: 0,
        targetY: 0
    }

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    initializeAI();

    initializeCommandBar();

    initializeKeyboardShortcuts();

    initializeClock();

    initializeUniverse();

    initializeButtons();

    initializeFileInput();

    initializeLatency();

    initializeAnimations();

    showSection("overview");

    setTimeout(() => {

        showNotification(
            "AURORA",
            "Intelligence system initialized."
        );

    }, 800);

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const navItems = $$("[data-section]");

    navItems.forEach(item => {

        item.addEventListener("click", event => {

            event.preventDefault();

            const section =
                item.dataset.section;

            if (!section) return;

            showSection(section);

        });

    });

}


/* =========================================================
   SHOW SECTION
   ========================================================= */

function showSection(sectionName) {

    const sections =
        $$(".page-section");

    const navItems =
        $$(".nav-item[data-section]");

    const target =
        document.getElementById(sectionName);

    if (!target) {

        console.warn(
            `Aurora: section "${sectionName}" not found.`
        );

        return;

    }


    Aurora.currentSection =
        sectionName;


    /* Hide sections */

    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    /* Activate target */

    target.classList.add(
        "active-section"
    );


    /* Update sidebar */

    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === sectionName
        );

    });


    /* Scroll main content */

    const main =
        $(".main-content");

    if (main) {

        main.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /* Update URL without reload */

    try {

        history.replaceState(
            null,
            "",
            `#${sectionName}`
        );

    } catch (error) {

        console.warn(error);

    }

}


/* =========================================================
   HASH NAVIGATION
   ========================================================= */

function initializeHashNavigation() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim();

    if (
        hash &&
        document.getElementById(hash)
    ) {

        showSection(hash);

    }

}

window.addEventListener(
    "load",
    initializeHashNavigation
);


/* =========================================================
   AI INITIALIZATION
   ========================================================= */

function initializeAI() {

    const form =
        $("#aiForm");

    const input =
        $("#aiInput");

    const sendButton =
        $("#sendButton");


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                sendAIMessage();

            }
        );

    }


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendAIMessage
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendAIMessage();

                }

            }
        );

    }


    /* Voice */

    const voiceButton =
        $("#voiceButton");

    if (voiceButton) {

        voiceButton.addEventListener(
            "click",
            startVoiceInput
        );

    }


    /* File */

    const fileButton =
        $("#fileButton");

    if (fileButton) {

        fileButton.addEventListener(
            "click",
            () => {

                const input =
                    $("#fileInput");

                if (input) {
                    input.click();
                }

            }
        );

    }


    /*
       Initial Aurora message
    */

    if (!Aurora.messages.length) {

        Aurora.messages.push({

            role: "assistant",

            content:
                "Hello Himanshu. I'm Aurora — your personal intelligence interface. Ask me anything."

        });

    }

}


/* =========================================================
   SEND AI MESSAGE
   ========================================================= */

async function sendAIMessage(customMessage = null) {

    if (Aurora.isSending) {

        return;

    }


    const input =
        $("#aiInput");


    const message =
        customMessage ||
        (input ? input.value.trim() : "");


    if (!message) {

        return;

    }


    Aurora.isSending = true;


    if (input) {

        input.value = "";

    }


    addChatMessage(
        "user",
        message
    );


    Aurora.messages.push({

        role: "user",

        content: message

    });


    showTypingIndicator();


    const start =
        performance.now();


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message: message,

                        history:
                            Aurora.messages
                                .slice(-12)

                    })

                }
            );


        const latency =
            Math.round(
                performance.now() - start
            );


        updateLatency(latency);


        if (!response.ok) {

            throw new Error(
                `Backend returned ${response.status}`
            );

        }


        const data =
            await response.json();


        removeTypingIndicator();


        const answer =
            extractAIResponse(data);


        addChatMessage(
            "assistant",
            answer
        );


        Aurora.messages.push({

            role: "assistant",

            content: answer

        });


        Aurora.backendOnline = true;

        updateBackendStatus(true);


    } catch (error) {

        console.error(
            "Aurora AI error:",
            error
        );


        removeTypingIndicator();


        Aurora.backendOnline = false;

        updateBackendStatus(false);


        /*
           Helpful fallback instead of a blank screen.
        */

        const fallback =
            getFallbackResponse(message);


        addChatMessage(
            "assistant",
            fallback
        );


        Aurora.messages.push({

            role: "assistant",

            content: fallback

        });


        showNotification(
            "BACKEND",
            "AI server is not reachable."
        );

    } finally {

        Aurora.isSending = false;

    }

}


/* =========================================================
   EXTRACT AI RESPONSE
   Supports multiple common FastAPI response formats
   ========================================================= */

function extractAIResponse(data) {

    if (!data) {

        return "Aurora received an empty response.";

    }


    if (typeof data === "string") {

        return data;

    }


    const possibleKeys = [

        "response",

        "answer",

        "message",

        "reply",

        "text",

        "content",

        "output"

    ];


    for (
        const key of possibleKeys
    ) {

        if (
            typeof data[key] === "string" &&
            data[key].trim()
        ) {

            return data[key];

        }

    }


    /*
       Some APIs return:
       { data: { response: "..." } }
    */

    if (
        data.data &&
        typeof data.data === "object"
    ) {

        for (
            const key of possibleKeys
        ) {

            if (
                typeof data.data[key] === "string"
            ) {

                return data.data[key];

            }

        }

    }


    return JSON.stringify(
        data,
        null,
        2
    );

}


/* =========================================================
   FALLBACK RESPONSE
   ========================================================= */

function getFallbackResponse(message) {

    const text =
        message.toLowerCase();


    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {

        return (
            "Hello Himanshu. Aurora is running, " +
            "but the AI backend is currently unavailable. " +
            "Start your backend and try again."
        );

    }


    if (
        text.includes("project")
    ) {

        return (
            "Aurora is currently operating in frontend mode. " +
            "Once the backend is connected, I can answer " +
            "project-specific questions dynamically."
        );

    }


    if (
        text.includes("who are you")
    ) {

        return (
            "I'm Aurora, the intelligence interface " +
            "of this portfolio."
        );

    }


    return (
        "Aurora frontend is working correctly, " +
        "but I can't reach the AI backend right now. " +
        "Check your Render/backend URL and make sure " +
        "the /chat endpoint is running."
    );

}


/* =========================================================
   ADD CHAT MESSAGE
   ========================================================= */

function addChatMessage(
    role,
    content
) {

    const container =
        $("#aiMessages");


    if (!container) {

        return;

    }


    const message =
        document.createElement("div");


    message.className =
        "ai-message";


    const avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";


    avatar.textContent =
        role === "user"
            ? "H"
            : "A";


    const body =
        document.createElement("div");


    body.className =
        "message-body";


    const label =
        document.createElement("span");


    label.className =
        "message-label";


    label.textContent =
        role === "user"
            ? "HIMANSHU"
            : "AURORA";


    const paragraph =
        document.createElement("p");


    paragraph.innerHTML =
        formatMessage(content);


    body.appendChild(label);

    body.appendChild(paragraph);


    message.appendChild(avatar);

    message.appendChild(body);


    container.appendChild(message);


    container.scrollTo({

        top:
            container.scrollHeight,

        behavior:
            "smooth"

    });

}


/* =========================================================
   MESSAGE FORMATTER
   ========================================================= */

function formatMessage(text) {

    if (!text) return "";


    /*
       Escape HTML first.
    */

    let safe =
        escapeHTML(String(text));


    /*
       Basic markdown support.
    */

    safe =
        safe.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    safe =
        safe.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


    safe =
        safe.replace(
            /\n/g,
            "<br>"
        );


    return safe;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return value
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTypingIndicator() {

    removeTypingIndicator();


    const container =
        $("#aiMessages");


    if (!container) return;


    const typing =
        document.createElement("div");


    typing.id =
        "auroraTyping";


    typing.className =
        "ai-message";


    typing.innerHTML = `

        <div class="message-avatar">
            A
        </div>

        <div class="message-body">

            <span class="message-label">
                AURORA
            </span>

            <p>
                <span class="typing-dots">
                    <i></i>
                    <i></i>
                    <i></i>
                </span>
            </p>

        </div>

    `;


    container.appendChild(typing);


    container.scrollTo({

        top:
            container.scrollHeight,

        behavior:
            "smooth"

    });

}


/* =========================================================
   REMOVE TYPING
========================================================= */

function removeTypingIndicator() {

    const typing =
        $("#auroraTyping");


    if (typing) {

        typing.remove();

    }

}


/* =========================================================
   COMMAND BAR
========================================================= */

function initializeCommandBar() {

    const form =
        $("#globalCommandForm");

    const input =
        $("#globalCommandInput");

    const button =
        $("#globalAskButton");


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                executeGlobalCommand();

            }
        );

    }


    if (button) {

        button.addEventListener(
            "click",
            executeGlobalCommand
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    executeGlobalCommand();

                }

            }
        );

    }

}


/* =========================================================
   GLOBAL COMMAND
========================================================= */

function executeGlobalCommand() {

    const input =
        $("#globalCommandInput");


    if (!input) return;


    const command =
        input.value.trim();


    if (!command) {

        showSection("aurora-ai");

        const aiInput =
            $("#aiInput");

        if (aiInput) {

            setTimeout(
                () => aiInput.focus(),
                300
            );

        }

        return;

    }


    input.value = "";


    /*
       Commands beginning with /
    */

    if (
        command.startsWith("/")
    ) {

        handleSlashCommand(
            command
        );

        return;

    }


    showSection("aurora-ai");


    const aiInput =
        $("#aiInput");


    if (aiInput) {

        aiInput.value =
            command;

    }


    sendAIMessage(command);

}


/* =========================================================
   SLASH COMMANDS
========================================================= */

function handleSlashCommand(command) {

    const parts =
        command
            .slice(1)
            .trim()
            .split(/\s+/);


    const action =
        parts[0]
            ?.toLowerCase();


    const sectionMap = {

        home:
            "overview",

        overview:
            "overview",

        ai:
            "aurora-ai",

        projects:
            "projects",

        project:
            "projects",

        about:
            "about",

        skills:
            "skills",

        mission:
            "mission",

        research:
            "research",

        memory:
            "memory",

        roadmap:
            "roadmap",

        contact:
            "contact"

    };


    if (
        sectionMap[action]
    ) {

        showSection(
            sectionMap[action]
        );

        showNotification(
            "NAVIGATION",
            `Opened ${sectionMap[action]}.`
        );

        return;

    }


    if (
        action === "clear"
    ) {

        clearChat();

        return;

    }


    if (
        action === "status"
    ) {

        checkBackend();

        return;

    }


    if (
        action === "help"
    ) {

        showNotification(
            "COMMANDS",
            "/ai /projects /skills /research /memory /status /clear"
        );

        return;

    }


    showNotification(
        "UNKNOWN COMMAND",
        `Command "${action}" was not recognized.`
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function initializeKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            /*
               Ctrl + K
            */

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                const commandInput =
                    $("#globalCommandInput");

                if (commandInput) {

                    commandInput.focus();

                    commandInput.select();

                }

            }


            /*
               Escape
            */

            if (
                event.key === "Escape"
            ) {

                const commandInput =
                    $("#globalCommandInput");

                if (
                    document.activeElement ===
                    commandInput
                ) {

                    commandInput.blur();

                }

            }

        }
    );

}


/* =========================================================
   CLOCK
========================================================= */

function initializeClock() {

    updateClock();

    setInterval(
        updateClock,
        1000
    );

}


function updateClock() {

    const now =
        new Date();


    const clock =
        $("#liveClock");

    const date =
        $("#liveDate");


    if (clock) {

        clock.textContent =
            now.toLocaleTimeString(
                "en-IN",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit",

                    hour12:
                        false
                }
            );

    }


    if (date) {

        date.textContent =
            now.toLocaleDateString(
                "en-IN",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            ).toUpperCase();

    }

}


/* =========================================================
   UNIVERSE
========================================================= */

function initializeUniverse() {

    const universe =
        $("#universe");


    if (!universe) {

        createUniverse();

    }


    document.addEventListener(
        "mousemove",
        event => {

            Aurora.universe.targetX =
                (
                    event.clientX /
                    window.innerWidth
                    - .5
                ) * 2;


            Aurora.universe.targetY =
                (
                    event.clientY /
                    window.innerHeight
                    - .5
                ) * 2;

        }
    );


    animateUniverse();

}


/* =========================================================
   CREATE UNIVERSE
========================================================= */

function createUniverse() {

    const universe =
        document.createElement("div");


    universe.id =
        "universe";


    universe.innerHTML = `

        <div class="space-layer space-layer-1"></div>

        <div class="space-layer space-layer-2"></div>

        <div class="space-layer space-layer-3"></div>

        <div class="stars stars-small"></div>

        <div class="stars stars-medium"></div>

        <div class="stars stars-large"></div>

        <div class="nebula nebula-1"></div>

        <div class="nebula nebula-2"></div>

        <div class="nebula nebula-3"></div>

        <div class="orbit orbit-1"></div>

        <div class="orbit orbit-2"></div>

        <div class="orbit orbit-3"></div>

        <div class="cosmic-core"></div>

    `;


    document.body.prepend(
        universe
    );

}


/* =========================================================
   UNIVERSE MOUSE PARALLAX
========================================================= */

function animateUniverse() {

    Aurora.universe.mouseX +=
        (
            Aurora.universe.targetX -
            Aurora.universe.mouseX
        ) * .025;


    Aurora.universe.mouseY +=
        (
            Aurora.universe.targetY -
            Aurora.universe.mouseY
        ) * .025;


    const universe =
        $("#universe");


    if (universe) {

        universe.style.transform =
            `
            translate3d(
                ${Aurora.universe.mouseX * -5}px,
                ${Aurora.universe.mouseY * -5}px,
                0
            )
            `;

    }


    requestAnimationFrame(
        animateUniverse
    );

}


/* =========================================================
   GENERAL BUTTONS
========================================================= */

function initializeButtons() {

    /*
       Fullscreen
    */

    const fullscreenButton =
        $("#fullscreenButton");


    if (fullscreenButton) {

        fullscreenButton.addEventListener(
            "click",
            toggleFullscreen
        );

    }


    /*
       Clear chat
    */

    const clearButton =
        $("#clearChatButton");


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearChat
        );

    }


    /*
       Quick commands
    */

    $$(".quick-command").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const command =
                        button.dataset.command ||
                        button.textContent.trim();


                    showSection(
                        "aurora-ai"
                    );


                    sendAIMessage(
                        command
                    );

                }
            );

        }
    );


    /*
       Project buttons
    */

    $$(".project-btn").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;


                    if (
                        action === "demo"
                    ) {

                        showNotification(
                            "PROJECT",
                            "Demo connection ready."
                        );

                    }

                    else if (
                        action === "github"
                    ) {

                        const url =
                            button.dataset.url;


                        if (url) {

                            window.open(
                                url,
                                "_blank",
                                "noopener,noreferrer"
                            );

                        } else {

                            showNotification(
                                "GITHUB",
                                "Add your GitHub URL."
                            );

                        }

                    }

                }
            );

        }
    );

}


/* =========================================================
   FULLSCREEN
========================================================= */

async function toggleFullscreen() {

    try {

        if (
            !document.fullscreenElement
        ) {

            await document.documentElement
                .requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.warn(
            "Fullscreen unavailable:",
            error
        );

    }

}


/* =========================================================
   FILE INPUT
========================================================= */

function initializeFileInput() {

    const fileInput =
        $("#fileInput");


    if (!fileInput) return;


    fileInput.addEventListener(
        "change",
        event => {

            const files =
                Array.from(
                    event.target.files || []
                );


            if (!files.length) {

                return;

            }


            const names =
                files
                    .map(
                        file =>
                            file.name
                    )
                    .join(", ");


            showNotification(
                "FILES",
                `${files.length} file(s) selected.`
            );


            console.log(
                "Aurora selected files:",
                files
            );


            /*
               NOTE:
               This only selects files in frontend.
               Actual upload to backend requires
               a backend endpoint.
            */

            const aiInput =
                $("#aiInput");


            if (aiInput) {

                aiInput.placeholder =
                    `Selected: ${names}`;

            }

        }
    );

}


/* =========================================================
   VOICE INPUT
========================================================= */

function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        showNotification(
            "VOICE",
            "Voice recognition is not supported in this browser."
        );

        return;

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";

    recognition.interimResults =
        false;

    recognition.maxAlternatives =
        1;


    showNotification(
        "VOICE",
        "Listening..."
    );


    recognition.start();


    recognition.onresult =
        event => {

            const transcript =
                event.results[0][0].transcript;


            const input =
                $("#aiInput");


            if (input) {

                input.value =
                    transcript;

            }


            showNotification(
                "VOICE",
                "Voice captured."
            );

        };


    recognition.onerror =
        error => {

            console.warn(
                "Voice error:",
                error
            );


            showNotification(
                "VOICE",
                "Could not capture voice."
            );

        };

}


/* =========================================================
   CLEAR CHAT
========================================================= */

function clearChat() {

    const container =
        $("#aiMessages");


    if (container) {

        container.innerHTML = "";

    }


    Aurora.messages = [];


    addChatMessage(
        "assistant",
        "Memory cleared for this session. Aurora is ready."
    );


    Aurora.messages.push({

        role: "assistant",

        content:
            "Memory cleared for this session. Aurora is ready."

    });


    showNotification(
        "AURORA",
        "Conversation cleared."
    );

}


/* =========================================================
   BACKEND STATUS
========================================================= */

async function checkBackend() {

    const start =
        performance.now();


    try {

        /*
           Try common health endpoints.
        */

        let response;


        try {

            response =
                await fetch(
                    `${BACKEND_URL}/health`,
                    {
                        method: "GET"
                    }
                );

        } catch {

            response =
                await fetch(
                    `${BACKEND_URL}/`,
                    {
                        method: "GET"
                    }
                );

        }


        const latency =
            Math.round(
                performance.now() - start
            );


        updateLatency(
            latency
        );


        if (
            response.ok
        ) {

            Aurora.backendOnline =
                true;

            updateBackendStatus(
                true
            );

            showNotification(
                "BACKEND",
                `Online — ${latency} ms`
            );

        } else {

            throw new Error(
                "Backend unavailable"
            );

        }

    } catch (error) {

        Aurora.backendOnline =
            false;

        updateBackendStatus(
            false
        );

        showNotification(
            "BACKEND",
            "Offline / unreachable."
        );

    }

}


/* =========================================================
   AUTO BACKEND CHECK
========================================================= */

function initializeLatency() {

    setTimeout(
        checkBackend,
        1200
    );


    /*
       Check every 30 seconds.
    */

    setInterval(
        checkBackend,
        30000
    );

}


/* =========================================================
   UPDATE BACKEND STATUS
========================================================= */

function updateBackendStatus(
    online
) {

    const status =
        $("#backendStatus");


    if (!status) return;


    if (online) {

        status.textContent =
            "ONLINE";

        status.classList.add(
            "online-text"
        );

    } else {

        status.textContent =
            "OFFLINE";

        status.classList.remove(
            "online-text"
        );

    }

}


/* =========================================================
   LATENCY
========================================================= */

function updateLatency(
    value
) {

    const element =
        $("#latency");


    if (!element) return;


    element.textContent =
        Number.isFinite(value)
            ? value
            : "--";

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

let notificationTimer = null;


function showNotification(
    title,
    message
) {

    const notification =
        $("#notification");


    const titleElement =
        $("#notificationTitle");


    const messageElement =
        $("#notificationMessage");


    if (
        !notification ||
        !titleElement ||
        !messageElement
    ) {

        return;

    }


    titleElement.textContent =
        title;


    messageElement.textContent =
        message;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   EXTRA ANIMATIONS
========================================================= */

function initializeAnimations() {

    /*
       Add a subtle tilt to cards.
    */

    const cards =
        $$(
            ".focus-card, " +
            ".project-card, " +
            ".skill-domain, " +
            ".mission-card, " +
            ".contact-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth < 900
                ) {

                    return;

                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const rotateY =
                    (
                        x /
                        rect.width -
                        .5
                    ) * 3;


                const rotateX =
                    (
                        y /
                        rect.height -
                        .5
                    ) * -3;


                card.style.transform =
                    `
                    translateY(-3px)
                    perspective(800px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    `;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });

}


/* =========================================================
   CONNECTION ERROR HELPER
========================================================= */

window.addEventListener(
    "offline",
    () => {

        showNotification(
            "NETWORK",
            "Browser connection lost."
        );

    }
);


window.addEventListener(
    "online",
    () => {

        showNotification(
            "NETWORK",
            "Connection restored."
        );


        checkBackend();

    }
);


/* =========================================================
   GLOBAL AURORA API
   Useful for debugging from browser console.
========================================================= */

window.Aurora =
    Aurora;


window.AuroraUI = {

    showSection,

    sendAIMessage,

    clearChat,

    checkBackend,

    showNotification

};


/* =========================================================
   DEVELOPMENT LOG
========================================================= */

console.log(
    "%c AURORA ",
    `
        background: #00eaff;
        color: #001018;
        font-weight: 800;
        padding: 5px 10px;
        border-radius: 5px;
    `
);

console.log(
    "Aurora frontend initialized."
);

console.log(
    "Backend:",
    BACKEND_URL
);