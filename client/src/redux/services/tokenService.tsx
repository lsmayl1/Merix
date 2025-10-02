
export const setCookie = (name: string, value: string, days: number): void => {
	const expires = new Date(Date.now() + days * 864e5).toUTCString();
	document.cookie =
		name +
		"=" +
		encodeURIComponent(value) +
		"; expires=" +
		expires +
		"; path=/";
};

export const getCookie = (name: string): string => {
	return document.cookie.split("; ").reduce((r, v) => {
		const parts = v.split("=");
		return parts[0] === name ? decodeURIComponent(parts[1]) : r;
	}, "");
};

export const deleteCookie = (name: string): void => {
	setCookie(name, "", -1);
};

export const saveToken = (token: string): void => {
	setCookie("token", token, 7); // Save token for 7 days
};
