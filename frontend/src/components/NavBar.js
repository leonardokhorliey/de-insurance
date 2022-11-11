import { Link } from "react-router-dom"



const NavBar = ({address, balance, signedIn, connectWallet}) => {
    


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

                    {signedIn ? <div id="account">
                        
                        <h2>
                            {address}
                        </h2>
                        <p>
                            {`${balance} tBNB`}
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