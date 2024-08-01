import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Logo() {
    return ( 
        <Link href={"/"}>
            <div className="flex items-center gap-x-4 hover:opacity-75 transition">
                <div className="bg-white h-10 w-10 object-cover object-center rounded-full p-1 mr-2 shrink-0 overflow-hidden flex items-center justify-center">
                    <Image 
                        src={"/1.png"}
                        alt="PlayStream"
                        height={25}
                        width={25}
                    />
                </div>
                <div className={cn("hidden lg:block", font.className)}>
                    <p className="text-lg font-semibold">PlayStream</p>
                    <p className="text-xs text-muted-foreground">Creator Dashboard</p>
                </div>
            </div>
        </Link>
     );
}