import useSWR from "swr";
import { api } from "../api";

export const useGroup = (groupId: string | null) => {
  return useSWR(
    groupId ? `/groups/${groupId}` : null,
    () => (groupId ? api.getGroup(groupId) : Promise.resolve(null))
  );
};
