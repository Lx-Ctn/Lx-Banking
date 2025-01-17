import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";

const RecentTransactions = ({
	accounts,
	transactions = [],
	appwriteItemId,
	page = 1,
}: RecentTransactionsProps) => {
	const ROWS_PER_PAGE = 10;
	const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);
	const indexOfLastTransaction = page * ROWS_PER_PAGE;
	const indexOfFirstTransaction = indexOfLastTransaction - ROWS_PER_PAGE;
	const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

	return (
		<section className="recent-transactions">
			<header className="flex items-center justify-between">
				<h2 className="recent-transactions-label">Recent transations</h2>
				<Link href={`/transactions-history/?id=${appwriteItemId}`} className="view-all-btn">
					View all
				</Link>
			</header>
			<Tabs defaultValue={appwriteItemId} className="w-full">
				<TabsList className="recent-transactions-tablist">
					{accounts?.map(account => (
						<TabsTrigger key={account.id} value={account.appwriteItemId}>
							<BankTabItem key={account.id} account={account} appwriteItemId={appwriteItemId} />
						</TabsTrigger>
					))}
				</TabsList>
				{accounts?.map(account => (
					<TabsContent key={account.id} value={account.appwriteItemId} className="space-y-4">
						<BankInfo account={account} appwriteItemId={appwriteItemId} type="full" />
						<TransactionsTable transactions={currentTransactions} />
						<Pagination page={page} totalPages={totalPages} />
					</TabsContent>
				))}
			</Tabs>
		</section>
	);
};

export default RecentTransactions;
