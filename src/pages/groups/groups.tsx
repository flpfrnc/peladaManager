import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaPlus, FaUsers, FaRightToBracket, FaCopy, FaArrowRight } from "react-icons/fa6";
import { VscLoading } from "react-icons/vsc";
import { useGroups } from "../../hooks/use-groups";
import { api } from "../../api";
import Button, { buttonClasses } from "../../components/button";
import Input from "../../components/input";
import BackButton from "../../components/back-button";
import { GameGroup } from "../../types";

const Groups = () => {
  const groups = useGroups();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    try {
      setIsJoining(true);
      setJoinError(null);
      const group = await api.joinGroup(inviteCode.toUpperCase());
      if (!group) {
        setJoinError("Código inválido ou expirado");
        return;
      }
      await groups.mutate();
      navigate("/grupos/" + group.id);
    } catch {
      setJoinError("Erro ao entrar no grupo");
    } finally {
      setIsJoining(false);
    }
  };

  const handleSelectGroup = (group: GameGroup) => {
    navigate(`/grupos/${group.id}`);
  };

  const copyInviteCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    alert("Código copiado!");
  };

  if (groups.error) return <div>Erro ao carregar grupos</div>;

  if (groups.isLoading || !groups.data) {
    return (
      <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center">
        <VscLoading className="tw-animate-spin tw-text-emerald-400 tw-text-6xl" />
      </div>
    );
  }

  return (
    <>
    <BackButton to="/" />
    <div className="tw-flex tw-flex-col tw-gap-6 tw-max-w-2xl tw-mx-auto tw-w-full tw-px-4">
      
      <h1 className="tw-text-2xl tw-font-bold tw-text-center tw-flex tw-items-center tw-justify-center tw-gap-2">
        <FaUsers /> Meus Grupos de Pelada
      </h1>
      <Link to="/grupos/criar" className={`${buttonClasses} tw-flex-1`}>
        <FaPlus />
        Criar novo grupo
      </Link>
      <form onSubmit={handleJoinGroup} className="tw-flex tw-flex-col tw-gap-3">
        <div className="tw-flex tw-flex-col tw-gap-2">
          <label htmlFor="invite-code">Código de convite:</label>
          <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2">
            <Input
              id="invite-code"
              className="tw-flex-1 tw-w-full"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value.toUpperCase());
                setJoinError(null);
              }}
              placeholder="Digite o código"
            />
            <Button
              type="submit"
              className="tw-bg-emerald-400 tw-py-[14px] tw-w-full sm:tw-w-auto"
              disabled={isJoining || !inviteCode.trim()}
            >
              {isJoining ? (
                <VscLoading className="tw-animate-spin" />
              ) : (
                <FaRightToBracket />
              )}
              Entrar
            </Button>
          </div>
        </div>
        {joinError && <p className="tw-text-red-500 tw-text-sm">{joinError}</p>}
      </form>
      {groups.data.length > 0 ? (
        <div className="tw-flex tw-flex-col tw-gap-2">
          <h2 className="tw-text-lg tw-font-semibold">Selecione um grupo:</h2>
          <ul className="tw-grid tw-gap-2">
            {groups.data.map((group) => (
              <li key={group.id}>
                <button
                  onClick={() => handleSelectGroup(group)}
                  className="tw-w-full tw-flex tw-items-center tw-justify-between tw-p-4 tw-border tw-border-gray-300 tw-rounded-md hover:tw-bg-gray-100 tw-transition"
                >
                  <div className="tw-flex tw-flex-col tw-items-start">
                    <span className="tw-font-semibold tw-text-lg">
                      {group.name}
                    </span>
                    <span className="tw-text-sm tw-text-gray-500">
                      {group.players?.length || 0} jogadores
                    </span>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <button
                      onClick={(e) => copyInviteCode(group.inviteCode, e)}
                      className="tw-p-2 tw-text-gray-500 hover:tw-text-emerald-500 tw-transition"
                      title="Copiar código de convite"
                    >
                      <FaCopy />
                    </button>
                    <FaArrowRight className="tw-text-gray-400" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="tw-text-center tw-text-gray-500">
          Você ainda não tem nenhum grupo. Crie um ou entre com um código de
          convite!
        </p>
      )}
    </div>
    </>
  );
};

export default Groups;
