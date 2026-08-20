/* ==========================================
   PROJECT AURORA PREMIUM V4
========================================== */


/* ==========================
   LOADER
========================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (loader) {

        setTimeout(() => {

            loader.style.opacity = "0";

            setTimeout(() => {
                loader.style.display = "none";
            }, 500);

        }, 2000);

    }

});


/* ==========================
   EXPLORE BUTTON
========================== */

const exploreBtn =
    document.getElementById("exploreBtn");

if (exploreBtn) {

    exploreBtn.addEventListener("click", () => {

        const projects =
            document.getElementById("projects");

        if (projects) {

            projects.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


/* ==========================
   SCROLL PROGRESS BAR
========================== */

window.addEventListener("scroll", () => {

    const winScroll =
        document.documentElement.scrollTop;

    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress =
        height > 0
            ? (winScroll / height) * 100
            : 0;

    const bar =
        document.getElementById("progressBar");

    if (bar) {

        bar.style.width =
            progress + "%";

    }

});


/* ==========================
   TYPING EFFECT
========================== */

const typingTarget =
    document.getElementById("typingText");

const text =
    "Builder • Dreamer • Innovator • Future Founder";

let index = 0;

function typeText() {

    if (!typingTarget) return;

    if (index < text.length) {

        typingTarget.innerHTML +=
            text.charAt(index);

        index++;

        setTimeout(typeText, 70);

    }

}

typeText();


/* ==========================
   REVEAL ANIMATION
========================== */

const revealElements =
    document.querySelectorAll(
        ".project-card,.skill-card,.dream-card,.timeline-item,.dashboard-card"
    );

const revealObserver =
    new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

            }

        });

    }, {
        threshold: 0.15
    });


revealElements.forEach(el => {

    el.style.opacity = "0";

    el.style.transform =
        "translateY(40px)";

    el.style.transition =
        ".8s ease";

    revealObserver.observe(el);

});


/* ==========================
   COUNTERS
========================== */

const counters =
    document.querySelectorAll(".counter");

counters.forEach(counter => {

    const updateCounter = () => {

        const target =
            +counter.getAttribute("data-target");

        const current =
            +counter.innerText;

        const increment =
            target / 100;

        if (current < target) {

            counter.innerText =
                Math.ceil(current + increment);

            setTimeout(updateCounter, 20);

        } else {

            counter.innerText =
                target;

        }

    };

    updateCounter();

});


/* ==========================
   HIMIGPT CHAT
========================== */

async function sendMessage() {

    const input =
        document.getElementById("userInput");

    const messages =
        document.getElementById("chatMessages");

    if (!input || !messages) return;

    const message =
        input.value.trim();

    if (message === "") return;


    /* USER MESSAGE */

    messages.innerHTML +=
        `
        <div class="user-message">
            ${message}
        </div>
        `;

    input.value = "";


    /* AI THINKING MESSAGE */

    messages.innerHTML +=
        `
        <div class="bot-message ai-thinking">
            🤖 HimiGPT is thinking...
        </div>
        `;

    messages.scrollTop =
        messages.scrollHeight;


    try {

        const response =
            await fetch(
                "https://himigpt-backend.onrender.com/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server Error: ${response.status}`
            );

        }


        const data =
            await response.json();


        /* REMOVE THINKING MESSAGE */

        const thinking =
            messages.querySelector(
                ".ai-thinking"
            );

        if (thinking) {
            thinking.remove();
        }


        /* AI RESPONSE */

        messages.innerHTML +=
            `
            <div class="bot-message">
                ${data.reply || "No response received."}
            </div>
            `;

    }

    catch (error) {

        console.error(
            "HimiGPT Error:",
            error
        );


        const thinking =
            messages.querySelector(
                ".ai-thinking"
            );

        if (thinking) {
            thinking.remove();
        }


        messages.innerHTML +=
            `
            <div class="bot-message">
                ❌ Unable to connect to HimiGPT.
                Please try again.
            </div>
            `;

    }


    messages.scrollTop =
        messages.scrollHeight;

}


/* ==========================
   AI FLOATING ASSISTANT
========================== */

const bubble =
    document.getElementById("aiBubble");

const popup =
    document.getElementById("aiPopup");

const closeBtn =
    document.getElementById("closePopup");


if (bubble && popup) {

    bubble.onclick = () => {

        popup.style.display =
            "block";

    };

}


if (closeBtn && popup) {

    closeBtn.onclick = () => {

        popup.style.display =
            "none";

    };

}


/* ==========================
   AURORA OS ICONS
========================== */

document
    .querySelectorAll(".app-icon")
    .forEach(icon => {

        icon.addEventListener(
            "click",
            () => {

                const app =
                    icon.innerText.trim();

                alert(
                    "Launching " +
                    app +
                    " 🚀"
                );

            }
        );

    });


/* ==========================
   PARALLAX EFFECT
========================== */

document.addEventListener(
    "mousemove",
    (e) => {

        const hero =
            document.querySelector(".hero");

        if (!hero) return;

        const x =
            (e.clientX / window.innerWidth) * 20;

        const y =
            (e.clientY / window.innerHeight) * 20;

        hero.style.backgroundPosition =
            `${x}px ${y}px`;

    }
);


/* ==========================
   PARTICLES JS
========================== */

if (
    typeof particlesJS !== "undefined"
) {

    particlesJS(
        "particles-js",
        {

            particles: {

                number: {
                    value: 70
                },

                color: {
                    value: "#8ab4ff"
                },

                shape: {
                    type: "circle"
                },

                opacity: {
                    value: 0.5
                },

                size: {
                    value: 3
                },

                line_linked: {

                    enable: true,

                    distance: 150,

                    color: "#8ab4ff",

                    opacity: 0.25

                },

                move: {

                    enable: true,

                    speed: 2

                }

            }

        }
    );

}


/* ==========================
   GREETING
========================== */

const greetings = [

    "Welcome Back Himanshu 🚀",

    "Future Founder Detected 👑",

    "Aurora Systems Online 🤖",

    "Mission Active ⚡",

    "Building Tomorrow Today 🌌"

];


console.log(
    greetings[
        Math.floor(
            Math.random() *
            greetings.length
        )
    ]
);


/* ==========================
   COMMAND CENTER
========================== */

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.ctrlKey &&
            e.key.toLowerCase() === "k"
        ) {

            e.preventDefault();

            alert(
                "Aurora Command Center Coming Soon 🚀"
            );

        }

    }
);


/* ==========================
   STATUS ANIMATION
========================== */

setInterval(() => {

    const status =
        document.querySelector(".online");

    if (status) {

        status.style.opacity =
            status.style.opacity === "0.5"
                ? "1"
                : "0.5";

    }

}, 800);


/* ==========================
   MOUSE GLOW
========================== */

const glow =
    document.querySelector(".mouse-glow");

if (glow) {

    document.addEventListener(
        "mousemove",
        (e) => {

            glow.style.left =
                e.clientX + "px";

            glow.style.top =
                e.clientY + "px";

        }
    );

}


/* ==========================
   PROJECT CARD 3D EFFECT
========================== */

const cards =
    document.querySelectorAll(
        ".project-card"
    );


cards.forEach(card => {

    card.addEventListener(
        "mousemove",
        (e) => {

            const rect =
                card.getBoundingClientRect();

            const x =
                e.clientX - rect.left;

            const y =
                e.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - 0.5) * 20;

            const rotateX =
                ((y / rect.height) - 0.5) * -20;

            card.style.transform =
                `rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-10px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "rotateX(0deg) rotateY(0deg)";

        }
    );

});


/* ==========================
   CIRCULAR SKILLS
========================== */

const circles =
    document.querySelectorAll(
        ".circle"
    );


circles.forEach(circle => {

    const percent =
        circle.dataset.percent;

    const degree =
        (percent / 100) * 360;

    circle.style.background =
        `conic-gradient(
            #00d4ff ${degree}deg,
            rgba(255,255,255,.08) ${degree}deg
        )`;

});


/* ==========================
   LIVE CLOCK
========================== */

function updateClock() {

    const clock =
        document.getElementById(
            "liveClock"
        );

    if (!clock) return;

    const now =
        new Date();

    clock.innerHTML =
        now.toLocaleTimeString();

}


setInterval(
    updateClock,
    1000
);

updateClock();


/* ==========================
   AURORA TERMINAL
========================== */

function runCommand() {

    const input =
        document.getElementById(
            "terminalCommand"
        );

    const output =
        document.getElementById(
            "terminalOutput"
        );

    if (!input || !output) return;

    const cmd =
        input.value
            .trim()
            .toLowerCase();

    let response =
        "Unknown command.";


    if (cmd === "whoami") {

        response =
            "Himanshu | Physics Student | AI Builder";

    }

    else if (cmd === "projects") {

        response =
            "HimiGPT, FutureSite, MyCBSE, Aurora";

    }

    else if (cmd === "startup") {

        response =
            "Mission: Build Billion Dollar AI Startup";

    }

    else if (cmd === "future") {

        response =
            "AI + Robotics + AGI + Innovation";

    }

    else if (cmd === "skills") {

        response =
            "Python, AI, Web Development, Physics";

    }


    output.innerHTML +=
        `<div>> ${cmd}</div>`;

    output.innerHTML +=
        `<div>${response}</div>`;

    output.scrollTop =
        output.scrollHeight;

    input.value = "";

}


/* ==========================
   VAULT
========================== */

const unlockVault =
    document.getElementById(
        "unlockVault"
    );

if (unlockVault) {

    unlockVault.addEventListener(
        "click",
        () => {

            const vaultContent =
                document.getElementById(
                    "vaultContent"
                );

            if (vaultContent) {

                vaultContent.style.display =
                    "block";

            }

            if (
                typeof confetti ===
                "function"
            ) {

                confetti({
                    particleCount: 150,
                    spread: 120
                });

            }

        }
    );

}


/* ==========================
   AI PROMPT HELPERS
========================== */

function fillPrompt(text) {

    const input =
        document.getElementById(
            "userInput"
        );

    if (input) {

        input.value =
            text;

        input.focus();

    }

}


/* ==========================
   ENTER TO SEND MESSAGE
========================== */

const userInput =
    document.getElementById(
        "userInput"
    );


if (userInput) {

    userInput.addEventListener(
        "keypress",
        function (e) {

            if (e.key === "Enter") {

                sendMessage();

            }

        }
    );

}


/* ==========================
   VOICE INPUT
========================== */

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice recognition not supported."
        );

        return;

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-US";


    recognition.start();


    recognition.onresult =
        (event) => {

            const input =
                document.getElementById(
                    "userInput"
                );

            if (input) {

                input.value =
                    event.results[0][0]
                        .transcript;

            }

        };


    recognition.onerror =
        (event) => {

            console.error(
                "Voice recognition error:",
                event.error
            );

        };

}


/* ==========================
   END
========================== */

console.log(
    "PROJECT AURORA V4 + HimiGPT LOADED 🚀"
);