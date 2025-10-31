import { detectRedditVersion, RedditDomains, RedditVersion } from "./RedditVersion";

(async () => {
	function switchRedditVersions(switchToVersion: RedditVersion) {
		const currentRedditDomain = window.location.hostname;
		const switchToDomain = switchToVersion === RedditVersion.OLD ? RedditDomains.OLD : RedditDomains.NEW;
		window.location.href = window.location.href.replace(currentRedditDomain, switchToDomain);
	}

	function createSeparator() {
		const span = document.createElement("span");
		span.className = "separator";
		span.textContent = "|";
		return span;
	}

	/**
	 * Checks if the user has opted out of the Reddit redesign by looking for the "redesign_optout" cookie.
	 * If the cookie exists and is set to "true", the user has opted out.
	 * If the cookie does not exist or is set to any other value, the user has not opted out.
	 * @returns {Promise<boolean>} True if the user has opted out of the redesign, false otherwise.
	 */
	async function didOptOutOfRedesign() {
		const redesignCookieValue = document.cookie.split("; ").find((row) => row.startsWith("redesign_optout="));
		return redesignCookieValue === "true";
	}

	async function getRedditVersion() {
		const redditVersionFromURL = detectRedditVersion(window.location.hostname);
		if (redditVersionFromURL === RedditVersion.BASE) {
			// URL is www.reddit.com so we should check for the redesign cookie
			// Redesign cookie only exists if the user opted out of the redesign and it'll be set to true
			const enabledRedesign = await didOptOutOfRedesign();
			return enabledRedesign ? RedditVersion.NEW : RedditVersion.OLD;
		} else if (redditVersionFromURL === RedditVersion.OLD) {
			return RedditVersion.OLD;
		} else {
			return RedditVersion.NEW;
		}
	}

	const currentRedditVersion = await getRedditVersion();
	if (currentRedditVersion == RedditVersion.OLD) {
		// Insert button before logout in #header-bottom-right
		const header = document.getElementById("header-bottom-right");
		if (header) {
			const logoutForm = header.querySelector("form.logout");
			const switchLink = document.createElement("a");
			switchLink.className = "pref-lang";
			switchLink.textContent = "switch to new reddit";
			switchLink.style.cursor = "pointer";
			switchLink.onclick = () => switchRedditVersions(RedditVersion.NEW);
			if (logoutForm && logoutForm.parentNode) {
				logoutForm.parentNode.insertBefore(switchLink, logoutForm);
				logoutForm.parentNode.insertBefore(createSeparator(), logoutForm);
			} else {
				header.appendChild(switchLink);
			}
		}
	}
})();
