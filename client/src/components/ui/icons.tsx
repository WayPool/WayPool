import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Icons = {
  // WalletConnect Icon
  walletConnect: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      {...props}
    >
      <path
        d="M169.54 165.16C224.111 111.537 314.09 111.537 368.662 165.16L378.132 174.487C380.494 176.809 380.494 180.633 378.132 182.955L353.613 207.151C352.432 208.312 350.52 208.312 349.338 207.151L336.333 194.333C299.067 157.651 239.135 157.651 201.868 194.333L188.078 207.911C186.896 209.072 184.985 209.072 183.803 207.911L159.284 183.715C156.922 181.393 156.922 177.569 159.284 175.247L169.54 165.16ZM412.218 208.086L433.871 229.423C436.233 231.745 436.233 235.569 433.871 237.891L328.292 342.106C326.929 343.447 324.824 343.447 323.461 342.106C323.461 342.106 323.461 342.106 323.461 342.106L249.993 269.765C249.402 269.185 248.451 269.185 247.86 269.765C247.86 269.765 247.86 269.765 247.86 269.765L174.4 342.106C173.037 343.447 170.931 343.447 169.569 342.106C169.569 342.106 169.569 342.106 169.569 342.106L63.9835 237.882C61.6216 235.56 61.6216 231.737 63.9835 229.415L85.6372 208.077C87 206.736 89.1056 206.736 90.4684 208.077L164.045 280.418C164.636 280.999 165.588 280.999 166.179 280.418C166.179 280.418 166.179 280.418 166.179 280.418L239.63 208.077C240.993 206.736 243.098 206.736 244.461 208.077C244.461 208.077 244.461 208.077 244.461 208.077L317.92 280.418C318.511 280.999 319.463 280.999 320.054 280.418L393.622 208.086C394.985 206.745 397.09 206.745 398.453 208.086L412.218 208.086Z"
        fill="#3B99FC"
      />
    </svg>
  ),
  
  // MetaMask Icon
  metamask: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      {...props}
    >
      <path
        d="M389.269 21.333L285.653 162.261L306.347 93.557L389.269 21.333Z"
        fill="#E2761B"
        stroke="#E2761B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M122.539 21.333L225.456 163.147L205.653 93.557L122.539 21.333Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M339.733 341.045L301.611 411.477L383.253 438.784L407.168 342.315L339.733 341.045Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M104.64 342.315L128.555 438.784L210.197 411.477L172.075 341.045L104.64 342.315Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M203.687 225.557L185.941 266.923L267.008 271.195L263.12 184.192L203.687 225.557Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M308.121 225.557L248.112 183.616L244.799 271.195L325.771 266.923L308.121 225.557Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M210.197 411.477L260.117 383.968L217.109 342.891L210.197 411.477Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M251.691 383.968L301.611 411.477L294.699 342.891L251.691 383.968Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M301.611 411.477L251.691 383.968L255.579 422.016L255.003 437.515L301.611 411.477Z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M210.197 411.477L256.805 437.515L256.325 422.016L260.117 383.968L210.197 411.477Z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M257.289 320.341L215.744 305.515L244.704 289.728L257.289 320.341Z"
        fill="#233447"
        stroke="#233447"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M254.517 320.341L267.104 289.728L296.064 305.515L254.517 320.341Z"
        fill="#233447"
        stroke="#233447"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M210.197 411.477L217.493 341.045L172.075 342.315L210.197 411.477Z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M294.315 341.045L301.611 411.477L339.733 342.315L294.315 341.045Z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M325.771 266.923L244.8 271.195L254.517 320.341L267.104 289.728L296.064 305.515L325.771 266.923Z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M215.744 305.515L244.704 289.728L257.291 320.341L267.008 271.195L185.941 266.923L215.744 305.515Z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M185.941 266.923L217.109 342.891L215.744 305.515L185.941 266.923Z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M296.064 305.515L294.699 342.891L325.771 266.923L296.064 305.515Z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M267.008 271.195L257.291 320.341L269.35 369.525L272.664 295.68L267.008 271.195Z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M185.941 266.923L180.192 290.816L183.504 364.661L194.779 320.341L185.941 266.923Z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M254.517 320.341L242.459 369.525L251.691 383.968L294.699 342.891L296.064 305.515L254.517 320.341Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M215.744 305.515L217.109 342.891L260.117 383.968L269.35 369.525L257.289 320.341L215.744 305.515Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M255.003 437.515L255.579 422.016L251.883 418.901H259.925L256.325 422.016L256.805 437.515L301.611 411.477L294.699 342.891L269.35 369.525L242.459 369.525L217.109 342.891L210.197 411.477L255.003 437.515Z"
        fill="#C0AD9E"
        stroke="#C0AD9E"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M251.691 383.968L269.35 369.525H242.459L260.117 383.968L256.325 422.016L259.925 418.901H251.883L255.579 422.016L251.691 383.968Z"
        fill="#161616"
        stroke="#161616"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M390.635 173.829L404.811 105.705L389.269 21.333L251.691 158.272L308.121 225.557L382.177 250.795L398.56 227.296L391.019 222.059L402.04 211.584L392.768 204.379L403.787 195.669L390.635 173.829Z"
        fill="#763D16"
        stroke="#763D16"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M107.189 105.705L121.365 173.829L108.117 195.669L119.232 204.379L109.867 211.584L120.885 222.059L113.349 227.296L129.637 250.795L203.685 225.557L260.117 158.272L122.539 21.333L107.189 105.705Z"
        fill="#763D16"
        stroke="#763D16"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M382.176 250.795L308.12 225.557L325.771 266.923L294.699 342.891L339.733 342.315H407.168L382.176 250.795Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M203.686 225.557L129.637 250.795L104.64 342.315H172.075L217.109 342.891L185.941 266.923L203.686 225.557Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M308.121 225.557L251.691 158.272L263.12 184.192L244.8 271.195L267.008 271.195L325.771 266.923L308.121 225.557Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M203.687 225.557L185.941 266.923L244.8 271.195L225.6 184.192L237.029 158.272L203.687 225.557Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  
  // Coinbase Icon
  coinbase: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <path 
        d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" 
        fill="#0052FF"
      />
      <path 
        d="M24.0002 9.59961C16.0962 9.59961 9.6001 16.0957 9.6001 23.9997C9.6001 31.9037 16.0962 38.3998 24.0002 38.3998C31.9042 38.3998 38.4003 31.9037 38.4003 23.9997C38.4003 16.0957 31.9042 9.59961 24.0002 9.59961ZM17.3346 27.9683C15.7266 27.9683 14.4314 26.6731 14.4314 25.0651C14.4314 23.4571 15.7266 22.1619 17.3346 22.1619C18.9426 22.1619 20.2378 23.4571 20.2378 25.0651C20.2378 26.6731 18.9426 27.9683 17.3346 27.9683ZM30.6659 27.9683C29.0579 27.9683 27.7627 26.6731 27.7627 25.0651C27.7627 23.4571 29.0579 22.1619 30.6659 22.1619C32.2739 22.1619 33.5691 23.4571 33.5691 25.0651C33.5691 26.6731 32.2739 27.9683 30.6659 27.9683Z" 
        fill="white"
      />
    </svg>
  ),

  // Custom Wallet Icon
  wallet: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" />
      <path d="M20 12v4H6a2 2 0 0 0 0 4h12v-4" />
      <path d="M20 8v4h-2a2 2 0 1 1 0-4h2z" />
    </svg>
  )
};