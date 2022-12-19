
import { Link } from "react-router-dom";
import { FaAngleDoubleRight } from "react-icons/fa";
import Packages from "./Packages";


const PackageList = ({packages, isHomePage}) => {


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

                    <Packages packages = {packages}/>
                </div>
            </section>
        
        
    )
}


PackageList.defaultProps = {
    isHomePage: false
}

export default PackageList;