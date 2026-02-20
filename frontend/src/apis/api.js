import api from "./axios";
export const getDailyEarnings = (date) =>
  api.get(`/earnings/day`, { params: { date } });

export const getMonthlyEarnings = (month) =>
  api.get(`/earnings/month`, { params: { month } });
