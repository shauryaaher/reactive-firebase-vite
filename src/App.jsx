import { getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import {
  useFirebaseApp,
  FirestoreProvider,
  AppCheckProvider,
  PerformanceProvider,
  AuthProvider,
  useAuth,
  useSigninCheck,
  AnalyticsProvider,
} from "reactfire";
import "./App.css";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { lazy, Suspense } from "react";
import { Spinner } from "./Spinner.jsx";
const CompyTime = lazy(() => import("./Time.jsx"));
const UserState = lazy(() => import("./UserState.jsx"));
const FirestoreAndPerf = lazy(() => import("./FirestoreAndPerf.jsx"));

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
        <UserState />
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
        console.log("Signed in with Google.");
      } catch (error) {
        console.error(error);
      }
    }
    async function twitter() {
      const provider = new TwitterAuthProvider();
      signInWithPopup(auth, provider)
        .then(() => {
          console.log("Signed in with Twitter.");
        })
        .catch((error) => console.error(error));
    }
    return (
      <>
        <h1>Please sign in or create an account.</h1>
        <center>
          <button onClick={() => google()}>Sign in with Google</button>
          <br />
          <br />
          <button onClick={() => twitter()}>Sign in with Twitter</button>
        </center>
      </>
    );
  }
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
              <Suspense fallback={<span>Loading...</span>}>
                <CompyTime />
              </Suspense>
            </FirestoreProvider>
          </PerformanceProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </AppCheckProvider>
  );
}

export default App;
