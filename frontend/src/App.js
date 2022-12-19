import { useEffect, useState, useContext } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
  const { connectWallet, disconnectWallet } = useContext(AppContext)



  const home = 
    <Home packages={packages}/>

  return (
    <Routes>
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
    </Routes>
  );
}

export default App;
