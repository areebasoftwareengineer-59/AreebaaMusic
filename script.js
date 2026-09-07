const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const playButton = document.getElementById("play");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const playlist = document.getElementById("playlist");
const visualizer = document.getElementById("visualizer");

const songs = [
    {
        title: "Attach",
        artist: "Areeba Collection",
        src: "music/song1.mp3",
        cover: "images/cover1.jpg"
    },
    {
        title: "So High",
        artist: "Areeba Collection",
        src: "music/song2.mp3",
        cover: "images/cover2.jpg"
    },
    {
        title: "Bad",
        artist: "Areeba Collection",
        src: "music/song3.mp3",
        cover: "images/cover3.jpg"
    }
];

let currentSong = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;

function loadSong(index) {
    currentSong = index;

    const song = songs[currentSong];

    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    cover.src = song.cover;

    audio.src = song.src;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    renderPlaylist();

    if (isPlaying) {
        audio.play().catch(() => {});
    }
}

function playSong() {
    if (!audio.src) {
        loadSong(currentSong);
    }

    audio.play();

    isPlaying = true;

    playButton.textContent = "Ⅱ";

    visualizer.classList.add("active");
}

function pauseSong() {
    audio.pause();

    isPlaying = false;

    playButton.textContent = "▶";

    visualizer.classList.remove("active");
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function nextSong() {
    if (shuffle) {
        let next;

        do {
            next = Math.floor(Math.random() * songs.length);
        } while (next === currentSong && songs.length > 1);

        currentSong = next;
    } else {
        currentSong++;

        if (currentSong >= songs.length) {
            currentSong = 0;
        }
    }

    loadSong(currentSong);
    playSong();
}

function previousSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
    playSong();
}

function formatTime(time) {
    if (isNaN(time)) {
        return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updateProgress() {
    if (!audio.duration) {
        return;
    }

    const percent =
        (audio.currentTime / audio.duration) * 100;

    progress.value = percent;

    currentTime.textContent =
        formatTime(audio.currentTime);
}

function setProgress() {
    if (!audio.duration) {
        return;
    }

    audio.currentTime =
        (progress.value / 100) * audio.duration;
}

function setVolume() {
    audio.volume = volume.value;

    volumeValue.textContent =
        Math.round(volume.value * 100) + "%";
}

function toggleShuffle() {
    shuffle = !shuffle;

    shuffleButton.classList.toggle(
        "active",
        shuffle
    );
}

function toggleRepeat() {
    repeat = !repeat;

    repeatButton.classList.toggle(
        "active",
        repeat
    );
}

function renderPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {

        const track = document.createElement("div");

        track.className =
            "track" +
            (index === currentSong ? " active" : "");

        track.innerHTML = `
            <div class="track-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <img
                class="track-cover"
                src="${song.cover}"
                alt="${song.title}"
            >

            <div class="track-details">
                <strong>${song.title}</strong>
                <span>${song.artist}</span>
            </div>

            <div class="track-duration">
                ${index === currentSong && !isNaN(audio.duration)
                    ? formatTime(audio.duration)
                    : "—"}
            </div>

            <div class="track-status">
                ${index === currentSong && isPlaying ? "●" : ""}
            </div>
        `;

        track.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlist.appendChild(track);
    });
}

playButton.addEventListener("click", togglePlay);

nextButton.addEventListener("click", nextSong);

previousButton.addEventListener("click", previousSong);

shuffleButton.addEventListener("click", toggleShuffle);

repeatButton.addEventListener("click", toggleRepeat);

progress.addEventListener("input", setProgress);

volume.addEventListener("input", setVolume);

audio.addEventListener("timeupdate", updateProgress);

audio.addEventListener("loadedmetadata", () => {
    duration.textContent =
        formatTime(audio.duration);

    renderPlaylist();
});

audio.addEventListener("play", () => {
    isPlaying = true;
    playButton.textContent = "Ⅱ";
    visualizer.classList.add("active");
    renderPlaylist();
});

audio.addEventListener("pause", () => {
    isPlaying = false;
    playButton.textContent = "▶";
    visualizer.classList.remove("active");
    renderPlaylist();
});

audio.addEventListener("ended", () => {
    if (repeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

document.addEventListener("keydown", event => {

    if (event.target.tagName === "INPUT") {
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
    }

    if (event.key === "ArrowRight") {
        nextSong();
    }

    if (event.key === "ArrowLeft") {
        previousSong();
    }

    if (event.key === "ArrowUp") {
        event.preventDefault();

        volume.value =
            Math.min(1, Number(volume.value) + 0.05);

        setVolume();
    }

    if (event.key === "ArrowDown") {
        event.preventDefault();

        volume.value =
            Math.max(0, Number(volume.value) - 0.05);

        setVolume();
    }

    if (event.key.toLowerCase() === "m") {
        audio.muted = !audio.muted;
    }
});

audio.volume = 0.8;

loadSong(0);
renderPlaylist();