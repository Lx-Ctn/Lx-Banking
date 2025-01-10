import React from "react";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSideBar from "@/components/RightSideBar";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import RecentTransactions from "@/components/RecentTransactions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
	const currentPage = Number(page) || 1;
	const loggegInUser = await getLoggedInUser();
	if (!loggegInUser) redirect("/sign-in");

	const accounts = await getAccounts({ userId: loggegInUser.$id });
	if (!accounts) return;

	const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId;
	const account = await getAccount({ appwriteItemId });

	return (
		<section className="home">
			<div className="home-content">
				<header className="home-header">
					<HeaderBox
						type="greeting"
						title="Welcome"
						user={loggegInUser?.firstName || "Guest"}
						subtext="Access and manage your account and transactions efficiently."
					/>
					<TotalBalanceBox
						accounts={accounts?.data}
						totalBanks={accounts?.totalBanks}
						totalCurrentBalance={accounts?.totalCurrentBalance}
					/>
				</header>
				<RecentTransactions
					accounts={accounts?.data}
					transactions={account?.transactions}
					appwriteItemId={appwriteItemId}
					page={currentPage}
				/>
			</div>
			<RightSideBar
				user={loggegInUser}
				transactions={account?.transactions}
				banks={accounts?.data.slice(0, 2)}
			/>
		</section>
	);
};

export default Home;
