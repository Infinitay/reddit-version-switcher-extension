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
			const notificationsElement = header.querySelector("#notifications");
			const svgUrl = chrome.runtime.getURL("assets/version-history-svgrepo-com.svg");
			const switchVersionIMG = document.createElement("img");
			switchVersionIMG.src = svgUrl;
			switchVersionIMG.alt = "Switch to new reddit";
			switchVersionIMG.style.height = `${18 * ((notificationsElement?.clientHeight ?? 12) / 12)}px`;
			switchVersionIMG.style.width = `${18 * ((notificationsElement?.clientWidth ?? 12) / 12)}px`;
			// switchVersionIMG.style.mixBlendMode = "difference";
			// switchVersionIMG.style.filter = "invert(100%) sepia(0%) saturate(2%) hue-rotate(231deg) brightness(110%) contrast(101%)";
			switchVersionIMG.style.verticalAlign = "middle";
			switchVersionIMG.onclick = () => switchRedditVersions(RedditVersion.NEW);
			switchVersionIMG.style.cursor = "pointer";

			// Dynamically set filter based on background color
			const headerBg = window.getComputedStyle(header).backgroundColor;
			function getLuminance(rgb: string): number {
				let m = rgb.match(/rgba?\((\d+), (\d+), (\d+)/);
				if (!m) return 255; // fallback to light
				if (rgb === "rgba(0, 0, 0, 0)") {
					// Transparent background so lets pull the parent background
					const srHeaderArea = document.getElementById("sr-header-area");
					if (srHeaderArea) {
						const parentBg = window.getComputedStyle(srHeaderArea).backgroundColor;
						m = parentBg.match(/rgba?\((\d+), (\d+), (\d+)(, ([\d.]+%?))?\)/);
						if (!m) return 255;
						if (parseFloat(m[5]) <= 0.3) {
							// 5th capture group is alpha, 4th includes comma
							const headerArea = document.getElementById("header");
							if (headerArea) {
								const headerAreaBg = window.getComputedStyle(headerArea).backgroundColor;
								m = headerAreaBg.match(/rgba?\((\d+), (\d+), (\d+)(, ([\d.]+%?))?\)/);
								if (!m) return 255;
								if (parseFloat(m[5]) <= 0.3) {
									return 255; // still transparent, fallback to light
								}
							}
						}
					}
				}
				const r = parseInt(m[1]),
					g = parseInt(m[2]),
					b = parseInt(m[3]);
				return 0.2126 * r + 0.7152 * g + 0.0722 * b;
			}
			const luminance = getLuminance(headerBg);
			if (luminance < 128) {
				// dark background, make icon light
				switchVersionIMG.style.filter = "invert(1) brightness(2)";
			} else {
				// light background, use default
				switchVersionIMG.style.filter = "none";
			}

			if (logoutForm && logoutForm.parentNode) {
				logoutForm.parentNode.insertBefore(switchVersionIMG, logoutForm);
				logoutForm.parentNode.insertBefore(createSeparator(), logoutForm);
			} else {
				header.appendChild(switchVersionIMG);
				header.appendChild(createSeparator());
			}
		}
	}
})();
