import type { ACF_Address } from '$lib/models/acf';

export const getAddressString = (
	address?: ACF_Address | false | null | undefined,
	addressName?: string | undefined,
): string => {
	const addressString = [addressName, address ? address.address : undefined].filter(Boolean).join(', ');
	const addressParts = addressString.split(', ');

	if (addressParts.includes('Deutschland')) {
		addressParts.splice(addressParts.indexOf('Deutschland'), 1);
	}

	return addressParts.join(', ');
};
