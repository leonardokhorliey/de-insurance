import { Link } from "react-router-dom"
import { useContext } from "react";
import { AppContext } from "../context";



const NavBar = () => {
    const { selectedAccount, ethBalance, connectWallet } = useContext(AppContext);


    return (
        <header>
            <div>
                <h1 id="logo-text">
                    <Link style={{ textDecoration: 'none', fontFamily: 'Raleway', fontWeight: 800 }} to="/">
                        
                            De-Insure
                    
                    </Link>
                </h1>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300 }} to= "/">Home</Link>
                            </li>
                            <li>
                                <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300 }}to= "/about">About</Link>
                            </li>

                            <li>
                                <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300 }}to= "/profile">Profile</Link>
                            </li>
                        </ul>

                    </nav>

                    {selectedAccount ? <div id="account">
                        
                        <h2>
                            {`${selectedAccount.substring(0, 25)}...`}
                        </h2>
                        <p>
                            {`${ethBalance} tBNB`}
                        </p>
                    </div>: 

                    <button id="account" onClick={connectWallet} style={{cursor: 'pointer', width: '150px'}}>Connect Wallet</button>}
                </div>
                
            </div>
            
            
        </header>
    )
}

NavBar.defaultProps = {
    signedIn: false
}

export default NavBar;