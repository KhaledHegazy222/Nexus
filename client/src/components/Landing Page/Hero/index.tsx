import {
  StyledExploreButton,
  StyledHeroBody,
  StyledHeroSubtitle,
  StyledHeroTitle,
} from "./Hero.styled";

const Hero = () => {
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
      <StyledExploreButton variant="contained" color="secondary">
        Explore Courses
      </StyledExploreButton>
    </StyledHeroBody>
  );
};

export default Hero;
