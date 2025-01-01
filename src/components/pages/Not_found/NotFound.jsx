import { Link } from "react-router-dom";

export default function Notfound() {
    return(
        <div>
            <h1>Page not found</h1>
            <Link to="/">Go to main page</Link>
        </div>
    )
};