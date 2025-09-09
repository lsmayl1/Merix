import * as React from "react";

const Moon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={21}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.752 14.002C18.5632 14.4974 17.2879 14.7517 16 14.75C10.615 14.75 6.25 10.385 6.25 5C6.25 3.67 6.516 2.403 6.998 1.248C5.22147 1.98911 3.70397 3.23935 2.63663 4.84126C1.56928 6.44316 0.999835 8.32508 1 10.25C1 15.635 5.365 20 10.75 20C12.6749 20.0002 14.5568 19.4307 16.1587 18.3634C17.7606 17.296 19.0109 15.7785 19.752 14.002Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Moon;
