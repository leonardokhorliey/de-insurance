import Package from "./Package"


const Packages = ({packages}) => {

    return (
        <div id="package-list">
            {packages.map((pkg, idx) => {
                return <Package key={idx} pkg={pkg} />
                
            })}
        </div>
        
    )
}

export default Packages;