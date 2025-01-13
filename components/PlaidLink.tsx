import { useCallback, useEffect, useState } from "react";
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions";
import Image from "next/image";

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
				<Button onClick={() => open()} className="plaidlink-ghost">
					Connect bank
				</Button>
			) : (
				<Button
					onClick={() => open()}
					className="plaidLink-default bg-blue-500 mt-5 mb-3 rounded-full pt-3 pb-3 h-[inherit]"
				>
					<Image
						className="brightness-[3] invert-0"
						src={"/icons/connect-bank.svg"}
						width={24}
						height={24}
						alt="Connect bank"
					/>
					<p className="text-[16px] font-semibold text-white m-auto">Connect bank</p>
				</Button>
			)}
		</>
	);
};

export default PlaidLink;
