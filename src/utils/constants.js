export const JWT_SIGN_KEY = "scannus"

export const TIERS = [
	{
		name: 'No Tier',
		tokenReq: 0,
		discount: 0,
	},
	{
		name: 'Bronze',
		tokenReq: 5,
		discount: 0.1,
	},
	{
		name: 'Silver',
		tokenReq: 10,
		discount: 0.2,
	},
	{
		name: 'Gold',
		tokenReq: 15,
		discount: 0.3,
	},
]