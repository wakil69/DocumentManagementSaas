import Image from "next/image";
import FirstLoginForm from "./FirstLoginForm/FirstLoginForm";
import BackgroundHome from "../../../../public/homebackground.jpg";

export default function FirstLogin() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 h-screen flex justify-center items-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src={BackgroundHome}
          alt="Background semiv"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-white opacity-50 -z-10"></div>

      <FirstLoginForm />
    </section>
  );
}
