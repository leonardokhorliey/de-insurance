import { useEffect, useState } from "react"
import AdminView from "./AdminView"
import Dashboard from "./Dashboard";
import ProfileSidebar from "./ProfileSidebar";


const Profile = ({address}) => {

    const [currentPageKey, setCurrentPageKey] = useState('dashboard');
    const [address_, setAddress] = useState('')

    const mapping = {
        'admin': <AdminView pendingVerifiers/>,
        'dashboard': <Dashboard balances packagesEnrolled claimsMade address= {address_}/>
    }

    const setSelectedSidebar = (key) => {
        setCurrentPageKey(key);


    }

    useEffect(() => {
        setAddress(`${address.substring(0, 25)}...`);
    }, [address])


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