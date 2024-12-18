import React from "react";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSideBar from "@/components/RightSideBar";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async () => {
	const loggegInUser = await getLoggedInUser();
	if (!loggegInUser) redirect("/sign-in");

	return (
		<section className="home">
			<div className="home-content">
				<header className="home-header">
					<HeaderBox
						type="greeting"
						title="Welcome"
						user={loggegInUser?.name || "Guest"}
						subtext="Access and manage your account and transactions efficiently."
					/>
					<TotalBalanceBox accounts={[]} totalBanks={1} totalCurrentBalance={1250.35} />
				</header>
				RECENT TRANSACTIONS
			</div>
			<RightSideBar
				user={loggegInUser}
				transactions={[]}
				banks={[{ currentBalance: 1435.45 }, { currentBalance: 1435.45 }]}
			/>
		</section>
	);
};

export default Home;
