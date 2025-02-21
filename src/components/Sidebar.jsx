import { Link } from "react-router-dom"
import "./Sidebar.css"
export default function Sidebar(props){
    return(
        <div id="sidebar" className={`${props.isOpen ? "open": ""}`}>
            <Link to="/" onClick={props.toggleSidebar}>
                <h2>Home</h2>
            </Link>

            <Link to="/expenseTrack" onClick={props.toggleSidebar}>
                <h2>Expense</h2>
            </Link>

            <Link to="/incomeTrack" onClick={props.toggleSidebar}>
                <h2>Income</h2>
            </Link>

            <Link to="/user" onClick={props.toggleSidebar}>
                <h2>Logins</h2>
            </Link>
        </div>
    )
}