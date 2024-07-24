"use client";

import React from "react";
import Footer from "@/components/Footer";
import Welcome from "@/components/WelcomeScreen";

const Home: React.FC = () => {
  return (
    <main>
      <Welcome />
      <Footer />
    </main>
  );
};

export default Home;
