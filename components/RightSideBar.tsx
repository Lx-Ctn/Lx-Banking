import Image from "next/image";
import Link from "next/link";
import React from "react";
import BankCard from "./BankCard";

const RightSideBar = ({ user, transactions, banks }: RightSidebarProps) => {
	const userName = `${user.firstName} ${user.lastName}`;

	return (
		<aside className="right-sidebar">
			<section className="flex flex-col pb-8">
				<div className="profile-banner" />
				<div className="profile">
					<div className="profile-img">
						<span className="text-5xl font-bold text-blue-500">{userName[0]}</span>
					</div>

					<div className="profile-details">
						<h1 className="profile-name">{userName}</h1>
						<p className="profile-email">{user.email}</p>
					</div>
				</div>
			</section>

			<section className="banks">
				<div className="flex w-full justify-between">
					<h2 className="header-2">My banks</h2>
					<Link href="/my-banks" className="flex gap-2">
						<Image src="/icons/plus.svg" width={20} height={20} alt="Add new bank" />
						<h3 className="text-14 font-semibold text-gray-600">Add bank</h3>
					</Link>
				</div>
				{banks?.length > 0 && (
					<div className="relative flex flex-1 flex-col items-center justify-center gap-5">
						<div className="relative z-10">
							<BankCard key={banks[0].$id} account={banks[0]} userName={userName} showBalance={false} />
						</div>
						{banks[1] && (
							<div className="absolute right-0 top-8 z-0 w-[90%]">
								<BankCard key={banks[1].$id} account={banks[1]} userName={userName} showBalance={false} />
							</div>
						)}
					</div>
				)}
			</section>

			<section className="transactions">
				<div className="flex w-full justify-between">
					<h2 className="header-2">My transactions</h2>
					<Link href="/transactions-history" className="flex gap-2">
						<Image src="/icons/plus.svg" width={20} height={20} alt="Add new bank" />
						<h3 className="text-14 font-semibold text-gray-600">See more</h3>
					</Link>
				</div>
				{transactions?.length > 0 && (
					<div className="relative flex flex-1 flex-col items-center justify-center gap-5"></div>
				)}
			</section>
		</aside>
	);
};

export default RightSideBar;
