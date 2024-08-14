const socket = io('https://your-heroku-app.herokuapp.com'); // Replace with your Heroku app URL
const videoQueue = [];
let currentVideoIndex = -1;

// When the server sends an update
socket.on('update', (data) => {
    if (data.url) {
        const videoId = new URL(data.url).searchParams.get('v');
        document.getElementById('video').src = `https://www.youtube.com/embed/${videoId}?autoplay=${data.isPlaying ? 1 : 0}`;
    }
    if (data.time !== undefined) {
        const iframe = document.getElementById('video');
        iframe.contentWindow.postMessage({ event: 'command', func: 'seekTo', args: [data.time, true] }, '*');
    }
});

// Load video into queue
function loadVideo() {
    const url = document.getElementById('video-url').value;
    if (url) {
        videoQueue.push(url);
        renderQueue();
        if (videoQueue.length === 1) {
            playVideo(0);
        }
        document.getElementById('video-url').value = '';
    }
}

// Play video
function playVideo(index) {
    if (index < 0 || index >= videoQueue.length) return;
    currentVideoIndex = index;
    const url = videoQueue[index];
    const videoId = new URL(url).searchParams.get('v');
    document.getElementById('video').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    socket.emit('play', { time: iframe.contentWindow.postMessage({ event: 'command', func: 'getCurrentTime', args: [] }, '*') });
    renderQueue();
}

// Pause video
function pauseVideo() {
    const iframe = document.getElementById('video');
    iframe.contentWindow.postMessage({ event: 'command', func: 'pauseVideo', args: [] }, '*');
    socket.emit('pause');
}

// Seek video
function seekVideo() {
    const time = prompt('Enter time to seek to (in seconds):');
    if (time) {
        const iframe = document.getElementById('video');
        iframe.contentWindow.postMessage({ event: 'command', func: 'seekTo', args: [time, true] }, '*');
        socket.emit('seek', time);
    }
}

// Render video queue
function renderQueue() {
    const queueList = document.getElementById('queue-list');
    queueList.innerHTML = '';
    videoQueue.forEach((url, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = new URL(url).searchParams.get('v');
        if (index === currentVideoIndex) {
            listItem.classList.add('active');
        }
        listItem.addEventListener('click', () => playVideo(index));
        queueList.appendChild(listItem);
    });
}
