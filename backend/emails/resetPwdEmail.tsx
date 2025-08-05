import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Img,
    Text,
    Button,
  } from '@react-email/components';
  
  interface PasswordResetEmailProps {
    prenom: string;
    resetLink: string;
  }
  
  export default function PasswordResetEmail({ prenom, resetLink }: PasswordResetEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>Réinitialisez votre mot de passe</Preview>
        <Body style={main}>
          <Container style={container}>
            <Img src="cid:logoSemiv" alt="Logo Semiv" width="120" style={logo} />
            <Text style={heading}>Récupération de mot de passe</Text>
            <Text>Bonjour, {prenom} !</Text>
            <Text>
              Nous avons reçu une demande de réinitialisation de votre mot de passe.
              Veuillez cliquer sur le bouton ci-dessous pour créer un nouveau mot de passe
              (durée de validité 15 min) :
            </Text>
            <Button style={button} href={resetLink}>
              Réinitialiser le mot de passe
            </Button>
            <Text>
              Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message.
            </Text>
            <Text style={footer}>Merci et à bientôt !</Text>
          </Container>
        </Body>
      </Html>
    );
  }
  
  // Styles
  const main = {
    backgroundColor: '#f6f6f6',
    fontFamily: 'Open Sans, sans-serif',
    padding: '20px',
  };
  
  const container = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
  };
  
  const heading = {
    color: '#f05320',
    fontSize: '24px',
    marginBottom: '20px',
  };
  
  const button = {
    backgroundColor: '#D2DD4C',
    color: '#51377A',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'inline-block',
  };
  
  const footer = {
    marginTop: '30px',
    fontSize: '12px',
    color: '#999999',
    textAlign: 'center' as const,
  };
  
  const logo = {
    marginBottom: '20px',
  };