import { useContext, useState } from "react"
import { VerifierContext } from "../context/VerifierContext"
import { Link } from "react-router-dom"

const AdminView = () => {

    const { pendingVerifiers, blacklistVerifier } = useContext(VerifierContext)

    const [claims, setClaims] = useState([{
        address: '0xfffffff',
        docsURI: 'docs',
        contribution: '100 USDT',
        createdAt: new Date().toString()
    }])

    return (
        <div>
            <div>
                <div>
                    <h2>
                        Whitelist verifier
                    </h2>
                    <div>
                        <input type="text" placeholder="Wallet Address" />
                        <button>Whitelist</button>
                    </div>
                </div>
                <div>
                    <h2>
                        Blacklist verifier
                    </h2>
                    <div>
                        <input type="text" placeholder="Wallet Address" />
                        <button>Whitelist</button>
                    </div>
                </div>
            </div>
            <div>
                <h2>
                    Pending Verifier Applications
                </h2>
                <table> 
                    <tr>
                        <th>

                        </th>
                        <th>
                            Wallet Address
                        </th>
                        <th>
                            Document
                        </th>
                        <th>
                            Contribution
                        </th>
                        <th>
                            Registration Date
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                    {
                        pendingVerifiers.map((verifier, idx) => 
                            <tr>
                                <td>
                                    {idx + 1}
                                </td>
                                <td>
                                    {`${verifier.address.substring(0, 10)}...`}
                                </td>
                                <td>
                                    <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 300 }} to= "/">{verifier.docsURI}</Link>
                                </td>
                                <td>
                                    {verifier.contribution}
                                </td>
                                <td>
                                    {verifier.createdAt}
                                </td>
                                <td>
                                    <div id="table-action">
                                        <button>
                                            Verify
                                        </button>
                                        <button>
                                            Decline
                                        </button>
                                    </div>
                                    
                                </td>
                            </tr>
                        )
                    }
                </table>
            </div>
        </div>
    )
}

export default AdminView