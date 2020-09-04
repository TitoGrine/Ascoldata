const charities = [
	'https://www.unbound.org/DonationFunds/General',
	'https://give.bcrf.org/give/31404/#!/donation/checkout',
	'https://awionline.org/content/make-donation-awi',
	'https://donate.rainn.org/donate',
	'https://www.againstmalaria.com/Donation.aspx',
	'https://helenkellerfoundation.org/donate-now/',
	'https://donate.givedirectly.org',
	'https://www.unicef.org',
	'https://act.nrdc.org/donate/monthly/',
	'https://unfoundation.org/',
	'https://secure.directrelief.org/site/Donation2',
	'https://support.savethechildren.org/site/Donation2',
	'https://help.rescue.org/donate',
	'https://secure.pih.org/a/donate',
	'https://donate.doctorswithoutborders.org/monthly.cfm'
];

export const getRandomCharity = () => {
	return charities[Math.floor(Math.random() * charities.length)];
};
