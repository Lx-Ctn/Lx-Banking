"use client";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = ({ user }: MobileNavProps) => {
	const pathName = usePathname();

	return (
		<section className="w-full max-w-[264px]">
			<Sheet>
				<SheetTrigger>
					<Image src="/icons/hamburger.svg" width="30" height="30" alt="Menu" className="cursor-pointer" />
				</SheetTrigger>
				<SheetContent side="left" className="border-none bg-white">
					<Link href="/" className="flex cursor-pointer items-center gap-1 px-4">
						<Image src="/icons/logo.svg" width={34} height={34} alt={"Hub logo"} />
						<h1 className="text-26 font-ibm-plex-serif font-bold text-black-1 whitespace-nowrap">The Hub</h1>
					</Link>
					<div className="mobilenav-sheet">
						<SheetClose asChild>
							<nav className="flex h-full flex-col gap-6 pt-16 text-white">
								{sidebarLinks.map(link => {
									const isLinkActive = link.route === pathName || pathName.startsWith(`${link.route}/`);
									return (
										<SheetClose asChild key={link.label}>
											<Link
												href={link.route}
												className={cn("mobilenav-sheet_close w-full", {
													"bg-bank-gradient": isLinkActive,
												})}
											>
												<Image
													src={link.imgURL}
													alt={link.label}
													width={20}
													height={20}
													className={cn("!static !w-auto !max-w-none", {
														"brightness-[3] invert-0": isLinkActive,
													})}
												/>
												<p
													className={cn("text-16 font-semibold text-black-2 whitespace-nowrap", {
														"text-white": isLinkActive,
													})}
												>
													{link.label}
												</p>
											</Link>
										</SheetClose>
									);
								})}
								USER
							</nav>
						</SheetClose>
						FOOTER
					</div>
				</SheetContent>
			</Sheet>
		</section>
	);
};

export default MobileNav;
