import { BankTabItem } from "@/components/BankTabItem";
import HeaderBox from "@/components/HeaderBox";
import { Pagination } from "@/components/Pagination";
import TransactionsTable from "@/components/TransactionsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const TransactionsHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
	const loggegInUser = await getLoggedInUser();
	if (!loggegInUser) redirect("/sign-in");

	const { data: accounts } = await getAccounts({ userId: loggegInUser.$id });
	if (!accounts) return;

	const appwriteItemId = (id as string) || accounts[0]?.appwriteItemId;
	const account = await getAccount({ appwriteItemId });

	const ROWS_PER_PAGE = 12;
	const currentPage = Number(page) || 1;
	const totalPages = Math.ceil(account?.transactions.length / ROWS_PER_PAGE);
	const indexOfLastTransaction = currentPage * ROWS_PER_PAGE;
	const indexOfFirstTransaction = indexOfLastTransaction - ROWS_PER_PAGE;
	const currentTransactions = account?.transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

	return (
		<div className="transactions">
			<div className="transcations-header">
				<HeaderBox
					type="title"
					title="Transactions History"
					user=""
					subtext="See your bank details and transactions."
				/>
			</div>
			<div className="space-y-6">
				<section className="flex w-full flex-col gap-6">
					<Tabs defaultValue={appwriteItemId} className="w-full">
						<TabsList className="recent-transactions-tablist">
							{accounts?.map((account: Account) => (
								<TabsTrigger key={account.id} value={account.appwriteItemId}>
									<BankTabItem key={account.id} account={account} appwriteItemId={appwriteItemId} />
								</TabsTrigger>
							))}
						</TabsList>

						{accounts?.map((account: Account) => (
							<TabsContent key={account.id} value={account.appwriteItemId} className="space-y-4">
								<AccountInfo account={account} />
								<TransactionsTable transactions={currentTransactions} />
								<Pagination page={currentPage} totalPages={totalPages} />
							</TabsContent>
						))}
					</Tabs>
				</section>
			</div>
		</div>
	);
};

export default TransactionsHistory;

function AccountInfo({ account }: { account: Account }) {
	return (
		<div className="transactions-account">
			<div className="flex items-center gap-4">
				<figure className={`flex-center h-fit rounded-full border-white border`}>
					<Image
						src="/icons/connect-bank.svg"
						width={20}
						height={20}
						alt={account.subtype}
						className="m-2 min-w-5 brightness-0	invert"
					/>
				</figure>
				<div className="flex flex-col gap-2">
					<h2 className="text-18 font-bold text-white">{account.name}</h2>
					<p className="text-14 text-blue-25">{account.officialName}</p>
					<p className="text-14 font-semibold tracking-[1.1px] text-white">
						●●●● ●●●● ●●●● <span className="text-16">{account.mask}</span>
					</p>
				</div>
			</div>
			<div className="transactions-account-balance">
				<p className="text-14">Current balance</p>
				<p className="text-24 text-center font-bold">{formatAmount(account.currentBalance)}</p>
			</div>
		</div>
	);
}
