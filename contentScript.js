(function () {
	const isOldReddit = location.hostname === "old.reddit.com";
	const isNewReddit = location.hostname === "sh.reddit.com" || location.hostname === "www.reddit.com";

	function switchToNewReddit() {
		const newUrl = location.href.replace("old.reddit.com", "sh.reddit.com");
		window.location.href = newUrl;
	}

	if (isOldReddit) {
		// Insert button before logout in #header-bottom-right
		const header = document.getElementById("header-bottom-right");
		if (header) {
			const logoutLink = Array.from(header.querySelectorAll("a")).find((a) => a.textContent.trim().toLowerCase() === "logout");
			const btn = document.createElement("button");
			btn.textContent = "Switch to New Reddit";
			btn.style.marginRight = "8px";
			btn.style.padding = "2px 8px";
			btn.style.cursor = "pointer";
			btn.onclick = switchToNewReddit;
			if (logoutLink) {
				logoutLink.parentNode.insertBefore(btn, logoutLink);
			} else {
				header.appendChild(btn);
			}
		}
	}
})();
