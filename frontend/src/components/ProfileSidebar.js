import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context";

const ProfileSidebar = ({setSelectedSidebarOption, disconnectWallet}) => {

    const sideBarOptions = [
        {
            id: 1,
            key: 'dashboard',
            name: 'Dashboard'
        },
        {
            id: 2,
            key: 'available-packages',
            name: 'Available Packages'
        },
        {
            id: 3,
            key: 'pending-reg',
            name: 'Pending Registrations'
        },
        {
            id: 4,
            key: 'pending-claim',
            name: 'Pending Claims'
        },
        {
            id: 5,
            key: 'admin',
            name: 'Admin Area'
        }
    ]

    const [selectedOption, setSelectedOption] = useState(1);
    const { userType } = useContext(AppContext)
    const [availableSidebar, setAvailableSidebar] = useState(sideBarOptions.slice(0, 2))


    const setSidebarOption = (optionId) => {

        setSelectedOption(optionId);
        const selected = sideBarOptions.filter(opt => opt.id === optionId)[0].key;

        setSelectedSidebarOption(selected);
    }

    useEffect(() => {
        if (userType === 'verifier') {
            setAvailableSidebar(sideBarOptions.slice(2, 4))
            setSidebarOption(3)
        } else if (userType === 'owner') {
            setAvailableSidebar(sideBarOptions.slice(2, 5))
            setSidebarOption(3)
        } else {
            setAvailableSidebar(sideBarOptions.slice(0, 2))
        }
        
    }, [userType])

    return (
        <aside id="sidebar">
            <div className="sidebar-list">
                <div>
                    <h1>
                        De-Insure
                    </h1>
                </div>
                <div className="sidebar-options">

                    {
                        availableSidebar.map(opt => {
                            return <button key ={opt.id} style= {{backgroundColor: selectedOption != opt.id && 'transparent'}} onClick={() => setSidebarOption(opt.id)}>
                                {
                                    opt.key === 'available-packages' ? 
                                    <Link style={{ textDecoration: 'none', fontFamily: 'Montserrat', fontWeight: 500, color: 'white' }}to="/packages">{opt.name}</Link>:
                                    <p>
                                        {opt.name}
                                    </p>
                                }
                                
                            </button>
                        })
                    }

                    
                </div>
                
                <h2 onClick={disconnectWallet}>
                    Sign Out
                </h2>
            </div>
        </aside>
    )
}

export default ProfileSidebar