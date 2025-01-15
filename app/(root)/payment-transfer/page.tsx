import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";

const PaymentTransfer = async () => {
	const loggegInUser = await getLoggedInUser();
	if (!loggegInUser) redirect("/sign-in");

	const accounts = await getAccounts({ userId: loggegInUser.$id });
	if (!accounts) return;

	return (
		<section className="payment-transfer">
			<HeaderBox
				title="Payment Transfer"
				subtext="Please provide any specific details or notes related to the payment transfer"
			/>
			<section className="size-full max-w-[850px] pt-5">
				<PaymentTransferForm accounts={accounts.data} />
			</section>
		</section>
	);
};

export default PaymentTransfer;
