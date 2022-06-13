import { createApplication } from "graphql-modules";
import AdminModule from './types/Admin.js'
import CustomerModule from "./types/Customer.js";
import HTTPResponseModule from "./types/HTTPResponse.js";
import MerchantModule from "./types/Merchant.js";
import TokenModule from "./types/Token.js";
import RedemptionModule from "./types/Redemption.js";
import TierModule from "./types/Tier.js";
import UserModule from "./types/User.js";

export const apolloApplication = createApplication({
	modules: [
		HTTPResponseModule,
		UserModule,
		AdminModule,
		CustomerModule,
		MerchantModule,
		TokenModule,
		RedemptionModule,
		TierModule
	]
})