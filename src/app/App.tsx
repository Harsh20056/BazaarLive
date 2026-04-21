import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "../store";
import { router } from "./routes";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}