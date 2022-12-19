import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context";
import { InsuranceContext } from "../context/InsuranceContext";
import { USDTContext } from "../context/USDTContext";
import AdminView from "./AdminView"
import Dashboard from "./Dashboard";
import PendingClaims from "./PendingClaims";
import PendingRegs from "./PendingRegs";
import ProfileSidebar from "./ProfileSidebar";


const Profile = () => {

    const [currentPageKey, setCurrentPageKey] = useState('dashboard');
    const { disconnectWallet, ethBalance, selectedAccount } = useContext(AppContext)


    const mapping = {
        'admin': <AdminView pendingVerifiers/>,
        'dashboard': <Dashboard address= {selectedAccount}/>,
        'pending-reg': <PendingRegs />,
        'pending-claim': <PendingClaims />
    }

    const setSelectedSidebar = (key) => {
        setCurrentPageKey(key);


    }


    return (


        <div id="profile">
            <ProfileSidebar setSelectedSidebarOption={setSelectedSidebar} disconnectWallet={disconnectWallet}/>
            <div className="profile-page">
                <div className="intro-area">
                    <h3 className="text-heading">Hello, chief</h3>
                    <div id="account">
                            
                        <h2>
                            {`${selectedAccount.substring(0, 20)}...`}
                        </h2>
                    </div>
                </div>
                {mapping[currentPageKey]}
            </div>
            
        </div>
    )
}

export default Profile;