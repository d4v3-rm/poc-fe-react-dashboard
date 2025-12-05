import { AppProviders } from "./app/AppProviders";
import { DashboardPage } from "./app/DashboardPage";

const App = () => (
  <AppProviders>
    <DashboardPage />
  </AppProviders>
);

export default App;
