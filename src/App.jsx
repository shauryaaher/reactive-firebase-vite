import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import {
  useFirestore,
  useFirebaseApp,
  FirestoreProvider,
  useFirestoreCollectionData,
} from "reactfire";
import logo from "./assets/logo.svg";
import "./App.css";

function Spinner() {
  return <img src={logo} className="App-logo" alt="logo" />;
}

function GetDataFromACollection() {
  const firestoreHook = useFirestore();
  const ref = collection(firestoreHook, "reactive");
  const q = query(ref, orderBy("id", "desc"));
  const { status, data } = useFirestoreCollectionData(q);
  if (status === "loading") {
    return <Spinner />;
  } else if (status === "success") {
    return (
      <>
        <h1>This is a list of random facts</h1><br />
        <ul>
          {data.map((any) => {
            return <li key={any.id}>{any.field}</li>;
          })}
        </ul>
      </>
    );
  }
}

function App() {
  const firestore = getFirestore(useFirebaseApp());
  return (
    <FirestoreProvider sdk={firestore}>
      <GetDataFromACollection />
    </FirestoreProvider>
  );
}

export default App;
