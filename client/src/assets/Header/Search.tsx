import * as React from "react";

const Search = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M21 21L15.803 15.803M15.803 15.803C17.2096 14.3964 17.9998 12.4887 17.9998 10.4995C17.9998 8.51031 17.2096 6.60258 15.803 5.196C14.3964 3.78943 12.4887 2.99922 10.4995 2.99922C8.51031 2.99922 6.60258 3.78943 5.196 5.196C3.78943 6.60258 2.99922 8.51031 2.99922 10.4995C2.99922 12.4887 3.78943 14.3964 5.196 15.803C6.60258 17.2096 8.51031 17.9998 10.4995 17.9998C12.4887 17.9998 14.3964 17.2096 15.803 15.803Z" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default Search;
