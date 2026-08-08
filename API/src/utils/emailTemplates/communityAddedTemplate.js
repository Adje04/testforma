export function communityAddedTemplate(userName, communityName, communityLink) {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #D6E1FF; }
        .container { width: 80%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background-color: #094EFF; color: white; padding: 10px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { padding: 20px; text-align: center; }
        .cta-button { display: inline-block; background-color: #FFB800; color: #1a1a1a; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
        .footer { margin-top: 20px; text-align: center; font-size: 14px; color: #555; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>Nouvelle communauté</h1></div>
        <div class="content">
            <p>Bonjour ${userName},</p>
            <p>Vous avez été ajouté(e) à la communauté <strong>${communityName}</strong>.</p>
            <a class="cta-button" href="${communityLink}">Voir la communauté</a>
        </div>
        <div class="footer"><p>L'équipe Foruma</p></div>
    </div>
</body>
</html>`;
}