import FileUploads from './FileUploads';
import PaymentModal from './PaymentModal';
import Layout from './Layout';
import { useContext, useState } from 'react';
import { VerifierContext } from '../context/VerifierContext';
import { USDTContext } from '../context/USDTContext';

const VerifierRegister = () => {

    const { registerAsVerifier } = useContext(VerifierContext)
    const { setApprovalDone } = useContext(USDTContext)

    const [paymentSet, setPaymentSet] = useState(false);
    const [amount, setAmount] = useState(0);
    const [docsURI, setDocsURI] = useState()

    const startReg = (uri, value) => {
        setApprovalDone(false)
        setAmount(value);
        setDocsURI(uri)
        setPaymentSet(true);
    }

    return (<>
        {paymentSet && <PaymentModal amount={amount} makePayment={(value) => registerAsVerifier(docsURI, value)} closeModal={()=> setPaymentSet(false)} />}
        <div style={{paddingTop: "100px"}}>
            <FileUploads setUploadedDocsURI = {startReg} page={'verifier'}/>
        </div>
        
    </>)
}

export default VerifierRegister;