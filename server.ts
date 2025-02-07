// ✅ Importation des modules nécessaires
import 'zone.js/node'; // ✅ Angular SSR nécessite Zone.js pour la gestion asynchrone
import fastify from 'fastify'; // ✅ Fastify est utilisé comme serveur HTTP performant
import { existsSync, readFileSync } from 'fs'; // ✅ Permet de vérifier et lire des fichiers
import { join } from 'path'; // ✅ Manipulation des chemins de fichiers

// ✅ Importations Angular pour le rendu côté serveur (SSR)
import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

// ✅ Importation statique des composants Angular et de la configuration
import { AppComponent } from './src/app/app.component'; // ✅ Remplace l'import dynamique
import { config } from './src/app/app.config.server'; // ✅ Remplace l'import dynamique

// ✅ Définition des chemins de distribution
const distFolder = join(process.cwd(), 'dist/browser'); // 📂 Dossier contenant le build Angular
const indexHtmlPath = join(distFolder, 'index.html'); // 📄 Fichier HTML de base

// ✅ Lire le fichier HTML pré-rendu, sinon fournir un HTML minimal
const indexHtml = existsSync(indexHtmlPath) 
  ? readFileSync(indexHtmlPath, 'utf-8') 
  : '<html><body><app-root></app-root></body></html>';

// ✅ Création du serveur Fastify
const server = fastify(); // 🚀 Utilisation de Fastify au lieu d'Express pour de meilleures performances

/**
 * 📌 Fonction qui génère la page HTML pour une URL donnée avec Server-Side Rendering (SSR)
 * @param url URL demandée par l'utilisateur
 * @returns HTML généré par Angular SSR
 */
async function getApplicationHtml(url: string) {
  return renderApplication(() => bootstrapApplication(AppComponent, {
    providers: [
      ...config.providers,  // ✅ Injection des services de configuration
      provideServerRendering() // ✅ Activation du rendu côté serveur
    ],
  }), {
    document: indexHtml, // ✅ Utilisation du fichier HTML pré-rendu
    url: url, // ✅ Passage de l'URL pour un rendu SSR correct
  });
}

/**
 * 📌 Route pour gérer toutes les requêtes et retourner le rendu SSR d'Angular
 * @param req Requête entrante
 * @param reply Réponse à envoyer au client
 */
server.get('*', async (req, reply) => {
  try {
    const html = await getApplicationHtml(req.url); // ✅ Générer la page pour l'URL demandée
    reply.type('text/html').send(html); // ✅ Envoyer le HTML au client
  } catch (error) {
    console.error('Erreur serveur:', error);
    reply.status(500).send('Erreur serveur : ' + error); // ✅ Gestion des erreurs serveur
  }
});

/**
 * 📌 Démarrage du serveur sur le port 4000
 */
server.listen({ port: 4000 }, (err, address) => {
  if (err) {
    console.error('Erreur lors du démarrage du serveur:', err);
    process.exit(1);
  }
  console.log(`🚀 Serveur Angular SSR prêt sur ${address}`);
});

export default server;
