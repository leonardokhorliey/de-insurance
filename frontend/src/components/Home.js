import { Link } from "react-router-dom"
import { FaAngleDoubleRight, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { useState } from "react";
import Packages from "./Packages";

const Home = ({packages}) => {

    return (
        <>
            <section id= "top-banner">

                <div id="landing-text">
                    <h1>
                        Get covered for what may become ... this time on the Chain!
                    </h1>

                </div>
                <div class="floating-box">
                    <FaQuoteLeft />
                    <em>
                        De-Insure provides a valuable pool of verifiers, to ensure validity of Insurance claims.

                    </em>
                    <FaQuoteRight />
                </div>
            </section>

            <section id="packages">
                <div>
                    <div id="packages-header">
                        <h2>
                            Available Packages
                        </h2>
                        <button>
                            <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300, color: 'white' }} to="/packages">See all <FaAngleDoubleRight/></Link>
                        </button>
                    </div>

                    <Packages packages = {packages}/>
                </div>
            </section>
        </>
    )
}


export default Home;