import { Html, Head, Preview, Body, Container, Img, Section, Text, Link } from "@react-email/components";

export default function WelcomeEmail({ prenom, email, password }: { prenom: string; email: string; password: string }) {
  return (
    <Html>
      <Head />
      <Preview>Votre compte a été créé avec succès</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src="cid:logoSemiv" alt="Logo Semiv" style={{ maxWidth: "150px", marginBottom: "20px" }} />

          <Section>
            <Text style={title}>Bienvenue, {prenom} !</Text>
            <Text>Votre compte a été créé avec succès. Voici vos informations de connexion :</Text>
            
            <ul style={ul}>
              <li style={li}><strong>Identifiant :</strong> {email}</li>
              <li style={li}><strong>Mot de passe :</strong> {password}</li>
            </ul>

            <Text>Connectez-vous dès maintenant pour commencer à utiliser notre service.</Text>

            <Link style={button} href="https://extranet-copro-syndic.semiv-velizy.fr/">
              Se connecter
            </Link>

            <Text style={footer}>Merci et à bientôt !</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---
const main = {
  backgroundColor: "#f6f6f6",
  padding: "20px",
  fontFamily: "'Open Sans', sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
};

const title = {
  color: "#f05320",
  fontSize: "24px",
  marginBottom: "20px",
  borderBottom: "1px solid #cccccc",
  paddingBottom: "10px",
};

const ul = {
  listStyleType: "none",
  padding: 0,
  marginBottom: "20px",
};

const li = {
  marginBottom: "10px",
};

const button = {
  display: "inline-block",
  backgroundColor: "#D2DD4C",
  color: "#51377A",
  padding: "10px 20px",
  textDecoration: "none",
  borderRadius: "5px",
  fontWeight: "bold",
};

const footer = {
  marginTop: "30px",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#999999",
};