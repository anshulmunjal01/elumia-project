// frontend/src/components/common/AnimatedBackground.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
  25% { transform: translateY(-10px) translateX(5px) scale(1.05); opacity: 0.9; }
  50% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
  75% { transform: translateY(10px) translateX(-5px) scale(0.95); opacity: 0.7; }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
`;

const BgElement = styled.div`
  position: absolute;
  background: radial-gradient(circle at center,
    ${({ theme }) => theme.buttonPrimaryBg} 0%,
    ${({ theme }) => theme.background} 70%
  );
  border-radius: 50%;
  opacity: 0.8;
  filter: blur(80px);
  animation: ${float} infinite ease-in-out;
  z-index: 0;
`;

const ElementOne = styled(BgElement)`
  width: 200px;
  height: 200px;
  top: 10%;
  left: 5%;
  animation-duration: 15s;
  animation-delay: 0s;
`;

const ElementTwo = styled(BgElement)`
  width: 150px;
  height: 150px;
  bottom: 15%;
  right: 10%;
  animation-duration: 18s;
  animation-delay: -2s;
`;

const ElementThree = styled(BgElement)`
  width: 180px;
  height: 180px;
  top: 30%;
  right: 20%;
  animation-duration: 17s;
  animation-delay: -5s;
`;

const AnimatedBackground = ({ theme }) => {
  return (
    <>
      <ElementOne theme={theme} />
      <ElementTwo theme={theme} />
      <ElementThree theme={theme} />
    </>
  );
};

export default AnimatedBackground;