/* ==========================================
   PROJECT AURORA PREMIUM V4
========================================== */

/* ==========================
   LOADER
========================== */

window.addEventListener("load",()=>{

const loader =
document.getElementById("loader");

if(loader){

setTimeout(()=>{

loader.style.opacity="0";

setTimeout(()=>{
loader.style.display="none";
},500);

},2000);

}

});

/* ==========================
   EXPLORE BUTTON
========================== */

const exploreBtn =
document.getElementById("exploreBtn");

if(exploreBtn){

exploreBtn.addEventListener("click",()=>{

document
.getElementById("projects")
.scrollIntoView({
behavior:"smooth"
});

});

}

/* ==========================
   SCROLL PROGRESS BAR
========================== */

window.addEventListener("scroll",()=>{

const winScroll =
document.documentElement.scrollTop;

const height =
document.documentElement.scrollHeight -
document.documentElement.clientHeight;

const progress =
(winScroll/height)*100;

const bar =
document.getElementById("progressBar");

if(bar){

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

function typeText(){

if(!typingTarget) return;

if(index < text.length){

typingTarget.innerHTML +=
text.charAt(index);

index++;

setTimeout(typeText,70);

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
new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform=
"translateY(0)";

}

});

},{
threshold:0.15
});

revealElements.forEach(el=>{

el.style.opacity="0";

el.style.transform=
"translateY(40px)";

el.style.transition=
".8s ease";

revealObserver.observe(el);

});

/* ==========================
   COUNTERS
========================== */

const counters =
document.querySelectorAll(".counter");

counters.forEach(counter=>{

const updateCounter=()=>{

const target =
+counter.getAttribute("data-target");

const current =
+counter.innerText;

const increment =
target/100;

if(current < target){

counter.innerText =
Math.ceil(current + increment);

setTimeout(updateCounter,20);

}
else{

counter.innerText =
target;

}

};

updateCounter();

});

/* ==========================
   HIMIGPT CHAT
========================== */

async function sendMessage(){

const input =
document.getElementById("userInput");

const messages =
document.getElementById("chatMessages");

const message =
input.value.trim();

if(message==="") return;

messages.innerHTML +=
`
<div class="user-message">
${message}
</div>
`;

input.value="";

try{

const response =
await fetch(
"http://127.0.0.1:8000/chat",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:message
})
}
);

const data =
await response.json();

messages.innerHTML +=
`
<div class="bot-message">
${data.reply}
</div>
`;

}
catch(error){

messages.innerHTML +=
`
<div class="bot-message">
❌ Backend Offline
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

if(bubble && popup){

bubble.onclick=()=>{

popup.style.display="block";

};

}

if(closeBtn){

closeBtn.onclick=()=>{

popup.style.display="none";

};

}

/* ==========================
   AURORA OS ICONS
========================== */

document
.querySelectorAll(".app-icon")
.forEach(icon=>{

icon.addEventListener("click",()=>{

const app =
icon.innerText.trim();

alert(
"Launching " + app + " 🚀"
);

});

});

/* ==========================
   PARALLAX EFFECT
========================== */

document.addEventListener(
"mousemove",
(e)=>{

const hero =
document.querySelector(".hero");

if(!hero) return;

const x =
(e.clientX/window.innerWidth)*20;

const y =
(e.clientY/window.innerHeight)*20;

hero.style.backgroundPosition =
`${x}px ${y}px`;

}
);

/* ==========================
   PARTICLES JS
========================== */

if(typeof particlesJS !== "undefined"){

particlesJS("particles-js",{

particles:{

number:{
value:70
},

color:{
value:"#8ab4ff"
},

shape:{
type:"circle"
},

opacity:{
value:0.5
},

size:{
value:3
},

line_linked:{

enable:true,

distance:150,

color:"#8ab4ff",

opacity:0.25

},

move:{

enable:true,

speed:2

}

}

});

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
Math.random()*greetings.length
)
]

);

/* ==========================
   COMMAND CENTER
========================== */

document.addEventListener(
"keydown",
(e)=>{

if(e.ctrlKey && e.key==="k"){

e.preventDefault();

alert(
"Aurora Command Center Coming Soon 🚀"
);

}

}
);

/* ==========================
   END
========================== */

console.log(
"PROJECT AURORA V4 LOADED 🚀"
);
setInterval(()=>{

const status =
document.querySelector(".online");

if(status){

status.style.opacity =
status.style.opacity==="0.5"
? "1"
: "0.5";

}

},800);
const glow =
document.querySelector(".mouse-glow");

document.addEventListener("mousemove",(e)=>{

glow.style.left =
e.clientX + "px";

glow.style.top =
e.clientY + "px";

});
const cards =
document.querySelectorAll(".project-card");

cards.forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect =
card.getBoundingClientRect();

const x =
e.clientX - rect.left;

const y =
e.clientY - rect.top;

const rotateY =
((x / rect.width)-0.5)*20;

const rotateX =
((y / rect.height)-0.5)*-20;

card.style.transform =
`rotateX(${rotateX}deg)
 rotateY(${rotateY}deg)
 translateY(-10px)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform =
"rotateX(0deg) rotateY(0deg)";

});

});
const circles =
document.querySelectorAll(".circle");

circles.forEach(circle=>{

const percent =
circle.dataset.percent;

const degree =
(percent/100)*360;

circle.style.background =
`conic-gradient(
#00d4ff ${degree}deg,
rgba(255,255,255,.08) ${degree}deg
)`;

});
function updateClock(){

const now =
new Date();

document
.getElementById("liveClock")
.innerHTML =
now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();
function runCommand(){

const input =
document.getElementById("terminalCommand");

const output =
document.getElementById("terminalOutput");

const cmd =
input.value.toLowerCase();

let response =
"Unknown command.";

if(cmd==="whoami"){

response =
"Himanshu | Physics Student | AI Builder";

}

else if(cmd==="projects"){

response =
"HimiGPT, FutureSite, MyCBSE, Aurora";

}

else if(cmd==="startup"){

response =
"Mission: Build Billion Dollar AI Startup";

}

else if(cmd==="future"){

response =
"AI + Robotics + AGI + Innovation";

}

else if(cmd==="skills"){

response =
"Python, AI, Web Development, Physics";

}

output.innerHTML +=
`<div>> ${cmd}</div>`;

output.innerHTML +=
`<div>${response}</div>`;

output.scrollTop =
output.scrollHeight;

input.value="";

}
document
.getElementById("friendBtn")
.addEventListener("click",()=>{

document
.getElementById("friendMessage")
.style.opacity="1";

});
document.getElementById("secretFriend").onclick=()=>{

document.body.insertAdjacentHTML("beforeend",`

<div class="shreya-modal">

<div class="shreya-card">

<h1>🌸 Shreya Mode Activated</h1>

<p>
One of the best people in my journey.
</p>

<p>
Thank you for the laughs,
the support,
and for being a wonderful friend.
</p>

<button onclick="this.parentElement.parentElement.remove()">
Close
</button>

</div>

</div>

`);

};
const msgs=[

"Shreya, thanks for being awesome 🌸",

"Friendship > Everything ✨",

"Some people make journeys better 🚀",

"Keep smiling today 🌼"

];

setInterval(()=>{

document.getElementById("dailyMsg")
.innerText=
msgs[Math.floor(Math.random()*msgs.length)];

},3000);
document.getElementById("secretFriend").onclick=()=>{

document.body.insertAdjacentHTML(
"beforeend",

`

<div class="shreya-modal">

<div class="shreya-card">

<h1>🌸 Shreya Mode Activated</h1>

<p>
One of the best people in my journey.
</p>

<p>
Thank you for the laughs,
the support,
and for being a wonderful friend.
</p>

<p>
✨ Friendship makes every mission easier.
</p>

<button onclick="closeShreya()">
Close
</button>

</div>

</div>

`

);

};

function closeShreya(){

document
.querySelector(".shreya-modal")
.remove();

}
document
.getElementById("unlockVault")
.addEventListener("click",()=>{

document
.getElementById("vaultContent")
.style.display="block";

});
document
.getElementById("unlockVault")
.addEventListener("click",()=>{

document
.getElementById("vaultContent")
.style.display="block";

confetti({
particleCount:150,
spread:120
});

});
function fillPrompt(text){

document.getElementById(
"userInput"
).value = text;

}
document
.getElementById("userInput")
.addEventListener("keypress",function(e){

if(e.key==="Enter"){

sendMessage();

}

});
window.addEventListener("load",()=>{

setTimeout(()=>{

const speech =
new SpeechSynthesisUtterance(
"Hello Shreya. I am sorry. Wishing you a wonderful day."
);

speech.rate = 0.95;
speech.pitch = 1.1;
speech.volume = 1;

speechSynthesis.speak(speech);

},2000);

});
function startVoice(){

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(!SpeechRecognition){

alert(
"Voice recognition not supported."
);

return;
}

const recognition =
new SpeechRecognition();

recognition.lang = "en-US";

recognition.start();

recognition.onresult =
(event)=>{

document.getElementById(
"userInput"
).value =
event.results[0][0].transcript;

};

}