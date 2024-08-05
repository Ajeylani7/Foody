import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Nav() {
  // State to keep track of scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  // State to keep track of blur level
  const [blur, setBlur] = useState(0);

  // Effect hook to listen for scroll events
  useEffect(() => {
    // Function to update states based on scroll position
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setBlur(Math.min(window.scrollY / 100, 10));
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup by removing the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  };

  return (
    <nav
      style={{
        maxWidth: "1700px",
        height: "7vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
      className="mt-2 rounded-lg shadow-md"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#FFFFFF",
          opacity: 0.6,
          filter: `blur(${blur}px)`,
          transition: "filter 0.3s ease",
          zIndex: -1,
        }}
      ></div>
      <div className="logo" onClick={scrollToTop}>
        <Image
          src="/gallery/lgf.png"
          alt="Logo"
          width={90}
          height={40}
          objectFit="contain"
          objectPosition="50% 50%"
          className="hover:opacity-60 transition duration-300 cursor-pointer"
        />
      </div>
    </nav>
  );
}
