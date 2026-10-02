const form = document.querySelector("#chat-form");
const input = document.querySelector("#prompt");
const sendButton = document.querySelector(".send-button");
const conversation = document.querySelector("#conversation");
const messages = document.querySelector("#messages");
const welcome = document.querySelector("#welcome");

function appendMessage(role, content, options = {}) {
    const message = document.createElement("article");
    message.className = `message ${role}${options.error ? " error" : ""}${options.pending ? " pending" : ""}`;

    const label = document.createElement("span");
    label.className = "message-label";
    label.textContent = role === "user" ? "You" : "Chronicle";

    const body = document.createElement("div");
    body.className = "message-content";
    body.textContent = content;

    message.append(label, body);
    messages.append(message);
    conversation.scrollTop = conversation.scrollHeight;
    return message;
}

function resizeInput() {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
}

async function ask(prompt) {
    welcome.hidden = true;
    appendMessage("user", prompt);
    const pending = appendMessage("assistant", "Looking up the date...", { pending: true });
    sendButton.disabled = true;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(typeof result === "string" ? result : result.error || "The request could not be completed.");
        }

        pending.querySelector(".message-content").textContent = typeof result === "string" ? result : JSON.stringify(result);
        pending.classList.remove("pending");
    } catch (error) {
        pending.classList.add("error");
        pending.classList.remove("pending");
        pending.querySelector(".message-content").textContent = error.message || "Could not reach the chat server.";
    } finally {
        sendButton.disabled = false;
        input.focus();
        conversation.scrollTop = conversation.scrollHeight;
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const prompt = input.value.trim();
    if (!prompt || sendButton.disabled) return;

    input.value = "";
    resizeInput();
    ask(prompt);
});

input.addEventListener("input", resizeInput);
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
    }
});

document.querySelectorAll(".suggestion").forEach((button) => {
    button.addEventListener("click", () => {
        input.value = button.dataset.prompt;
        form.requestSubmit();
    });
});