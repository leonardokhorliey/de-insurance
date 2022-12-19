import { useState, useContext } from "react";
import { InsuranceContext } from "../context/InsuranceContext";

const PendingClaims = () => {

    const { pendingClaims } = useContext(InsuranceContext)

    return (

        <div id="dashboard">
            <div className="claim-area">
                <h3 className="text-heading">
                    Pending Claims
                </h3>
                <table>
                    <tr>
                        <th>
                            S/N
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
                            Token URI
                        </th>
                        <th>
                            Registration Date
                        </th>
                    </tr>
                    {
                        pendingClaims.map((claim, idx) => 
                            <tr key={idx}>
                                <td>
                                    {idx + 1}
                                </td>
                                <td>
                                    {claim.name}
                                </td>
                                <td>
                                    {claim.docsUri}
                                </td>
                                <td>
                                    {claim.amount}
                                </td>
                                <td>
                                    {claim.tokenUri}
                                </td>
                                <td>
                                    {new Date(claim.createdAt).toDateString()}
                                </td>
                            </tr>
                        )
                    }
                </table>
            </div>
            
        </div>
    )
}


export default PendingClaims;