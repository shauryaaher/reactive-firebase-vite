import { Spinner } from "./Spinner.jsx";
import { useFirestore, usePerformance, useFirestoreCollectionData } from "reactfire";
import { collection, query, orderBy } from "firebase/firestore";
import { trace } from "firebase/performance";

export default function FirestoreAndPerf() {
    const firestoreHook = useFirestore();
    const perf = usePerformance();
    const ref = collection(firestoreHook, "reactive");
    const q = query(ref, orderBy("id", "desc"));
    const t = trace(perf, "fetchFirestoreData");
    t.start();
    const { status, data } = useFirestoreCollectionData(q);
    t.stop();
    if (status === "loading") {
      return (
        <>
          <center>
            <Spinner />
            <h1>Loading your facts....</h1>
          </center>
        </>
      );
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