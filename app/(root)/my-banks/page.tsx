import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const MyBanks = async () => {
	const loggegInUser = await getLoggedInUser();
	if (!loggegInUser) redirect("/sign-in");

	const accounts = await getAccounts({ userId: loggegInUser.$id });
	if (!accounts) return;

	return (
		<section className="flex">
			<div className="my-banks">
				<HeaderBox
					type="title"
					title="My Bank accounts"
					subtext="Effortlessly manage your banking activities."
				/>

				<div className="space-y-4">
					<h2 className="header-2">My cards</h2>
					<div className="flex flex-wrap gap-6">
						{accounts &&
							accounts.data.map((account: Account) => (
								<BankCard
									key={account.id}
									account={account}
									userName={loggegInUser.firstName}
									showBalance={true}
								/>
							))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default MyBanks;
