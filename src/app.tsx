import { Route, Routes } from "react-router";
import Home from "./pages/home/home";
import CreateGameDay from "./pages/create-game-day/create-game-day";
import GameDay from "./pages/game-day/game-day";
import History from "./pages/history/history";
import Layout from "./pages/layout";
import HistoryMatch from "./pages/history/history-match";
import EditGameDay from "./pages/game-day/edit/edit-game-day";
import Groups from "./pages/groups/groups";
import CreateGroup from "./pages/groups/create-group";
import GroupDetail from "./pages/groups/group-detail";
import CreateGroupGameDay from "./pages/groups/create-game-day/create-group-game-day";
import GroupHistory from "./pages/groups/history/group-history";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="criar-pelada" element={<CreateGameDay />} />
        <Route path="entrar-pelada/:id" element={<CreateGameDay />} />
        <Route path="pelada" element={<GameDay />} />
        <Route path="pelada/editar" element={<EditGameDay />} />
        <Route path="historico">
          <Route index element={<History />} />
          <Route path=":id" element={<HistoryMatch />} />
        </Route>
        <Route path="grupos">
          <Route index element={<Groups />} />
          <Route path="criar" element={<CreateGroup />} />
          <Route path=":id" element={<GroupDetail />} />
          <Route path=":id/criar-pelada" element={<CreateGroupGameDay />} />
          <Route path=":id/historico" element={<GroupHistory />} />
          <Route path=":id/historico/:gameDayId" element={<HistoryMatch />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
