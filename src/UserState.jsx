import { useUser } from "reactfire";
import { Spinner } from "./Spinner.jsx";

const UserState = () => {
  const { status, data } = useUser();
  if (status === "loading") {
    return <Spinner />;
  } else if (status === "error") {
    return (
      <h3 className="class">There was an error fetching your user data</h3>
    );
  } else {
    return <h3>Hello, {data.displayName}.</h3>;
  }
}

export default UserState;
