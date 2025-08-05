import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-3 bg-white border-t-2 border-black lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-10">
      <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl flex flex-col items-center space-y-3">
        <div className="grid items-center grid-cols-4 gap-8 text-center lg:grid-cols-5">
          <div className="lg:order-1">
            <Link
              href="https://www.semiv-velizy.fr/i/redac/legals"
              className="font-sans text-sm text-opacity-50 transition-all duration-200 rounded text-violet-custom font-bold hover:text-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary focus:text-opacity-100 hover:text-orange-custom"
            >
              {" "}
              Mentions légales{" "}
            </Link>
          </div>

          <div className="lg:order-2">
            <Link
              href="https://www.semiv-velizy.fr/contact.html"
              className="font-sans text-sm text-opacity-50 transition-all duration-200 rounded text-violet-custom font-bold hover:text-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary focus:text-opacity-100 hover:text-orange-custom"
            >
              {" "}
              Contacts{" "}
            </Link>
          </div>

          <div className="lg:order-4">
            <Link
              href="https://www.semiv-velizy.fr/toutes-nos-annonces.html"
              className="font-sans text-sm text-opacity-50 transition-all duration-200 rounded text-violet-custom font-bold hover:text-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary focus:text-opacity-100 hover:text-orange-custom"
            >
              {" "}
              Nos annonces{" "}
            </Link>
          </div>

          <div className="lg:order-5">
            <Link
              href="https://www.semiv-velizy.fr/plan-du-site.html"
              className="font-sans text-sm text-opacity-50 transition-all duration-200 rounded text-violet-custom font-bold hover:text-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary focus:text-opacity-100 hover:text-orange-custom"
            >
              {" "}
              Plan du site{" "}
            </Link>
          </div>
          <div className="lg:order-5">
            <Link
              href="https://ma-boite-immo.com/connexion"
              className="font-sans text-sm text-opacity-50 transition-all duration-200 rounded text-violet-custom font-bold hover:text-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary focus:text-opacity-100 hover:text-orange-custom"
            >
              {" "}
              Mon profil{" "}
            </Link>
          </div>
        </div>
        <div className="lg:order-5">
          <p className="font-sans text-sm text-opacity-50 transition-all duration-200 rounded text-black font-bold hover:text-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary focus:text-opacity-100">
            Copyright © SEMIV {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
