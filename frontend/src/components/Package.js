import { Link } from "react-router-dom";

const Package = ({pkg}) => {

    return (
        <div className="single-package">
            <img src={pkg.img} alt={`${pkg.name} pic`}/>

            <div className="package-description">
                <h1>
                    {pkg.name}
                </h1>
                <p>
                    {pkg.description}
                </p>
                <button id="package-cta">
                    <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300, color: 'white' }} to={`/packages/${pkg.tokenId}`}>See More </Link>
                    
                </button>
            </div>
        </div>
    )
}

export default Package;