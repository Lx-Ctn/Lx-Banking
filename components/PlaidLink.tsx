import { useCallback, useEffect, useState } from "react";
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions";

const PlaidLink = ({ user, variant /* dwollaCustomerId */ }: PlaidLinkProps) => {
	const router = useRouter();
	const [token, setToken] = useState("");

	useEffect(() => {
		const getLinkToken = async () => {
			const data = await createLinkToken(user);
			setToken(data?.linkToken);
		};

		getLinkToken();
	}, [user]);

	const onSuccess = useCallback<PlaidLinkOnSuccess>(
		async (public_token: string) => {
			await exchangePublicToken({ publicToken: public_token, user });
			router.push("/");
		},
		[user, router]
	);

	const config: PlaidLinkOptions = {
		token,
		onSuccess,
	};

	const { open, ready } = usePlaidLink(config);

	return (
		<>
			{variant === "primary" ? (
				<Button className="plaidlink-primary" onClick={() => open()} disabled={!ready}>
					Connect bank
				</Button>
			) : variant === "ghost" ? (
				<Button className="plaidlink-ghost">Connect bank</Button>
			) : (
				<Button>Connect bank</Button>
			)}
		</>
	);
};

export default PlaidLink;
