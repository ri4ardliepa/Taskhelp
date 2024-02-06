import React from 'react'
import TsiLogo from "../components/TsiLogo/TsiLogo";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import StartSubscription from "../components/StartSubscription/StartSubscription";
import Header from "../components/Header/Header";
import FeaturedSection from "../components/FeaturedSection/FeaturedSection";
import Residencies from "../components/Residencies/Residencies";
import Value from "../components/Value/Value";


const Website = () => {
  return (
    <div className="App">
    <div>
      <div className="white-gradient" />
      <FeaturedSection />
    </div>
    <TsiLogo />
    <Residencies/>
    <Value/>
    <Contact/>
    <StartSubscription/>
  </div>
  )
}

export default Website