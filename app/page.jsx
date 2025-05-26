// app/page.jsx
import React from "react";
import HomeHerobanner from "./components/sections/HomeHerobanner";
import HomeAboutMe from "./components/sections/HomeAboutMe";
import Socials from "./components/Socials";
import SkreddersyddMaleriForm from "./components/sections/SkreddersyddMaleriForm";

const Home = () => {
    return (
        <div className="page-fade-up">
            <HomeHerobanner />
            <HomeAboutMe />
            <Socials id="kontakt" />
            <div className="mt-32"></div>
            <SkreddersyddMaleriForm id="onskeskjema" />
        </div>
    );
};

export default Home;
