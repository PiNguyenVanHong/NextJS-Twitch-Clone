import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Logo() {
    return ( 
        <div className="flex flex-col items-center gap-y-4">
            <div className="bg-white rounded-xl px-1 overflow-hidden">
                <Image 
                    src={"/1.png"}
                    alt="PlayStream"
                    height={70}
                    width={60}
                />
            </div>
            <div className="flex flex-col items-center">
                <p className={cn("text-xl font-semibold", font.className)}
                >PlayStream</p>
            </div>
            <p className={cn(
                "text-sm text-muted-foreground",
                font.className
            )}>
                Lets Play
            </p>
        </div>
     );
}