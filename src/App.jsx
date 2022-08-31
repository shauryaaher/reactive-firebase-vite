import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import { getPerformance, trace } from "firebase/performance";
import {
  useFirestore,
  useFirebaseApp,
  FirestoreProvider,
  useFirestoreCollectionData,
} from "reactfire";
import logo from "./assets/logo.svg";
import "./App.css";

/**
 * The React spinning logo in a component.
*/
function Spinner() {
  return <img src={logo} className="App-logo" alt="logo" />;
}

/**
 * This component gets data from a Cloud Firestore collection
 * and displays the fields of the documents of the collection as a list.
 * The 'id' field is used as a key for the `<li />` element.
 */
function GetDataFromACollection() {
  const firestoreHook = useFirestore();
  const perf = getPerformance(useFirebaseApp());
  const ref = collection(firestoreHook, "reactive");
  const q = query(ref, orderBy("id", "desc"));
  const t = trace(perf, "fetchFirestoreData");
  t.start();
  const { status, data } = useFirestoreCollectionData(q);
  t.stop();
  if (status === "loading") {
    return <Spinner />;
  } else if (status === "success") {
    return (
      <>
        <h1>This is a list of random facts</h1>
        <br />
        <ul>
          {data.map((any) => {
            return <li key={any.id}>{any.field}</li>;
          })}
        </ul>
      </>
    );
  } else {
    return <h1>Sorry, an error occured while getting the facts</h1>;
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
