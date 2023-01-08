const socket = io()
let strangerId
let logs = document.getElementById('logs')
const textarea = document.getElementById('textarea')
const bottomDiv = document.getElementById('bottomBar')

socket.on('strangerDisconnected', function() {
    offBottomBar()
    logs.innerHTML += `<br><h2>Obcy się rozłączył!<h2><br><button onclick="endConversation()" id='reconnectButton'>Znajdź losowego rozmówce</button>`
    logs.scrollTo(0, logs.scrollHeight);
})

function endConversation() {
    window.location.reload();
    // offBottomBar()
    // logs.innerHTML += "<h2>Rozłączyłeś się!<h2><br><a href='rozmowa.html'>Znajdź losowego rozmówce</a>"
    // logs.scrollTo(0, logs.scrollHeight);
}

socket.on('newMatch', function(data) {
    // console.log('Matched!!!')
    strangerId = data.id
    logs.innerHTML = "<p>Znaleziono obcego!</p><br>"
    onBottomBar()
})
function sendMessage(text) {
    socket.emit('sendMessage', { text: text, stranger: strangerId })
}
socket.on('newMessage', function(data) {
    addMessage(true, data.text)
})

function getCurrentMessage() {
    if(textarea.value.length >= 269) {
        alert('Przekroczyłeś limit znaków! (limit to 269)')
        return
    }
    if(textarea.value == "" || textarea.value == " ") return
    addMessage(false, textarea.value)
    sendMessage(textarea.value)
    textarea.value = ""
}

// If the user has pressed enter
function confirmSend() {
    if(event.keyCode !== 13) return
    getCurrentMessage()
}
function onBottomBar() {
    bottomDiv.style.visibility = 'visible'
}

function offBottomBar() {
    bottomDiv.style.visibility = 'hidden'
}

function addMessage(stranger, text) {
    if(!stranger) {
        logs.innerHTML += `<span class="me">Ja: </span><span>${text}</span><br>`
    } else {
        logs.innerHTML += `<span class="stranger">Obcy: </span><span>${text}</span><br>`
    }
    logs.scrollTo(0, logs.scrollHeight);
}