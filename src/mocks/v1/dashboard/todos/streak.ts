import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { DashboardStreakResponse } from "@/types/dashboard";

const generateHistoryStreaks = () => {
  const today = new Date();
  const streaks = [];

  for (let i = 0; i < 365; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    streaks.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 6),
    });
  }

  return streaks;
};

const generateWeekStreaks = () => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay());

  const streaks = [];

  for (let i = 0; i <= today.getDate() - monday.getDate(); i += 1) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    streaks.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 6),
    });
  }

  return streaks;
};

export const getDashboardStreak = http.get<
  never,
  never,
  DashboardStreakResponse
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.DASHBOARD.GET_TODO_STREAK}`,
  async () => {
    return HttpResponse.json(
      {
        historyStreaks: generateHistoryStreaks(),
        weekStreaks: generateWeekStreaks(),
      },
      { status: 200 },
    );
  },
);
