// Template dédié à la réinitialisation de mot de passe (lien envoyé par email)
export function resetPasswordTemplate(resetLink) {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de votre mot de passe</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #D6E1FF; }
        .container { width: 80%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        .header { background-color: #094EFF; color: white; padding: 10px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { padding: 20px; text-align: center; }
        .reset-button { display: inline-block; background-color: #FFB800; color: #1a1a1a; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
        .footer { margin-top: 20px; text-align: center; font-size: 14px; color: #555; }
        a { color: #094EFF; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <a class="reset-button" href="${resetLink}">Choisir un nouveau mot de passe</a>
            <p>Ce lien est valide pendant 1 heure.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email — aucune action ne sera effectuée sur votre compte.</p>
        </div>
        <div class="footer">
            <p>Merci,</p>
            <p>L'équipe Foruma</p>
        </div>
    </div>
</body>
</html>`;
}