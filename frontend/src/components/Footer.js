import { Link } from "react-router-dom"


const Footer = () => {


    return (
        <footer>

            <div>
                <h1>
                    De-Insure
                </h1>

                <div>
                    <div>
                        <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300, color: 'white' }} to="/about">About De-Insure</Link>
                        <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300, color: 'white' }} to="/docs">Docs</Link>
                    </div>
                    <div>
                        <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300, color: 'white' }} to="/verifier/register">Become a verifier</Link>
                        <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300, color: 'white' }} to="https://github.com/leonardokhorliey/de-insurance">Source Code</Link>
                    </div>
                </div>
            </div>

            <div id="copyright">
                <p>Copyright 2022. De-Insure</p>
            </div>
        </footer>
    )
}

export default Footer;