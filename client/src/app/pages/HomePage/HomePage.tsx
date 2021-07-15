import "./HomePage.css";
import Button from "../../components/Button";
import { RouteComponentProps, Link } from "@reach/router";

function HomePage(props: RouteComponentProps) {
  return (
    <div className={"HomePage"}>
      <div>
        <h1>Video Conference</h1>
        <Link to="/deviceDiscovery">
          <Button>Start</Button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
