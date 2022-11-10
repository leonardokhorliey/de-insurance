import { useState } from "react";
import { Link } from "react-router-dom";

const ProfileSidebar = ({setSelectedSidebarOption}) => {

    const [selectedOption, setSelectedOption] = useState(1);

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


    const setSidebarOption = (optionId) => {

        setSelectedOption(optionId);
        const selected = sideBarOptions.filter(opt => opt.id === optionId)[0].key;

        setSelectedSidebarOption(selected);
    }

    return (
        <aside id="sidebar">
            <div class="sidebar-list">
                <div>
                    <h1>
                        De-Insure
                    </h1>
                </div>
                <div class="sidebar-options">

                    {
                        sideBarOptions.map(opt => {
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
                
                <h2>
                    Sign Out
                </h2>
            </div>
        </aside>
    )
}

export default ProfileSidebar