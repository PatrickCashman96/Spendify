import "./Navbar.css"
export default function Navbar({toggleSidebar}){
    return(
        <div id="navbar">
            <button onClick={toggleSidebar}><img src="/assets/img/logo/burgermenu.png" alt="applogo" /></button>
            <h1>webname name</h1>
            <img src="/assets/img/logo/applogo.png" alt="" />
        </div>
    )
}