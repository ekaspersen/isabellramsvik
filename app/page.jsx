import React from "react";
import HomeHerobanner from "./components/sections/HomeHerobanner";
import HomeAboutMe from "./components/sections/HomeAboutMe";
import Socials from "./components/Socials";
import SkreddersyddMaleriForm from "./components/sections/Skreddersyddmaleriform";

const Home = () => {
    return (
        <div>
            <HomeHerobanner />
            <HomeAboutMe />
            <Socials />
            <div className="mt-32"></div>
            <SkreddersyddMaleriForm />
        </div>
    );
};

export default Home;
