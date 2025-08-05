import Image from "next/image";
import Link from "next/link";
import BackgroundHome from "../../../../public/homebackground.jpg";
import Logo from "../../../../public/logoSite.png";

export default function TokenExpired() {
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
      <div className="w-10/12 lg:w-2/5 2xl:w-1/5">
        <div className="relative max-w-full">
          <div className="absolute -inset-2">
            <div
              className="w-full h-full mx-auto rounded-3xl opacity-30 blur-lg filter"
              style={{
                background:
                  "linear-gradient(90deg, #000000 0%, #51377a 15%, #533b7d 30%, #db543e 50%, #d0db50 70%, #d1dd52 100%)",
              }}
            ></div>
          </div>

          <div className="relative flex flex-col space-y-9 items-center overflow-hidden bg-white shadow-xl rounded-xl p-9">
            <Image
              src={Logo}
              alt="logo semiv"
              className="w-32 lg:w-64 drop-shadow-2xl"
              priority
            />
            <p className="text-lg lg:text-xl">
              Le lien de réinitialisation a expiré
            </p>
            <Link
              href="/"
              className="flex items-center justify-center w-full px-8 py-4 mt-5 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
