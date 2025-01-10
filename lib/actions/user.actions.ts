"use server";

import { createAdminClient, createSessionClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
	CountryCode,
	ProcessorTokenCreateRequest,
	ProcessorTokenCreateRequestProcessorEnum,
	Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

/** Get user from database (not from session) */
export const getUserInfo = async ({ userId }: getUserInfoProps) => {
	try {
		const { database } = await createAdminClient();
		const users = await database.listDocuments(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_USER_COLLECTION_ID!,
			[Query.equal("userId", [userId])]
		);
		return parseStringify(users.documents[0]);
	} catch (error) {
		console.error("An error occurred while getting the user:", error);
	}
};

/** Log in account with AppWrite */
export const signIn = async ({ email, password }: signInProps) => {
	try {
		const { account } = await createAdminClient();
		const session = await account.createEmailPasswordSession(email, password);
		cookies().set("appwrite-session", session.secret, {
			path: "/",
			httpOnly: true,
			sameSite: "strict",
			secure: true,
		});

		const user = await getUserInfo({ userId: session.userId });
		return parseStringify(user);
	} catch (error) {
		console.log(error);
	}
};

/** Create a new account with AppWrite and log in */
export const signUp = async ({ password, ...userData }: SignUpParams) => {
	let newUserAccount;

	try {
		const { email, firstName, lastName } = userData;
		const { account, database } = await createAdminClient();

		newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
		if (!newUserAccount) throw new Error("Error creating user");

		const dwollaCustomerUrl = await createDwollaCustomer({
			...userData,
			type: "personal",
		});
		if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");
		const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

		const newUser = await database.createDocument(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_USER_COLLECTION_ID!,
			ID.unique(),
			{
				...userData,
				userId: newUserAccount.$id,
				dwollaCustomerId,
				dwollaCustomerUrl,
			}
		);

		const session = await account.createEmailPasswordSession(email, password);

		cookies().set("appwrite-session", session.secret, {
			path: "/",
			httpOnly: true,
			sameSite: "strict",
			secure: true,
		});

		return parseStringify(newUser);
	} catch (error) {
		console.log(error);
	}
};

/** Get account data if session is open (AppWrite) */
export const getLoggedInUser = async () => {
	try {
		const { account } = await createSessionClient();
		const session = await account.get();
		const user = await getUserInfo({ userId: session.$id });

		return parseStringify(user);
	} catch (error) {
		console.log(error);
		return null;
	}
};

/** Log out : Delete cookies & AppWrite session */
export const logoutAccount = async () => {
	try {
		const { account } = await createSessionClient();
		cookies().delete("appwrite-session");
		await account.deleteSession("current");
	} catch (error) {
		console.log(error);
		return null;
	}
};

/** Get Plaid link_token et open communications with banks */
export const createLinkToken = async (user: User) => {
	try {
		const tokenParams = {
			user: {
				client_user_id: user.$id,
			},
			client_name: `${user.firstName} ${user.lastName}`,
			products: ["auth"] as Products[],
			language: "en",
			country_codes: ["FR", "US"] as CountryCode[],
		};
		const response = await plaidClient.linkTokenCreate(tokenParams);
		return parseStringify({ linkToken: response.data.link_token });
	} catch (error) {
		console.log(error);
	}
};

/** Save user bank account and access on AppWrite database */
export const createBankAccount = async ({
	userId,
	bankId,
	accountId,
	accessToken,
	fundingSourceUrl,
	shareableId,
}: createBankAccountProps) => {
	try {
		const { database } = await createAdminClient();

		const bankAccount = await database.createDocument(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_BANK_COLLECTION_ID!,
			ID.unique(),
			{
				userId,
				bankId,
				accountId,
				accessToken,
				fundingSourceUrl,
				shareableId,
			}
		);
		return parseStringify(bankAccount);
	} catch (error) {
		console.log(error);
	}
};

/** Get permanent Plaid link token to access the bank account, get Dwolla access, + save the bank account */
export const exchangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
	// Plaid : securely exchange informations
	// Dwolla : securely exchange founds
	try {
		// Exchange the temporary public_token for a permanent access_token and item ID
		const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
		const { access_token, item_id: itemId } = response.data;

		// Get account information from Plaid using the access token
		const accountResponse = await plaidClient.accountsGet({ access_token });
		const accountData = accountResponse.data.accounts[0];

		// Create a processor token for Dwolla
		const request: ProcessorTokenCreateRequest = {
			access_token,
			account_id: accountData.account_id,
			processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
		};
		const processorTokenResponse = await plaidClient.processorTokenCreate(request);
		const processorToken = processorTokenResponse.data.processor_token;

		const fundingSourceUrl = await addFundingSource({
			dwollaCustomerId: user.dwollaCustomerId,
			processorToken,
			bankName: accountData.name,
		});

		if (!fundingSourceUrl) throw Error;

		await createBankAccount({
			userId: user.$id,
			bankId: itemId,
			accountId: accountData.account_id,
			accessToken: access_token,
			fundingSourceUrl,
			shareableId: encryptId(accountData.account_id),
		});

		// Revalidate the path to reflect the changes with access the the bank account
		revalidatePath("/");

		return parseStringify({ publicTokenExchange: "complete" });
	} catch (error) {
		console.error("An error occurred while creating exchanging token : ", error);
	}
};

/** Get a array of banks for a specific user from plaid database */
export const getBanks = async ({ userId }: getBanksProps) => {
	try {
		const { database } = await createAdminClient();
		const banks = await database.listDocuments(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_BANK_COLLECTION_ID!,
			[Query.equal("userId", [userId])]
		);
		return parseStringify(banks.documents);
	} catch (error) {
		console.error("An error occurred while getting the banks:", error);
	}
};

/** Get a specific bank from plaid database */
export const getBank = async ({ documentId }: getBankProps) => {
	try {
		const { database } = await createAdminClient();
		const banks = await database.listDocuments(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_BANK_COLLECTION_ID!,
			[Query.equal("$id", [documentId])]
		);
		return parseStringify(banks.documents[0]);
	} catch (error) {
		console.error("An error occurred while getting the bank:", error);
	}
};
