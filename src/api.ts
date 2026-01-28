import { GameDay, GameDayPlayer, GameGroup, Player } from "./types";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://plankton-app-xoik3.ondigitalocean.app";

const createGroup = async (name: string, players: Player[] = []) => {
  try {
    const res = await fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, players }),
      credentials: "include",
    });
    if (!res.ok) return null;
    return (await res.json()) as { id: string; inviteCode: string };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getGroups = async () => {
  try {
    const res = await fetch(`${API_URL}/groups`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    return (await res.json()) as GameGroup[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getGroup = async (groupId: string) => {
  try {
    const res = await fetch(`${API_URL}/groups/${groupId}`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    return (await res.json()) as GameGroup;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const joinGroup = async (inviteCode: string) => {
  try {
    const res = await fetch(`${API_URL}/groups/join/${inviteCode}`, {
      method: "PUT",
      credentials: "include",
    });
    if (!res.ok) return null;
    return (await res.json()) as GameGroup;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteGroup = async (groupId: string) => {
  // É tratado como delete, mas é apenas um soft
  try {
    const res = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getGroupPlayers = async (groupId: string) => {
  try {
    const res = await fetch(`${API_URL}/groups/${groupId}/players`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    return (await res.json()) as Player[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const addGroupPlayer = async (groupId: string, player: Player) => {
  try {
    const res = await fetch(`${API_URL}/groups/${groupId}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getGroupGameDays = async (groupId: string) => {
  try {
    const res = await fetch(`${API_URL}/groups/${groupId}/game-days`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    return (await res.json()) as GameDay[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

type CreateGroupGameDayParams = {
  maxPoints: number;
  playersPerTeam: number;
  autoSwitchTeamsPoints: number;
  isLive: boolean;
  playedOn: Date;
  players: (Player & Partial<GameDayPlayer>)[];
  playingTeams: GameDayPlayer[][];
};

const createGroupGameDay = async (groupId: string, gameDay: CreateGroupGameDayParams) => {
  try {
    const res = await fetch(`${API_URL}/groups/${groupId}/game-days`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameDay),
      credentials: "include",
    });
    if (!res.ok) return null;
    return (await res.json()) as { id: string; courtId: string; joinCode: string };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const putPlayer = async (player: Player) => {
  try {
    const res = await fetch(`${API_URL}/players/`, {
      body: JSON.stringify(player),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      method: "PUT",
    });
    return res.ok;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updatePlayers = async (players: Player[]) => {
  try {
    const res = await fetch(`${API_URL}/players/bulk`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(players),
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error(error);
    return null;
  }
};

type OmitProps =
  | "id"
  | "otherPlayingTeams"
  | "lastMatch"
  | "joinCode"
  | "joinCodeExpiration"
  | 'courtId'
  | "playersToNextGame";

export type CreateGameDayParams =  Omit<GameDay, OmitProps>

const createGameDay = async (gameDay: CreateGameDayParams) => {
  try {
    const res = await fetch(`${API_URL}/game-days`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameDay),
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      id: string;
      courtId: string;
      joinCode: string;
    };
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

type UpdateGameDayOmitProps = 'id' | 'courtId' | 'joinCode' | 'joinCodeExpiration' | 'otherPlayingTeams' | 'lastMatch';

const updateGameDay = async (gameDay: Omit<GameDay, UpdateGameDayOmitProps>) => {
  
  try {
    const res = await fetch(`${API_URL}/sessions/game-day`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameDay),
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getActiveGameDay = async () => {
  try {
    const res = await fetch(`${API_URL}/sessions/game-day`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const gameDay = (await res.json()) as GameDay;
    return gameDay;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getGameDays = async () => {
  try {
    const res = await fetch(`${API_URL}/game-days`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    const gameDays = (await res.json()) as GameDay[];
    return gameDays;
  } catch (error) {
    console.error(error);
    return [];
  }
};

async function joinGameDay(joinCode: string) {
  try {
    const response = await fetch(`${API_URL}/game-days/join/${joinCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      return false;
    }
    return (await response.json()) as GameDay
  } catch {
    return false;
  }
}

async function leaveGameDay() {
  try {
    const response = await fetch(`${API_URL}/sessions/game-day/leave`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function transferGameDay(joinCode: string) {
  try {
    const response = await fetch(`${API_URL}/game-days/transfer/${joinCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      return false;
    }
    return (await response.json()) as GameDay
  } catch {
    return false;
  }
}

async function restartGameDay(gameId: string) {
  try {
    const response = await fetch(`${API_URL}/game-days/${gameId}/restart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      return false;
    }
    return (await response.json()) as { id: string; courtId: string; joinCode: string };
  } catch {
    return false;
  }
}

export const api = {
  // Groups
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  deleteGroup,
  // Group Players
  getGroupPlayers,
  addGroupPlayer,
  // Group Game Days
  getGroupGameDays,
  createGroupGameDay,
  // Players
  updatePlayers,
  putPlayer,
  // Game Days
  createGameDay,
  getActiveGameDay,
  updateGameDay,
  getGameDays,
  joinGameDay,
  leaveGameDay,
  transferGameDay,
  restartGameDay,
};
