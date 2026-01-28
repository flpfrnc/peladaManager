import useSWR from "swr";
import { api } from "../api";

export const useGroupGameDays = (groupId: string | null) => {
  return useSWR(
    groupId ? `/groups/${groupId}/game-days` : null,
    () => groupId ? api.getGroupGameDays(groupId) : Promise.resolve([])
  );
};
