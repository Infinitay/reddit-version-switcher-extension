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
			const switchLink = document.createElement("a");
			switchLink.className = "pref-lang";
			switchLink.textContent = "switch to new reddit";
			switchLink.style.cursor = "pointer";
			switchLink.onclick = switchToNewReddit;
			if (logoutForm) {
				logoutForm.parentNode.insertBefore(switchLink, logoutForm);
				logoutForm.parentNode.insertBefore(createSeparator(), logoutForm);
			} else {
				header.appendChild(switchLink);
			}
		}
	}
})();
