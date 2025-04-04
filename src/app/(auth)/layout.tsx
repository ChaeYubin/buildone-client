import Link from "next/link";

import MainLogo from "@/assets/logo/main_logo.svg";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-16 mb-40 mt-65 flex flex-col items-center md:mt-81 lg:mt-137">
      <Link href="/">
        <MainLogo aria-label="BuilDone 로고" />
      </Link>
      {children}
    </div>
  );
}
