import { useState } from "react"
import AdminView from "./AdminView"
import Dashboard from "./Dashboard";
import ProfileSidebar from "./ProfileSidebar";


const Profile = ({address}) => {

    const [currentPageKey, setCurrentPageKey] = useState('dashboard');
    const [address_, setAddress] = useState('0xfffffffffffff')

    const mapping = {
        'admin': <AdminView pendingVerifiers/>,
        'dashboard': <Dashboard balances packagesEnrolled claimsMade address/>
    }

    const setSelectedSidebar = (key) => {
        setCurrentPageKey(key);


    }


    return (


        <div id="profile">
            <ProfileSidebar setSelectedSidebarOption={setSelectedSidebar}/>
            <div class="profile-page">
                <div class="intro-area">
                    <h3 className="text-heading">Hello, chief</h3>
                    <div id="account">
                            
                        <h2>
                            {address_}
                        </h2>
                    </div>
                </div>
                {mapping[currentPageKey]}
            </div>
            
        </div>
    )
}

export default Profile;