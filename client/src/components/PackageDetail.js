import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import FileUploads from './FileUploads';
import PaymentModal from './PaymentModal';
import { InsuranceContext } from '../context/InsuranceContext';
import { AppContext } from '../context';
import { USDTContext } from '../context/USDTContext';
import { TokenContext } from '../context/TokenContext';

const PackageDetail = () => {

    const {packageType} = useParams();
    const [paymentSet, setPaymentSet] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [amount, setAmount] = useState('');
    const [docsURI, setDocsURI] = useState();
    const [paymentAction, setPaymentAction] = useState('');
    const { getEnrolmentStatus, registerForInsurance, makeClaim, payPremium } = useContext(InsuranceContext)
    const { packages } = useContext(TokenContext)
    const { selectedAccount } = useContext(AppContext)
    const { setApprovalDone } = useContext(USDTContext)


    console.log(packageType);

    const k = {
        id: 4,
        name: 'Embrace Education',
        description: 'It\'s hard in every continent. Do your own on us.',
        img: ""
    }

    const [pkg, setPkg] = useState({
        id: 4,
        name: 'Embrace Education',
        description: 'It\'s hard in every continent. Do your own on us.',
        img: ""
    });

    const getEnrolment = async () => {
        const isEnrolled = await getEnrolmentStatus(selectedAccount, packageType)

        setIsEnrolled(isEnrolled);
    }

    const makePayment = () => {
        setPaymentSet(true);
        setPaymentAction('premium')
    }

    const setUploadedDocsURI = (uri, value) => {
        setApprovalDone(false)
        setAmount(value);
        setDocsURI(uri)
        setPaymentSet(true);
        setPaymentAction(isEnrolled ? 'claim' : 'register');
    }

    const doPayment = async (value) => {
        switch (paymentAction) {
            case 'premium':
                await payPremium(value, packageType);
                break;

            case 'claim':
                await makeClaim(docsURI, value, packageType)
                break

            case 'register':
                await registerForInsurance(docsURI, packageType, value);
                break;

            default:
                return;
        }
    }


    useEffect(() => {
        
        setPkg(packages.filter(pkg => pkg.tokenId === packageType)[0]);
        getEnrolment()
    }, [packages, packageType])
    

    return (
        <>
        {paymentSet && <PaymentModal amount={amount} makePayment={doPayment} closeModal={()=> setPaymentSet(false)} />}
        <Layout children =
        {<div id="package-detail">
        
        {isEnrolled && <div id="notify-tag">
            <p>You have registered for this package</p>
        </div>}
        <section id="detail-area">
            {!pkg ? <div>
                <img src={k.img} alt={`${k.name} pic`}/>
                <div>
                    <h1>
                        {k.name}
                    </h1>

                    <p>
                        {k.description}
                    </p>
                </div>
            </div>: <div>
                <img src={pkg.img} alt={`${pkg.name} pic`}/>
                <div class="pkg-description">
                    <h1>
                        {pkg.name}
                    </h1>

                    <p>
                        {pkg.description}
                    </p>

                    {isEnrolled && <button onClick={makePayment}>
                        Pay Monthly Premium
                    </button>}
                </div>
            </div>}
        </section>
        
        <FileUploads setUploadedDocsURI = {setUploadedDocsURI} packageType={packageType} page={isEnrolled ? 'claim': 'register'}/>
    </div>} />
        
    </>)

}

PackageDetail.defaultProps = {
    isEnrolled: true
}


export default PackageDetail;