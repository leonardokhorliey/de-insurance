import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import { USDTContext } from "../context/USDTContext";

const PaymentModal = ({amount, makePayment, closeModal}) => {

    const [amountToPay, setAmountToPay] = useState(amount);

    const { approveContractForAmount, approvalDone } = useContext(USDTContext);
    const { contractAddresses } = useContext(AppContext)



    return (
        <div id="modal-background">
            <div id="modal">
            <div className="cancel"><p onClick={closeModal}>x</p></div>
            <div className="register-form">
                <div className="form-area">
                    {!approvalDone && <label>
                        Set amount to Pay
                    </label>}
                    {!approvalDone && <input type="number" value={amountToPay}  onChange={(e) => {
                            setAmountToPay(e.target.value);
                        }}/>}
                </div>
                {!approvalDone && <button onClick={() => approveContractForAmount(contractAddresses.insuranceContract, amountToPay)}>
                    Approve {amountToPay} StableCoins
                </button>}
                {approvalDone && <button onClick={() => makePayment(amountToPay)}>
                    Pay {amountToPay} StableCoins
                </button>}
            </div>

            </div>
        </div>
        
    )
}

export default PaymentModal