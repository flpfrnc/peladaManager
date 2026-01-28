import { FaVolleyball } from "react-icons/fa6";
import { VscLoading } from "react-icons/vsc";
import { useParams, useNavigate } from "react-router";
import { useGroup } from "../../../hooks/use-group";
import { useGroupPlayers } from "../../../hooks/use-group-players";
import { api } from "../../../api";
import Button from "../../../components/button";
import CourtFormGroup, { CourtFormGroupData } from "../../../components/court-form-group";
import { findBestTeamMatch } from "../../../lib/elo";
import { createGameDayPlayer } from "../../../entities/game-day-player";

const CreateGroupGameDay = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: group, isLoading } = useGroup(groupId || null);
  const { mutate: refreshPlayers } = useGroupPlayers(groupId || null);

  if (!groupId || isLoading) {
    return (
      <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center">
        <VscLoading className="tw-animate-spin tw-text-emerald-400 tw-text-6xl" />
      </div>
    );
  }

  if (!group) {
    navigate("/grupos");
    return null;
  }

  const onSubmit = async (data: CourtFormGroupData) => {
    try {
      const players = data.players.map((player) => player.value);
      const playersToFirstMatch = players.slice(0, data.playersPerTeam * 2);
      const bestMatch = findBestTeamMatch(playersToFirstMatch);

      const result = await api.createGroupGameDay(groupId, {
        maxPoints: data.maxPoints,
        playersPerTeam: data.playersPerTeam,
        players: players.map((p, i) => ({
          ...createGameDayPlayer(p, i),
          mu: p.mu,
          sigma: p.sigma,
        })),
        playingTeams: [
          bestMatch.teamA.map(createGameDayPlayer),
          bestMatch.teamB.map(createGameDayPlayer),
        ],
        isLive: true,
        autoSwitchTeamsPoints: data.autoSwitchTeamsPoints ?? 0,
        playedOn: new Date(),
      });

      if (result) {
        await refreshPlayers();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CourtFormGroup
      groupId={groupId}
      initialValues={{
        maxPoints: 11,
        playersPerTeam: 4,
        players: [],
      }}
      submitButton={(isSubmitting: boolean) => (
        <Button className="tw-gap-2" disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <VscLoading className="tw-animate-spin" />
          ) : (
            <FaVolleyball />
          )}{" "}
          Iniciar pelada
        </Button>
      )}
      onSubmit={onSubmit}
    />
  );
};

export default CreateGroupGameDay;
