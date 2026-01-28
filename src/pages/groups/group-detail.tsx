import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  FaPlus,
  FaUsers,
  FaCopy,
  FaClock,
  FaRightToBracket,
  FaTrash,
} from "react-icons/fa6";
import { VscLoading } from "react-icons/vsc";
import { useGroup } from "../../hooks/use-group";
import { useGroupPlayers } from "../../hooks/use-group-players";
import { useGroupGameDays } from "../../hooks/use-group-game-days";
import { api } from "../../api";
import { buttonClasses } from "../../components/button";
import BackButton from "../../components/back-button";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: group, isLoading } = useGroup(id || null);
  const { data: players = [] } = useGroupPlayers(id || null);
  const gameDays = useGroupGameDays(id || null);

  // Redirect if group not found
  useEffect(() => {
    if (!isLoading && !group && id) {
      navigate("/grupos");
    }
  }, [isLoading, group, id, navigate]);

  const copyInviteCode = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.inviteCode);
    alert("Código copiado: " + group.inviteCode);
  };

  const handleDeleteGroup = async () => {
    if (!group) return;
    
    const confirmed = window.confirm(
      "⚠️ ATENÇÃO: Isso irá apagar o grupo e todos os dados associados. Deseja continuar?"
    );
    if (confirmed) {
      const success = await api.deleteGroup(group.id);
      if (success) {
        navigate("/grupos");
      } else {
        alert("Erro ao apagar o grupo. Tente novamente.");
      }
    }
  };

  if (isLoading || !group) {
    return (
      <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center">
        <VscLoading className="tw-animate-spin tw-text-emerald-400 tw-text-6xl" />
      </div>
    );
  }

  return (
    <>
    <BackButton to="/grupos" />
    <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-6 tw-max-w-2xl tw-mx-auto tw-w-full tw-px-4">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-2xl tw-font-bold tw-flex tw-items-center tw-gap-2">
          <FaUsers /> {group.name}
        </h1>
        <button
          onClick={copyInviteCode}
          className="tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md hover:tw-bg-gray-100 tw-transition"
          title="Copiar código de convite"
        >
          <FaCopy />
          <span className="tw-font-mono">{group.inviteCode}</span>
        </button>
      </div>
      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2">
        <Link
          to={`/grupos/${group.id}/criar-pelada`}
          className={`${buttonClasses} tw-flex-1`}
        >
          <FaPlus />
          Criar nova pelada
        </Link>
        <Link
          to={`/grupos/${group.id}/historico`}
          className={`${buttonClasses} tw-bg-gray-100 tw-flex-1`}
        >
          <FaClock />
          Histórico
        </Link>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2">
        <Link to="/" className={`${buttonClasses} tw-bg-amber-100`}>
          <FaRightToBracket />
          Transferir/Entrar em Pelada Existente
        </Link>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2">
        <div className="tw-flex tw-items-center tw-justify-between">
          <h2 className="tw-text-lg tw-font-semibold">
            Jogadores ({players.length})
          </h2>
        </div>
        {players.length > 0 ? (
          <ul className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2">
            {players
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((player) => (
                <li
                  key={player.name}
                  className="tw-p-2 tw-border tw-border-gray-200 tw-rounded-md tw-text-center"
                >
                  {player.name}
                </li>
              ))}
          </ul>
        ) : (
          <p className="tw-text-gray-500 tw-text-sm">
            Nenhum jogador cadastrado. Crie uma pelada para adicionar jogadores!
          </p>
        )}
      </div>
      {gameDays.data && gameDays.data.length > 0 && (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <h2 className="tw-text-lg tw-font-semibold">Peladas Recentes</h2>
          <ul className="tw-grid tw-gap-2">
            {gameDays.data.slice(0, 5).map((gameDay) => (
              <li key={gameDay.id}>
                <Link
                  to={`/grupos/${group.id}/historico/${gameDay.id}`}
                  className="tw-flex tw-p-2 tw-border tw-border-gray-300 tw-rounded-md hover:tw-bg-gray-100 tw-transition tw-justify-between tw-items-center"
                >
                  <span>{new Date(gameDay.playedOn).toLocaleString()}</span>
                  <span className="tw-text-sm tw-text-gray-500">
                    {gameDay.players.length} jogadores
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleDeleteGroup}
        className="tw-text-red-500 tw-text-sm tw-underline tw-self-center"
      >
        <FaTrash className="tw-inline tw-mr-1" />
        Apagar grupo
      </button>
    </div>
    </>
  );
};

export default GroupDetail;
