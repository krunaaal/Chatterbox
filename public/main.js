const socket = io()

const clientsTotal = document.getElementById('clients-total')

const messageContainer = document.getElementById('message-container')
// const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const tune = new Audio('/tune.mp3')

const username = prompt("Enter Your Name ");
if (username == '') {
    document.getElementById("name-input").innerHTML = `anonymous`;
}
else {
    document.getElementById("name-input").innerHTML = username;
}


socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Members: ${data}`
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})

function sendMessage() {
    //console.log(messageInput.value)
    const data = {
        name: username,
        message: messageInput.value,
        dateTime: new Date(),
    }
    socket.emit('message', data)
    addMessage(true, data)
    messageInput.value = ''
}

socket.on('message', (data) => {
    //console.log(data);
    tune.play()
    addMessage(false, data)
})

function addMessage(isOwnMessage, data) {
    clearFeedback()
    const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
            <span class="uname">
                ${data.name}
            </span>
                ${data.message}
        </p>
    </li>
    <span class="${isOwnMessage ? 'ttr' : 'ttl'}">${moment(data.dateTime).format("ddd, h:m A")}</span>
    `
    if (data.message != '') {
        messageContainer.innerHTML += element;
    }

    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${username} is typing...`,
    })
})
messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${username} is typing...`,
    })
})
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ``,
    })
})


socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
    <li class="message-feedback">
        <p class="feedback" id="feedback">${data.feedback}</p>
    </li>`

    messageContainer.innerHTML += element;
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}
