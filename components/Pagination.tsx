"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/utils";

export const Pagination = ({ page, totalPages }: PaginationProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams()!;

	if (totalPages === 1) {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		router.push(pathname + "?" + params.toString(), { scroll: false });
		return null;
	}

	const handleNavigation = (type: "prev" | "next") => {
		const pageNumber = type === "prev" ? page - 1 : page + 1;

		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: "page",
			value: pageNumber.toString(),
		});

		router.push(newUrl, { scroll: false });
	};

	return (
		<div className="flex justify-between gap-3">
			<Button
				size="lg"
				variant="ghost"
				className="p-0 hover:bg-transparent"
				onClick={() => handleNavigation("prev")}
				disabled={Number(page) <= 1}
			>
				<Image src="/icons/arrow-left.svg" alt="arrow" width={20} height={20} className="mr-2" />
				Prev
			</Button>
			<p className="text-14 flex items-center px-2">
				{page} / {totalPages}
			</p>
			<Button
				size="lg"
				variant="ghost"
				className="p-0 hover:bg-transparent"
				onClick={() => handleNavigation("next")}
				disabled={Number(page) >= totalPages}
			>
				Next
				<Image src="/icons/arrow-left.svg" alt="arrow" width={20} height={20} className="ml-2 -scale-x-100" />
			</Button>
		</div>
	);
};
