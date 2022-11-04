interface CheckProps extends React.ComponentPropsWithoutRef<"svg"> {}

export const Check: React.FC<CheckProps> = props => (
  <svg
    width={40}
    height={41}
    viewBox="0 0 40 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect y={0.268005} width={40} height={40} rx={20} fill="#129E57" />

    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.994 13.703a.75.75 0 01.07 1.059l-10.5 12a.75.75 0 01-1.094.036l-4.5-4.5a.75.75 0 111.06-1.06l3.934 3.933 9.972-11.397a.75.75 0 011.058-.07z"
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
