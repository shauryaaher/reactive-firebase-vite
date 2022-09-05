import { createRoot } from "react-dom/client";
import { FirebaseAppProvider } from "reactfire";
import App from "./App";
import "./index.css";

const firebaseConfig = {
  apiKey: "AIzaSyCnE7ERZn2GJSymmyLCktZ9Ze6VSx4j6kw",
  authDomain: "facts-site.firebaseapp.com",
  projectId: "facts-site",
  storageBucket: "facts-site.appspot.com",
  messagingSenderId: "565052035575",
  appId: "1:565052035575:web:8a0f2e1ef80070dc789ef2",
  measurementId: "G-FRD4Z8ECY6",
};

createRoot(document.getElementById("root")).render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <App />
  </FirebaseAppProvider>
);
