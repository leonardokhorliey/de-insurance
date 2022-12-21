import { useContext, useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import PackageDetail from './components/PackageDetail';
import Profile from './components/Profile';
import PackageList from './components/PackageList';
import { InsuranceContext } from './context/InsuranceContext';
import { AppContext } from './context';
import VerifierRegister from './components/VerifierRegister';

function App() {

  const { packages } = useContext(InsuranceContext);
  const { connectWallet, disconnectWallet, loading, selectedAccount } = useContext(AppContext)
  const location = useLocation();
  const navigator = useNavigate()

  useEffect(() => {
    

    if (!selectedAccount && location.pathname !== '/') {
      
      navigator('/')
      setTimeout(() => {
        alert("Connect Wallet first");
      }, 2000)
      
    }
  }, [])

  const home = 
    <Home packages={packages}/>

  return (<>
    {loading && <div style={{display:'grid', placeItems: 'center', height: '70px', width: '200px', zIndex: '3', position: 'fixed', top: '30px', right: '50px', backgroundColor: 'white', borderRadius: '10px'}}>
        <div>
          <p style={{fontWeight: 'bold', fontSize: '1.25rem'}}>Loading ...</p>
        </div>
    </div>}
    {<Routes>
      <Route path= "/" element = {
        <Layout children={home} connectWallet={connectWallet}/>
      } />
      <Route path= "/profile" element = {
        <Profile disconnectWallet={disconnectWallet}/>
      } />
      <Route path= "/packages/:packageType" element = {
        <PackageDetail />
      } />
      <Route path= "/packages" element = {
        <Layout children={<PackageList packages= {packages}/>} connectWallet={() => connectWallet()}/>
        
      } />
      <Route path= "/verifier/register" element = {
        <Layout 
        children={<VerifierRegister/>} 
        connectWallet={() => connectWallet()}/>
        
      } />
    </Routes>}</>
  );
}

export default App;
