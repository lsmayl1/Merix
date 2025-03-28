import React from "react";

export const Kart = (prop) => {
  return (
    <svg
      className={prop.className}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.1"
        d="M6.25 20.8333V31.25C6.25 35.1783 6.25 37.1425 7.4704 38.3629C8.69077 39.5833 10.655 39.5833 14.5833 39.5833H35.4167C39.345 39.5833 41.3092 39.5833 42.5296 38.3629C43.75 37.1425 43.75 35.1783 43.75 31.25V20.8333H6.25Z"
        fill="currentColor"
      />
      <path
        d="M7.29175 20.8333H42.7084"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12.5 29.1667H16.6667"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22.9167 29.1667H27.0834"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M6.25 18.75C6.25 14.8216 6.25 12.8574 7.4704 11.6371C8.69077 10.4167 10.655 10.4167 14.5833 10.4167H25H35.4167C39.345 10.4167 41.3092 10.4167 42.5296 11.6371C43.75 12.8574 43.75 14.8216 43.75 18.75V25V31.25C43.75 35.1783 43.75 37.1425 42.5296 38.3629C41.3092 39.5833 39.345 39.5833 35.4167 39.5833H25H14.5833C10.655 39.5833 8.69077 39.5833 7.4704 38.3629C6.25 37.1425 6.25 35.1783 6.25 31.25V25V18.75Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
};
