import Package from "./Package"


const Packages = ({packages}) => {

    return (
        <div id="package-list">
            {packages.map(pkg => {
                return <Package pkg={pkg} />
                
            })}
        </div>
        
    )
}

export default Packages;