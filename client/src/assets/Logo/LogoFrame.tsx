import * as React from "react";

const LogoFrame = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={42} height={43} viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width={42} height={42} rx={10} transform="matrix(1 0 0 -1 0 42.5)" fill="white"/>
    <path d="M37 33V10.5L27.6321 18.1697V18.0973L14.285 5.5H5V37.5L14.285 29.3914V17.5905L21.1658 23.7443L27.6321 18.0973V18.1697V33H37Z" fill="black"/>
    </svg>
  );
};

export default LogoFrame;
