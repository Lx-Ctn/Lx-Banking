import MobileNav from "@/components/MobileNav";
import SideBar from "@/components/SideBar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const loggegInUser = await getLoggedInUser();
	if (!loggegInUser) redirect("/sign-in");

	return (
		<main className="flex h-screen w-full font-inter">
			<SideBar user={loggegInUser} />

			<div className="flex size-full flex-col">
				<div className="root-layout">
					<Image src="/icons/logo.svg" width={30} height={30} alt="Logo" />
					<div>
						<MobileNav user={loggegInUser} />
					</div>
				</div>
				{children}
			</div>
		</main>
	);
}
