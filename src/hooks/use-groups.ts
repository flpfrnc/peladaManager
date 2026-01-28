import useSWR from "swr";
import { api } from "../api";

export const useGroups = () => useSWR("/groups", api.getGroups);
