import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import { InsuranceContext } from "../context/InsuranceContext";

const ApproveModal = ({closeModal, action, entityId}) => {

    const [amount, setAmount] = useState('0.01');

    const { verifyRegistration, verifyClaim } = useContext(InsuranceContext)

    const handleVerify = async () => {
        if (action === 'verify-claim') {
            await verifyClaim(entityId);
        } else if (action === 'verify-reg') {
            await verifyRegistration(entityId);
        } else {
            alert("Invalid action type.")
        }
        
    }


    return (
        <div id="modal-background">
            <div id="modal">
            <div className="cancel"><p onClick={closeModal}>x</p></div>
            <div className="register-form">
                {action === 'verify-reg' && <div className="form-area">
                    <label>
                        Suggest Valuation for item
                    </label>
                    <input type="number" value={amount}  onChange={(e) => {
                            setAmount(e.target.value);
                        }}/>
                </div>}
                
                <button onClick={handleVerify}>
                    Verify Registration
                </button>
            </div>

            </div>
        </div>
        
    )
}

export default ApproveModal