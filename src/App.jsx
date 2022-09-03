import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import { getPerformance, trace } from "firebase/performance";
import file from "./User.jpg";
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
  useUser,
} from "reactfire";
import logo from "./assets/logo.svg";
import "./App.css";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  getAuth,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
} from "firebase/auth";

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
  const { status: s, data: d } = useUser();
  if (s === "loading") {
    return <Spinner />;
  }
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
        <h2 style={{ textAlign: "left" }}>
          Hello, {d.displayName}!
          <img id="user" src={file} />
        </h2>
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
    function signInWithLink() {
      const actionCodeSettings = {
        url: "http://localhost:5173/",
        handleCodeInApp: true,
      };
      const email = document.querySelector("#em").value;
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          console.log("Successfully sent a link");
          self.localStorage.setItem("email", email);
        })
        .catch((error) => console.error(error));
    }
    if (isSignInWithEmailLink(auth, window.location.href) === true) {
      let second = window.localStorage.getItem("email");
      if (!second) {
        email = window.prompt("Please enter your email for confirmation");
      }
      signInWithEmailLink(auth, second, window.location.href)
        .then(() => window.localStorage.removeItem("email"))
        .catch((error) => console.error(error));
    }
    return (
      <>
        <h1>Please sign in or create an account.</h1>
        <center>
          <button onClick={() => google()}>Sign in with Google</button>
          <br />
          <br />
          <span>OR</span>
          <br />
          <br />
          <input id="em" type="email" placeholder="Enter your email..." />
          <br />
          <br />
          <button onClick={() => signInWithLink()}>Send an email link</button>
        </center>
      </>
    );
  }
}

function App() {
  const a = useFirebaseApp();
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
        <PerformanceProvider sdk={perf}>
          <FirestoreProvider sdk={firestore}>
            <Main />
          </FirestoreProvider>
        </PerformanceProvider>
      </AuthProvider>
    </AppCheckProvider>
  );
}

export default App;
