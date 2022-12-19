
import { Link } from "react-router-dom";
import { FaAngleDoubleRight } from "react-icons/fa";
import Packages from "./Packages";
import { useContext } from "react";
import { InsuranceContext } from "../context/InsuranceContext";
import { TokenContext } from "../context/TokenContext";


const PackageList = ({isHomePage}) => {

    const { packages } = useContext(TokenContext);


    return (
            <section id="packages" style={{minHeight: "100vh"}}>
                <div>
                    <div id="packages-header">
                        <h2>
                            Available Packages
                        </h2>
                        {isHomePage && <button>
                            <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300, color: 'white' }} to="/packages">See all <FaAngleDoubleRight/></Link>
                        </button>}
                    </div>

                    <Packages />
                </div>
            </section>
        
        
    )
}


PackageList.defaultProps = {
    isHomePage: false
}

export default PackageList;