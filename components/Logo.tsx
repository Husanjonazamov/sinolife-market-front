import Image from "next/image";
import Link from "next/link";


<Link href="/" className="flex items-center space-x-2">
  <div className="w-10 h-10 flex items-center justify-center">
    <Image
      src="/images/logo.png"
      alt="SinoLife Logo"
      width={40}
      height={40}
      className="rounded-full object-cover"
    />
  </div>
  <span className="text-2xl font-pacifico text-green-700">SinoLife</span>
</Link>
