import { Navbar } from "@/app/(root)/_components/navbar";
import { Sidebar, SidebarSkeleton } from "@/app/(root)/_components/sidebar";
import { Container } from "@/app/(root)/_components/container";
import { Suspense } from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex h-full pt-20">
        <Suspense fallback={<SidebarSkeleton/>}>
          <Sidebar />
        </Suspense>
        <Container>
        {children}
        </Container>
      </div>
    </>
  );
};

export default RootLayout;
