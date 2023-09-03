let isAdminLoggedIn = false;

// Funkcja do autoryzacji administratora
function authenticateAdmin() {
	const adminPassword = document.getElementById("adminPassword").value;

	// Sprawdź hasło administratora (zmień na bardziej bezpieczne)
	if (adminPassword === "admin123") {
		isAdminLoggedIn = true;
		document.getElementById("videoLink").removeAttribute("disabled");
		document.getElementById("addVideoButton").removeAttribute("disabled");
		document.getElementById("adminPanel").style.display = "none";
		refreshVideoList();
	} else {
		alert("Błędne hasło administratora");
	}
}

// Funkcja do dodawania filmu
function addVideo() {
	if (!isAdminLoggedIn) {
		alert("Musisz być zalogowany jako administrator, aby dodać film.");
		return;
	}

	const videoLink = document.getElementById("videoLink").value;
	const videoId = extractVideoId(videoLink);

	if (videoId) {
		// Zapisz film w localStorage
		const videoList = JSON.parse(localStorage.getItem("videos")) || [];
		videoList.push({ videoId, videoLink });
		localStorage.setItem("videos", JSON.stringify(videoList));

		// Odśwież listę filmów na stronie
		refreshVideoList();

		document.getElementById("videoLink").value = "";
	} else {
		alert("Nieprawidłowy link do filmu YouTube");
	}
}

// Funkcja do ekstrakcji ID filmu z linku YouTube
function extractVideoId(url) {
	const videoIdMatch = url.match(
		/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=))([^&?]+)/
	);
	return videoIdMatch ? videoIdMatch[1] : null;
}

// Funkcja do usuwania filmu
function deleteVideo(videoIndex) {
	if (!isAdminLoggedIn) {
		alert("Musisz być zalogowany jako administrator, aby usunąć film.");
		return;
	}

	const videoList = JSON.parse(localStorage.getItem("videos")) || [];
	videoList.splice(videoIndex, 1);
	localStorage.setItem("videos", JSON.stringify(videoList));

	// Odśwież listę filmów na stronie
	refreshVideoList();
}

// Funkcja do odświeżania listy filmów
function refreshVideoList() {
	const videoList = document.getElementById("videoList");
	videoList.innerHTML = "";

	// Pobierz filmy z localStorage i wyświetl je na stronie
	const storedVideos = JSON.parse(localStorage.getItem("videos")) || [];
	storedVideos.forEach((video, index) => {
		const { videoId, videoLink } = video;
		const videoContainer = document.createElement("div");
		videoContainer.classList.add("videoContainer");
		const videoThumbnail = document.createElement("img");
		videoThumbnail.classList.add("videoThumbnail");
		videoThumbnail.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
		const videoLinkElement = document.createElement("a");
		videoLinkElement.href = videoLink;
		videoLinkElement.target = "_blank";
		videoLinkElement.textContent = `Obejrzyj na YouTube`;
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Usuń";
		deleteButton.onclick = () => deleteVideo(index);

		videoContainer.appendChild(videoThumbnail);
		videoContainer.appendChild(videoLinkElement);
		videoContainer.appendChild(deleteButton);
		videoList.appendChild(videoContainer);
	});
}

// Wywołaj funkcję odświeżania listy filmów przy ładowaniu strony
window.onload = function () {
	refreshVideoList();
};
