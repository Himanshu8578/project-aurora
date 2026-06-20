async function sendMessage() {

    const input =
    document.getElementById("userInput");

    const message =
    input.value;

    if(!message) return;

    const chat =
    document.getElementById("chatMessages");

    chat.innerHTML += `
    <div class="user-message">
    ${message}
    </div>
    `;

    input.value = "";

    try{

        const response =
        await fetch(
        "http://127.0.0.1:8000/chat",
        {
            method:"POST",
            headers:{
                "Content-Type":
                "application/json"
            },
            body:JSON.stringify({
                message:message
            })
        });

        const data =
        await response.json();

        chat.innerHTML += `
        <div class="bot-message">
        ${data.reply}
        </div>
        `;

    }

    catch(error){

        chat.innerHTML += `
        <div class="bot-message">
        Backend Offline ❌
        </div>
        `;

    }

    chat.scrollTop =
    chat.scrollHeight;

}