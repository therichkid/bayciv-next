export const generateHash = (text: string): number => {
	let hash = 0;
	for (const char of text) {
		hash = (hash << 5) - hash + char.charCodeAt(0);
		hash |= 0;
	}
	return hash;
};

export const decrypt = (text: string): string => {
	const unshifted = unshift(text);
	const decrypted = atob(unshifted);

	return decrypted;
};

const SHIFT_CHARS_BY = 10;

const unshift = (text: string): string => {
	return rotate(text, -SHIFT_CHARS_BY);
};

const rotate = (text: string, shiftBy: number): string => {
	const output = [];
	for (const letter of text) {
		let code = letter.charCodeAt(0);
		if (code >= 65 && code <= 90) {
			code += shiftBy;
			if (code < 65) {
				code += 26;
			} else if (code > 90) {
				code -= 26;
			}
		} else if (code >= 97 && code <= 122) {
			code += shiftBy;
			if (code < 97) {
				code += 26;
			} else if (code > 122) {
				code -= 26;
			}
		}
		output.push(String.fromCharCode(code));
	}
	return output.join('');
};
