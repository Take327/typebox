"use client";

import Header from "./Header";
import SideMenu from "./SideMenu";
import { MenuProvider } from "../../context/MenuContext";
import { usePathname } from "next/navigation";

export default function HeaderWithMenu() {
  const pathname = usePathname();

  // ログインページかどうかを判定
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return null;
  }

  return (
    <MenuProvider>
      <Header />
      <SideMenu />
    </MenuProvider>
  );
}
