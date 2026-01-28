import { FaClock } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { Link, useParams } from "react-router";
import BackButton from "../../../components/back-button";
import { useGroupGameDays } from "../../../hooks/use-group-game-days";

const GroupHistory = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const gameDays = useGroupGameDays(groupId || null);

  if (gameDays.error) return <div>Erro ao carregar</div>;

  if (gameDays.isLoading || !gameDays.data)
    return (
      <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center ">
        <VscLoading className="tw-animate-spin tw-text-emerald-400 tw-text-6xl" />
      </div>
    );

  return (
    <>
      <BackButton to={`/grupos/${groupId}`} />
      <h1 className="tw-text-center tw-text-xl tw-mb-5 tw-flex tw-justify-center tw-items-center tw-gap-2">
        <FaClock /> Histórico de Partidas
      </h1>
      {gameDays.data.length === 0 ? (
        <p className="tw-text-center tw-text-gray-500">
          Nenhuma pelada registrada ainda.
        </p>
      ) : (
        <ul className="tw-grid tw-gap-2 md:tw-grid-cols-3">
          {gameDays.data.map((gameDay) => {
            return (
              <li key={gameDay.id}>
                <Link
                  className="tw-flex tw-p-2 tw-border tw-border-gray-300 tw-rounded-md
                  hover:tw-bg-gray-100 tw-transition tw-justify-center tw-items-center
                  hover:tw-text-stone-800 tw-font-semibold tw-text-lg
                  "
                  to={`/grupos/${groupId}/historico/${gameDay.id}`}
                >
                  {new Date(gameDay.playedOn).toLocaleString()}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default GroupHistory;
