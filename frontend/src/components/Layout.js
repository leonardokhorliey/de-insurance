import Footer from "./Footer"
import NavBar from "./NavBar"
import { useEffect, useState } from "react"


const Layout = ({children, connectWallet, signedIn, address, balance}) => {

    const [addressTrunc, setAddressTrunc] = useState(`${address.substring(0, 25)}...`)

    useEffect(() => {
        setAddressTrunc(`${address.substring(0, 25)}...`);

    }, [address])

    return (
        <>
            <NavBar address={addressTrunc} balance={balance} signedIn={signedIn} connectWallet = {connectWallet}/>
            {children}
            <Footer />
        </>
    )
}

export default Layout;