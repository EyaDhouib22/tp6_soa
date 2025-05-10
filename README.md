# TP6 : Intégration et Manipulation de Données avec Kafka

Ce projet démontre l'intégration d'Apache Kafka avec une application Node.js pour la production et la consommation de messages. Les messages consommés sont ensuite stockés dans une base de données MongoDB et exposés via une API REST simple construite avec Express.js.

**A.U. : 2024/2025**
**Matière:** SoA et Microservices
**Enseignant :** Dr. Salah Gontara
**Classe:** 4Info

## Objectif(s)

L'objectif principal de ce TP est d'acquérir des compétences pratiques dans :
1.  La gestion des flux de données avec Apache Kafka.
2.  L'intégration de Kafka avec des applications Node.js pour la production et la consommation de messages.
3.  Le stockage des données consommées dans une base de données (MongoDB).
4.  L'exposition de ces données via une API REST.

## Technologies Utilisées

*   **Apache Kafka:** Plateforme de streaming d'événements distribués.
*   **Apache Zookeeper:** Service de coordination pour Kafka.
*   **Node.js:** Environnement d'exécution JavaScript côté serveur.
*   **Kafkajs:** Client Kafka pour Node.js.
*   **MongoDB:** Base de données NoSQL orientée documents.
*   **Mongoose (ou le driver `mongodb`):** Bibliothèque ODM (Object Document Mapper) ou driver pour interagir avec MongoDB depuis Node.js.
*   **Express.js:** Framework web minimaliste pour Node.js, utilisé pour créer l'API REST.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés et configurés sur votre système :

1.  **Node.js et npm:** Téléchargeables depuis le site officiel de Node.js.
2.  **Java Development Kit (JDK):** Nécessaire pour faire fonctionner Kafka et Zookeeper (généralement JDK 8 ou 11+).
3.  **Apache Kafka:** Téléchargez les binaires depuis le site officiel d'Apache Kafka (la version 3.9.0 est spécifiée dans le TP). Extrayez l'archive dans un répertoire de votre choix.
4.  **MongoDB:** Installez MongoDB Community Server. Il est également recommandé d'installer MongoDB Compass pour une gestion facilitée de la base de données.
5.  **Un outil d'extraction d'archives** (comme 7-Zip ou WinRAR sous Windows) pour les fichiers `.tgz` de Kafka.

## Installation et Configuration

Suivez ces étapes pour configurer l'environnement :

1.  **Installation des Prérequis:** Installez Node.js, le JDK, Kafka, et MongoDB comme indiqué dans la section "Prérequis".
2.  **Démarrage de Zookeeper:**
    *   Ouvrez un terminal.
    *   Naviguez vers le répertoire racine de votre installation Kafka.
    *   Exécutez le script de démarrage de Zookeeper (par exemple, `bin/zookeeper-server-start.sh config/zookeeper.properties` sur Linux/macOS ou `bin\windows\zookeeper-server-start.bat config\zookeeper.properties` sur Windows).
3.  **Démarrage du Serveur Kafka:**
    *   Ouvrez un *nouveau* terminal.
    *   Naviguez vers le répertoire racine de votre installation Kafka.
    *   Exécutez le script de démarrage du serveur Kafka (par exemple, `bin/kafka-server-start.sh config/server.properties` sur Linux/macOS ou `bin\windows\kafka-server-start.bat config\server.properties` sur Windows).
4.  **Création du Topic Kafka:**
    *   Ouvrez un *nouveau* terminal (ou utilisez l'un des précédents temporairement).
    *   Naviguez vers le répertoire racine de votre installation Kafka.
    *   Créez un topic nommé `test-topic` (par exemple, `bin/kafka-topics.sh --create --topic test-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1`).
5.  **Configuration du Projet Node.js:**
    *   Créez un nouveau dossier pour votre projet (par exemple, `kafka-node-app`).
    *   Ouvrez un terminal dans ce dossier.
    *   Initialisez un projet Node.js en exécutant `npm init -y`.
    *   Installez les dépendances nécessaires en exécutant `npm install kafkajs mongodb express`.
6.  **Configuration de la Base de Données MongoDB:**
    *   Lancez MongoDB Compass.
    *   Connectez-vous à votre instance MongoDB locale.
    *   Créez une nouvelle base de données (par exemple, `kafka_tp_db`).
    *   Dans cette base de données, créez une nouvelle collection (par exemple, `messages`).

## Structure des Fichiers du Projet Node.js

Le projet Node.js sera typiquement structuré avec les fichiers suivants :

*   `producer.js`: Script Node.js pour produire des messages vers le topic Kafka.
*   `consumer.js`: Script Node.js pour consommer les messages du topic Kafka et les enregistrer dans MongoDB.
*   `api.js`: Script Node.js pour créer un serveur Express.js exposant une API REST pour lire les messages depuis MongoDB.
*   `package.json` et `package-lock.json`: Fichiers de configuration du projet Node.js et de ses dépendances.
*   `node_modules/`: Dossier contenant les dépendances installées.

## Exécution de l'Application

Pour exécuter l'application et tester le flux complet :

1.  **Assurez-vous que Zookeeper et le serveur Kafka sont en cours d'exécution** (voir étapes 2 et 3 de la section "Installation et Configuration").
2.  **Lancer le Producteur de Messages:**
    *   Ouvrez un terminal dans le dossier de votre projet Node.js.
    *   Exécutez la commande : `node producer.js`.
    *   Ce script commencera à envoyer des messages au topic Kafka `test-topic` à intervalle régulier.
3.  **Lancer le Consommateur de Messages:**
    *   Ouvrez un *nouveau* terminal dans le dossier de votre projet Node.js.
    *   Exécutez la commande : `node consumer.js`.
    *   Ce script se connectera au topic Kafka, consommera les messages, les affichera dans la console et les enregistrera dans la collection MongoDB.
4.  **Lancer l'API REST:**
    *   Ouvrez un *nouveau* terminal dans le dossier de votre projet Node.js.
    *   Exécutez la commande : `node api.js`.
    *   Ce script démarrera un serveur web Express.js.
5.  **Tester le Flux Complet:**
    *   Observez les logs dans les terminaux du producteur et du consommateur.
    *   Utilisez MongoDB Compass pour vérifier que les messages sont bien enregistrés dans la collection `messages` de la base de données `kafka_tp_db`.
    *   Ouvrez un navigateur web ou un client API (comme Postman) et accédez à l'URL de l'API pour récupérer les messages (par exemple, `http://localhost:3000/messages`).
