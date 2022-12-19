import { useState, useContext } from "react";
import { AppContext } from "../context";
import { InsuranceContext } from "../context/InsuranceContext";
import { USDTContext } from "../context/USDTContext";


const Dashboard = () => {

    const { ethBalance, selectedAccount } = useContext(AppContext)
    const { usdtBalance } = useContext(USDTContext)
    const { packagesEnrolled, claimsMade } = useContext(InsuranceContext)


    const [claims, setClaims] = useState([{
        name: 'Package',
        docsURI: 'docs',
        value: '100 USDT',
        status: 'pending',
        createdAt: new Date().toISOString()
    }])

    const [pkgs, setPkgs] = useState([{
        name: 'Package',
        description: 'docs',
        value: '100 USDT',
        status: 'pending',
        createdAt: new Date().toISOString()
    }])

    const [balance, setBalance] = useState({
        eth: 1.000,
        usdt: 200.01
    })

    return (

        <div id="dashboard">
            
            <div className="intro-area">
                <div className="balance-box">
                    <h3>
                        BNB Balance
                    </h3>
                    <p>
                        {ethBalance}
                    </p>
                </div>
                <div className="balance-box">
                    <h3>
                        USDT Balance
                    </h3>
                    <p>
                        {usdtBalance}
                    </p>
                </div>
            </div>
            <div className="claim-area">
                <h3 className="text-heading">
                    Claims
                </h3>
                <table>
                    <tr>
                        <th>

                        </th>
                        <th>
                            Package Name
                        </th>
                        <th>
                            Documents
                        </th>
                        <th>
                            Amount
                        </th>
                        <th>
                            Verification Status
                        </th>
                        <th>
                            Registration Date
                        </th>
                    </tr>
                    {
                        claimsMade.map((claim, idx) => 
                            <tr key={idx}>
                                <td>
                                    {idx + 1}
                                </td>
                                <td>
                                    {claim.name}
                                </td>
                                <td>
                                    {claim.docsURI}
                                </td>
                                <td>
                                    {claim.value}
                                </td>
                                <td>
                                    {claim.status}
                                </td>
                                <td>
                                    {claim.createdAt}
                                </td>
                            </tr>
                        )
                    }
                </table>
            </div>
            <div className="packages-area">
                <h3 className="text-heading">
                    Packages Enrolled
                </h3>
                <div style={{width: '100%'}}>
                    {
                        packagesEnrolled.map((pkg, idx) => 
                            <div key={idx} className="pkg-item">
                                <div>
                                    <h2>
                                        {pkg.name}
                                    </h2>
                                    <p>
                                        {pkg.description}
                                    </p>
                                </div>
                                <div className="pkg-item-descriptors">
                                    <div>
                                        <p>
                                            Registered at:
                                        </p>
                                        <p>
                                            {pkg.createdAt}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            Valuation:
                                        </p>
                                        <p>
                                            {pkg.value}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            Approval Status:
                                        </p>
                                        <p>
                                            {pkg.status}
                                        </p>
                                    </div>
                                    <button>
                                        Make a Claim
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}


export default Dashboard;