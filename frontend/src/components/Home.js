import { Link } from "react-router-dom"
import { FaAngleDoubleRight, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { useState } from "react";
import Packages from "./Packages";
import PackageList from "./PackageList";

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

            <PackageList packages={packages} isHomePage={true}/>
        </>
    )
}


export default Home;