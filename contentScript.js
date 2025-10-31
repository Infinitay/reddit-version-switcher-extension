(function () {
	const isOldReddit = location.hostname === "old.reddit.com";
	const isNewReddit = location.hostname === "sh.reddit.com" || location.hostname === "www.reddit.com";

	function switchToNewReddit() {
		const newUrl = location.href.replace("old.reddit.com", "sh.reddit.com");
		window.location.href = newUrl;
	}

	function createSeparator() {
		const span = document.createElement("span");
		span.className = "separator";
		span.textContent = "|";
		return span;
	}

	if (isOldReddit) {
		// Insert button before logout in #header-bottom-right
		const header = document.getElementById("header-bottom-right");
		if (header) {
			const logoutForm = header.querySelector("form.logout");
			const btn = document.createElement("button");
			btn.textContent = "Switch to New Reddit";
			btn.style.marginRight = "8px";
			btn.style.padding = "2px 8px";
			btn.style.cursor = "pointer";
			btn.onclick = switchToNewReddit;
			if (logoutForm) {
				logoutForm.parentNode.insertBefore(btn, logoutForm);
				logoutForm.parentNode.insertBefore(createSeparator(), logoutForm);
			} else {
				header.appendChild(btn);
			}
		}
	}
})();
