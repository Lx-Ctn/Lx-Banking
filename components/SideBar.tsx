"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideBar = ({ user }: SiderbarProps) => {
	const pathName = usePathname();
	return (
		<section className="sidebar">
			<nav className="flex flex-col gap-4">
				<Link href="/" className="flex mb-12 cursor-pointer items-center gap-2 ">
					<Image
						src="/icons/logo.svg"
						width={34}
						height={34}
						alt={"Hub logo"}
						className="size-[24px] max-xl:size-14"
					/>
					<h1 className="sidebar-logo whitespace-nowrap">The Hub</h1>
				</Link>
				{sidebarLinks.map((link, i) => {
					const isLinkActive = link.route === pathName || pathName.startsWith(`${link.route}/`);
					return (
						<Link
							key={i}
							href={link.route}
							className={cn("sidebar-link", { "bg-bank-gradient": isLinkActive })}
						>
							<div className="relative flex gap-3">
								<Image
									src={link.imgURL}
									alt={link.label}
									fill
									className={cn("!static !w-auto !max-w-none", {
										"brightness-[3] invert-0": isLinkActive,
									})}
								/>
								<p className={cn("sidebar-label whitespace-nowrap", { "!text-white": isLinkActive })}>
									{link.label}
								</p>
							</div>
						</Link>
					);
				})}
				USER
			</nav>
			FOOTER
		</section>
	);
};

export default SideBar;
