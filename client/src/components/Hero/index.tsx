import HomeBackground from "@/assets/images/HomeBackground.svg";

const Hero = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${HomeBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom center",
        height: "100vh",
      }}
    ></div>
  );
};

export default Hero;
