import { useNavigate } from "react-router-dom";
import {
  StyledExploreButton,
  StyledHeroBody,
  StyledHeroSubtitle,
  StyledHeroTitle,
} from "./Hero.styled";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <StyledHeroBody>
      <StyledHeroTitle variant="h1">
        A New Different Way To Improve Your Skills
      </StyledHeroTitle>
      <StyledHeroSubtitle variant="subtitle1">
        Experience affordable excellence in online learning with our extensive
        selection of high-quality courses, tailored to help you reach your full
        potential at Nexus
      </StyledHeroSubtitle>
      <StyledExploreButton
        variant="contained"
        color="secondary"
        onClick={() => navigate("/explore")}
      >
        Explore Courses
      </StyledExploreButton>
    </StyledHeroBody>
  );
};

export default Hero;
