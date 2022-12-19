import { useState, useContext } from "react";
import { InsuranceContext } from "../context/InsuranceContext";

const PendingRegs = () => {
    const { pendingRegs } = useContext(InsuranceContext)

    return (

        <div id="dashboard">
            <div className="claim-area">
                <h3 className="text-heading">
                    Pending Registrations
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
                            Proposed Valuation
                        </th>
                        <th>
                            Token URI
                        </th>
                        <th>
                            Registration Date
                        </th>
                    </tr>
                    {
                        pendingRegs.map((reg, idx) => 
                            <tr key={idx}>
                                <td>
                                    {idx + 1}
                                </td>
                                <td>
                                    {reg.name}
                                </td>
                                <td>
                                    {reg.docsUri}
                                </td>
                                <td>
                                    {reg.valuationAmount}
                                </td>
                                <td>
                                    {reg.tokenUri}
                                </td>
                                <td>
                                    {new Date(reg.createdAt).toDateString()}
                                </td>
                            </tr>
                        )
                    }
                </table>
            </div>
            
        </div>
    )
}


export default PendingRegs;