import { useState } from 'react';
import { useGameDays } from '../../hooks/use-game-days'
import { useGroupGameDays } from '../../hooks/use-group-game-days'
import { VscLoading } from 'react-icons/vsc';
import { FaRedo } from 'react-icons/fa';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router';
import PlayersTable from '../../components/players-table';
import BackButton from '../../components/back-button';
import Button from '../../components/button';
import { api } from '../../api';


const HistoryMatch = () => {
  // Support both legacy routes (/historico/:id) and group routes (/grupos/:id/historico/:gameDayId)
  const params = useParams<{ id?: string; gameDayId?: string }>();
  const location = useLocation();
  const isGroupRoute = location.pathname.includes('/grupos/');
  
  // Extract groupId and gameDayId based on route
  const groupId = isGroupRoute ? params.id : null;
  const gameDayId = isGroupRoute ? params.gameDayId : params.id;
  
  const legacyGameDays = useGameDays();
  const groupGameDays = useGroupGameDays(groupId ?? null);
  
  const gameDays = isGroupRoute ? groupGameDays : legacyGameDays;
  const [searchParams] = useSearchParams()
  const navigate = useNavigate();
  const [isRestarting, setIsRestarting] = useState(false);

  if(gameDays.isLoading) {
    return <div className='tw-flex-1 tw-flex tw-justify-center tw-items-center'>
      <VscLoading className='tw-animate-spin tw-text-emerald-400 tw-text-6xl' />
    </div>
  }

  const gameDay = gameDays.data?.find(gd => gd.id === gameDayId);

  if(!gameDay) {
    return <div
      className='tw-flex-1 tw-flex tw-justify-center tw-items-center tw-text-red-500 tw-text-2xl'
    >
    <p>
      Pelada não encontrada
    </p>
    </div>
  }

  const handleRestartGameDay = async () => {
    const confirm = window.confirm("Deseja recuperar esta pelada?");
    if (!confirm) return;

    setIsRestarting(true);
    try {
      const result = await api.restartGameDay(gameDay.id);
      if (!result) {
        alert("Erro ao recuperar a pelada");
        return;
      }
      navigate('/pelada');
    } finally {
      setIsRestarting(false);
    }
  };

  // Determine back navigation path
  const getBackPath = () => {
    if (searchParams.get('origin') === 'game-day') return '/';
    if (isGroupRoute && groupId) return `/grupos/${groupId}/historico`;
    return '/historico';
  };

  return (
    <>
      <BackButton to={getBackPath()} />
      <PlayersTable
        gameDay={gameDay}
        legend={false}
        showPlaying={false}
        substitutePlayer={() => {}}
      />
      <Button
        onClick={handleRestartGameDay}
        disabled={isRestarting}
        className="tw-bg-amber-400 tw-gap-2 tw-text-base tw-font-medium"
      >
        {isRestarting ? <VscLoading className="tw-animate-spin" /> : <FaRedo />}
        Recuperar Pelada
      </Button>
    </>
  )
}

export default HistoryMatch