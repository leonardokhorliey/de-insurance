
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
                    See More
                </button>
            </div>
        </div>
    )
}

export default Package;