import { useState } from "react";

import { cva } from "class-variance-authority";
import { useRouter } from "next/navigation";

import Profile from "@/assets/icons-big/profile.svg";
import { logout } from "@/services/auth";
import { useUserStore } from "@/store/user-store";
import { errorToast, successToast } from "@/utils/custom-toast";

import Skeleton from "../@common/skeleton";
import TodoModal from "../todo-modal/todo-modal";

import Badge from "./badge";
import CustomButton from "./custom-button";

const containerStyle = cva(
  "w-full md:block overflow-hidden transition-all duration-200",
  {
    variants: {
      open: {
        true: "-translate-y-full opacity-0 md:-translate-x-full md:translate-y-0 h-0",
        false: "translate-y-0 opacity-100 md:translate-x-0 mt-16 md:m-0",
      },
    },
    defaultVariants: {
      open: true,
    },
  },
);

const logoutButtonStyle =
  "min-h-0 w-fit min-w-0 justify-normal bg-opacity-0 p-0 text-xs font-normal text-slate-400 hover:bg-opacity-0";

const profileInfoStyle =
  "flex w-full items-end justify-between text-sm md:flex-col md:items-baseline lg:flex-col lg:items-baseline";

export default function UserProfile({ isTabOpen }: { isTabOpen: boolean }) {
  const router = useRouter();

  const { userInformation } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logout();

      successToast("logout", "로그아웃 되었습니다.");
      router.push("/login");
    } catch (error) {
      errorToast("logout", "로그아웃 오류가 발생했습니다.");
    }
  };

  return (
    <div className={containerStyle({ open: isTabOpen })}>
      <div className="mb-24 flex w-full gap-12">
        <div className="min-w-44 md:min-w-64 lg:min-w-64">
          <Profile />
        </div>
        <div className={profileInfoStyle}>
          <div>
            {userInformation ? (
              <>
                <div className="flex items-center">
                  <p className="mr-4 text-sm font-semibold text-slate-800">
                    {userInformation.name || ""}
                  </p>
                  <Badge streakGrade={userInformation.streakGrade ?? 0} />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {userInformation.email || ""}
                </p>
              </>
            ) : (
              <div className="flex flex-col gap-y-10 pt-4">
                <Skeleton className="h-11 w-50" />
                <Skeleton className="h-11 w-132" />
              </div>
            )}
          </div>
          <button onClick={logoutHandler} className={logoutButtonStyle}>
            로그아웃
          </button>
        </div>
      </div>
      <CustomButton
        isMobile={false}
        color="white"
        onClick={() => setIsModalOpen(true)}
      >
        새 할 일
      </CustomButton>
      {isModalOpen && (
        <TodoModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      )}
    </div>
  );
}
