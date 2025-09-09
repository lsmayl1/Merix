import * as React from "react";

const Products = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_390_315)">
    <path d="M2.70113 8.6485L15 15.7659L27.2154 8.69028" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 28.3853V15.7521" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.1168 1.74006L4.67894 5.86291C2.99358 6.79613 1.61465 9.13613 1.61465 11.0583V18.9279C1.61465 20.85 2.99358 23.19 4.67894 24.1232L12.1168 28.26C13.7046 29.1375 16.3093 29.1375 17.8971 28.26L25.335 24.1232C27.0204 23.19 28.3993 20.85 28.3993 18.9279V11.0583C28.3993 9.13613 27.0204 6.79613 25.335 5.86291L17.8971 1.72613C16.2954 0.848627 13.7046 0.848627 12.1168 1.74006Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
    <clipPath>
    <rect width={30} height={30} fill="white"/>
    </clipPath>
    </defs>
    </svg>
  );
};

export default Products;
