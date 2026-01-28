import useSWR from "swr";
import { api } from "../api";

export const useGroupPlayers = (groupId: string | null) => {
  return useSWR(
    groupId ? `/groups/${groupId}/players` : null,
    () => (groupId ? api.getGroupPlayers(groupId) : Promise.resolve([]))
  );
};
