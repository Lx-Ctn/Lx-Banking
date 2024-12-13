import React from "react";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSideBar from "@/components/RightSideBar";

const Home = () => {
	const loggedIn = { firstName: "Lex", lastName: "CTN", email: "design@lxctn.com" };
	return (
		<section className="home">
			<div className="home-content">
				<header className="home-header">
					<HeaderBox
						type="greeting"
						title="Welcome"
						user={loggedIn?.firstName || "Guest"}
						subtext="Access and manage your account and transactions efficiently."
					/>
					<TotalBalanceBox accounts={[]} totalBanks={1} totalCurrentBalance={1250.35} />
				</header>
				RECENT TRANSACTIONS
			</div>
			<RightSideBar
				user={loggedIn}
				transactions={[]}
				banks={[{ currentBalance: 1435.45 }, { currentBalance: 1435.45 }]}
			/>
		</section>
	);
};

export default Home;
