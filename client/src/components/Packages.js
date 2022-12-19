import { useContext } from "react"
import { TokenContext } from "../context/TokenContext"
import Package from "./Package"


const Packages = () => {

    const { packages } = useContext(TokenContext)

    console.log(packages);

    return (
        <div id="package-list">
            {packages.map((pkg, idx) => {
                return <Package key={idx} pkg={pkg} />
                
            })}
        </div>
        
    )
}

export default Packages;