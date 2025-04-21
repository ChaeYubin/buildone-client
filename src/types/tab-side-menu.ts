import { JSX, ReactNode, SetStateAction } from "react";

import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

import { GoalResponse } from "./goal";

export interface LinkProps {
  href: string;
  icon: JSX.Element;
  title: string;
  cursor: "cursor-pointer" | "cursor-default";
}

export interface ButtonProps {
  isMobile: boolean;
  children: ReactNode;
  color: "white" | "blue";
  onClick?: () => void;
  variant?: "outlined";
  className?: string;
}

export interface IsTabMinimizedProps {
  setIsTabMinimized: (value: SetStateAction<boolean>) => void;
  isTabMinimized: boolean;
}

export interface IsAddingProps {
  setIsAdding: (value: SetStateAction<boolean>) => void;
  isAdding: boolean;
}

export interface GoalsListProps {
  goals: GoalResponse[];
  hasNextPage: boolean;
  setIsAdding: (value: boolean) => void;
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<
      {
        pages: GoalResponse[];
        pageParams: number[];
      },
      Error
    >
  >;
}

export interface AddGoalSectionProps {
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setNewGoal: (value: string) => void;
  newGoal: string;
  goals: GoalResponse[];
}
