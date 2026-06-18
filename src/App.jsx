import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { Home } from "./pages/Home";
import { GameHome } from "./pages/GameHome";
import { ListPage } from "./pages/ListPage";
import { ChecklistsPage } from "./pages/ChecklistsPage";
import { CollectiblesPage } from "./pages/CollectiblesPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import {
  ItemPage, CharacterPage, DungeonPage, LocationPage,
  QuestPage, SongPage, MaskPage, BossDetailPage, MonsterDetailPage,
  HeartPiecePage, SkulltulaPage, GreatFairyPage, StrayFairyPage,
} from "./pages/DetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/oot" element={<Layout><GameHome /></Layout>} />
          <Route path="/mm" element={<Layout><GameHome /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

          <Route path="/oot/items" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/items" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/characters" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/characters" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/dungeons" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/dungeons" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/locations" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/locations" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/quests" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/quests" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/songs" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/songs" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/masks" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/masks" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/bosses" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/bosses" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/monsters" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/monsters" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/checklists" element={<Layout><ChecklistsPage /></Layout>} />
          <Route path="/mm/checklists" element={<Layout><ChecklistsPage /></Layout>} />

          <Route path="/oot/collectibles" element={<Layout><CollectiblesPage /></Layout>} />
          <Route path="/mm/collectibles" element={<Layout><CollectiblesPage /></Layout>} />
          <Route path="/oot/heart-pieces" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/heart-pieces" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/skulltulas" element={<Layout><ListPage /></Layout>} />
          <Route path="/oot/great-fairies" element={<Layout><ListPage /></Layout>} />
          <Route path="/mm/stray-fairies" element={<Layout><ListPage /></Layout>} />

          <Route path="/oot/items/:id" element={<Layout><ItemPage /></Layout>} />
          <Route path="/mm/items/:id" element={<Layout><ItemPage /></Layout>} />
          <Route path="/oot/characters/:id" element={<Layout><CharacterPage /></Layout>} />
          <Route path="/mm/characters/:id" element={<Layout><CharacterPage /></Layout>} />
          <Route path="/oot/dungeons/:id" element={<Layout><DungeonPage /></Layout>} />
          <Route path="/mm/dungeons/:id" element={<Layout><DungeonPage /></Layout>} />
          <Route path="/oot/locations/:id" element={<Layout><LocationPage /></Layout>} />
          <Route path="/mm/locations/:id" element={<Layout><LocationPage /></Layout>} />
          <Route path="/oot/quests/:id" element={<Layout><QuestPage /></Layout>} />
          <Route path="/mm/quests/:id" element={<Layout><QuestPage /></Layout>} />
          <Route path="/oot/songs/:id" element={<Layout><SongPage /></Layout>} />
          <Route path="/mm/songs/:id" element={<Layout><SongPage /></Layout>} />
          <Route path="/oot/masks/:id" element={<Layout><MaskPage /></Layout>} />
          <Route path="/mm/masks/:id" element={<Layout><MaskPage /></Layout>} />
          <Route path="/oot/heart-pieces/:id" element={<Layout><HeartPiecePage /></Layout>} />
          <Route path="/mm/heart-pieces/:id" element={<Layout><HeartPiecePage /></Layout>} />
          <Route path="/oot/skulltulas/:id" element={<Layout><SkulltulaPage /></Layout>} />
          <Route path="/oot/great-fairies/:id" element={<Layout><GreatFairyPage /></Layout>} />
          <Route path="/mm/stray-fairies/:id" element={<Layout><StrayFairyPage /></Layout>} />

          <Route path="/oot/bosses/:id" element={<Layout><BossDetailPage /></Layout>} />
          <Route path="/mm/bosses/:id" element={<Layout><BossDetailPage /></Layout>} />
          <Route path="/oot/monsters/:id" element={<Layout><MonsterDetailPage /></Layout>} />
          <Route path="/mm/monsters/:id" element={<Layout><MonsterDetailPage /></Layout>} />

          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
