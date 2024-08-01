import Logo from "@/app/(root)/_components/navbar/logo";
import { Search } from "@/app/(root)/_components/navbar/search";
import { Actions, ActionsSkeleton } from "@/app/(root)/_components/navbar/actions";
import { Suspense } from "react";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full h-20 z-[49px] bg-[#252731] px-2 lg:px-4 flex justify-between items-center shadow-sm">
            <Logo />
            <Search />
            <Suspense fallback={<ActionsSkeleton />}>
                <Actions />
            </Suspense>
        </nav>
    )
}