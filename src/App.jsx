import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import { getPerformance, trace } from "firebase/performance";
import {
  useFirestore,
  useFirebaseApp,
  FirestoreProvider,
  useFirestoreCollectionData,
  AppCheckProvider,
  PerformanceProvider,
  usePerformance,
  AuthProvider,
  useAuth,
  useSigninCheck,
  AnalyticsProvider,
} from "reactfire";
import logo from "./assets/logo.svg";
import "./App.css";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { useState } from "react";

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
 * It works just fine.
 */

function FirestoreAndPerf() {
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

function Main() {
  const auth = useAuth();
  const { status, data: signInCheckResult } = useSigninCheck();
  if (status === "loading") {
    return <Spinner />;
  }
  if (signInCheckResult.signedIn === true) {
    async function signTheUserOut() {
      try {
        await signOut(auth);
      } catch (error) {
        console.error(error);
        return <h3>There was a problem signing out</h3>;
      }
    }
    return (
      <>
        <FirestoreAndPerf />
        <center>
          <button id="signOut" onClick={() => signTheUserOut()}>
            Sign out
          </button>
        </center>
      </>
    );
  } else {
    /**
     * Signs in with Google.
     */
    async function google() {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error(error);
      }
    }
    return (
      <>
        <h1>Please sign in or create an account.</h1>
        <center>
          <button onClick={() => google()}>Sign in with Google</button>
        </center>
      </>
    );
  }
}

function Compy() {
  const [time, setTime] = useState(Date.now());
  setInterval(() => setTime(Date.now()), 1000000000000);
  return <center><h4>Number of milliseconds passed since the Unix Epoch (January 1 1970), {time}</h4></center>;
}

function App() {
  const a = useFirebaseApp();
  const analytics = getAnalytics(a);
  const firestore = getFirestore(a);
  const perf = getPerformance(a);
  const auth = getAuth(a);
  const appCheck = initializeAppCheck(a, {
    provider: new ReCaptchaV3Provider(
      "6Ld2YMEhAAAAANBoXGiFIYlJN_FbQIMygFxO0Uji"
    ),
    isTokenAutoRefreshEnabled: true,
  });
  return (
    <AppCheckProvider sdk={appCheck}>
      <AuthProvider sdk={auth}>
        <AnalyticsProvider sdk={analytics}>
          <PerformanceProvider sdk={perf}>
            <FirestoreProvider sdk={firestore}>
              <Main />
              <Compy />
            </FirestoreProvider>
          </PerformanceProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </AppCheckProvider>
  );
}

export default App;
