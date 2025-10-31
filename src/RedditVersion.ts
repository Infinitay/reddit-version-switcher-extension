export enum RedditVersion {
	OLD = "old",
	NEW = "new",
	BASE = ""
}

export enum RedditDomains {
	OLD = "old.reddit.com",
	NEW = "sh.reddit.com",
	BASE = "www.reddit.com"
}

export enum RedditSubdomains {
	OLD = "old",
	NEW = "sh",
	BASE = "www"
}

export function detectRedditVersion(hostname: string): RedditVersion {
	if (hostname === RedditDomains.OLD) {
		return RedditVersion.OLD;
	} else if (hostname === RedditDomains.NEW) {
		return RedditVersion.NEW;
	} else {
		return RedditVersion.BASE;
	}
}
