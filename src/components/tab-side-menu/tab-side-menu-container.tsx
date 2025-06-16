"use client";

import { Suspense, useEffect, useState } from "react";

import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

import LoadingSpinner from "../@common/loading-spinner";
import ExportProfileCardButton from "../profile-card/export-profile-card-button";

import GoalListContainer from "./goal-list-container";
import Logo from "./logo";
import TabToggle from "./tab-toggle";
import TodosMenu from "./todos-menu";
import UnsupportedPushNotificationSettingButton from "./unsupported-push-notification-setting-button-ui";
import UserProfile from "./user-profile";

const containerStyle = cva(
  "overflow-y-hidden fixed z-30 transition-all duration-200 bg-white border-b border-slate-100 md:border-r md:border-slate-200",
  {
    variants: {
      open: {
        true: "h-full w-full md:w-280 lg:w-280 overflow-hidden",
        false:
          "w-full h-48 max-h-screen overflow-y-auto md:w-60 md:h-full overflow-hidden",
      },
    },
    defaultVariants: {
      open: true,
    },
  },
);

const topSectionStyle = cva(
  "flex flex-col md:gap-16 md:items-center md:pt-18",
  {
    variants: {
      open: {
        true: "px-24 pt-0 md:p-20",
        false: "h-full p-0 z-50",
      },
    },
    defaultVariants: {
      open: true,
    },
  },
);

const topHeaderStyle = cva(
  "flex w-full relative items-center md:justify-normal",
  {
    variants: {
      open: {
        true: "mt-16 md:m-0",
        false:
          "h-full z-50 md:border-none flex-row px-16 md:gap-16 md:h-fit md:min-h-full md:w-fit md:flex-col md:items-center md:justify-normal md:border-b lg:h-fit lg:min-h-full lg:w-fit lg:flex-col lg:items-center lg:justify-normal lg:border-b",
      },
    },
    defaultVariants: {
      open: true,
    },
  },
);

export default function TabSideMenuContainer() {
  const [isTabMinimized, setIsTabMinimized] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) setIsTabMinimized(false);
      else setIsTabMinimized(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAdding(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isTabMinimized && window.innerWidth <= 744)
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isTabMinimized]);

  useEffect(() => {
    setIsTabMinimized(window.innerWidth < 1200);
  }, [pathname]);

  return (
    <>
      <div className={containerStyle({ open: !isTabMinimized })}>
        <div className={topSectionStyle({ open: !isTabMinimized })}>
          <div className={topHeaderStyle({ open: !isTabMinimized })}>
            <Logo
              isTabMinimized={isTabMinimized}
              setIsTabMinimized={setIsTabMinimized}
            />
            <TabToggle
              isTabMinimized={isTabMinimized}
              setIsTabMinimized={setIsTabMinimized}
            />
          </div>
          <UserProfile isTabOpen={isTabMinimized} />
        </div>
        {/* 탭 열였을때 나타나는 bottom menus */}
        <div
          className={cn(
            "transition-all duration-200",
            isTabMinimized
              ? "z-0 -translate-y-full opacity-0 md:-translate-x-full md:translate-y-0"
              : "translate-y-0 opacity-100 md:translate-x-0",
          )}
        >
          <TodosMenu />
          <Suspense fallback={<LoadingSpinner />}>
            <GoalListContainer
              isTabMinimized={isTabMinimized}
              isAdding={isAdding}
              setIsAdding={setIsAdding}
            />
          </Suspense>
        </div>
        {!isTabMinimized && (
          <div className="absolute bottom-0 mb-36 flex w-full flex-col items-center gap-y-4">
            <ExportProfileCardButton />
            {/* <PushNotificationSettingButton /> */}
            <UnsupportedPushNotificationSettingButton />
          </div>
        )}
      </div>
      {!isTabMinimized && (
        <div className="fixed left-0 top-0 z-20 h-screen w-screen bg-black bg-opacity-50 lg:hidden" />
      )}
    </>
  );
}
