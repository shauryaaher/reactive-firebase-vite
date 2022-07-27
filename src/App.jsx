import { doc, getFirestore } from "firebase/firestore";
import {
  useFirestore,
  useFirestoreDocData,
  useFirebaseApp,
  FirestoreProvider,
} from "reactfire";
import logo from "./assets/logo.svg";
import "./App.css";

function Spinner() {
  return <img src={logo} className="App-logo" alt="logo" />;
}

function OtherData() {
  const reference = doc(useFirestore(), "reactive", "qhJUEMi9MDn2FZ4y5X4W");
  const document = useFirestoreDocData(reference);
  if (document.status === "loading") {
    return <Spinner />;
  } else {
    return <h1>{document.data.field}</h1>;
  }
}

function App() {
  const instance = getFirestore(useFirebaseApp());
  return (
    <FirestoreProvider sdk={instance}>
      <OtherData />
    </FirestoreProvider>
  );
}

export default App;
