-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 14 juin 2024 à 06:25
-- Version du serveur : 5.7.40
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pjf`
--

-- --------------------------------------------------------

--
-- Structure de la table `alerte`
--

DROP TABLE IF EXISTS `alerte`;
CREATE TABLE IF NOT EXISTS `alerte` (
  `ID_Alerte` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(50) DEFAULT NULL,
  `Message` text,
  `DateCreation` date DEFAULT NULL,
  `ID_Createur` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Alerte`),
  KEY `ID_Createur` (`ID_Createur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `alternant`
--

DROP TABLE IF EXISTS `alternant`;
CREATE TABLE IF NOT EXISTS `alternant` (
  `ID_Alternant` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(50) DEFAULT NULL,
  `Prenom` varchar(50) DEFAULT NULL,
  `DateDeNaissance` date DEFAULT NULL,
  `Adresse` varchar(100) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Telephone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_Alternant`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `alternant`
--

INSERT INTO `alternant` (`ID_Alternant`, `Nom`, `Prenom`, `DateDeNaissance`, `Adresse`, `Email`, `Telephone`) VALUES
(1, 'Leroy', 'Alice', '1998-04-23', '10 Rue de la Paix, Paris', 'alice.leroy@example.com', '0627272727'),
(2, 'Moreau', 'Lucas', '1997-11-15', '20 Avenue de la Liberté, Lyon', 'lucas.moreau@example.com', '0636363636');

-- --------------------------------------------------------

--
-- Structure de la table `bilan`
--

DROP TABLE IF EXISTS `bilan`;
CREATE TABLE IF NOT EXISTS `bilan` (
  `ID_Bilan` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Alternant` int(11) DEFAULT NULL,
  `Contenu` text,
  `DateSoumission` date DEFAULT NULL,
  PRIMARY KEY (`ID_Bilan`),
  KEY `ID_Alternant` (`ID_Alternant`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `document`
--

DROP TABLE IF EXISTS `document`;
CREATE TABLE IF NOT EXISTS `document` (
  `ID_Document` int(11) NOT NULL AUTO_INCREMENT,
  `Titre` varchar(100) DEFAULT NULL,
  `Description` text,
  `Lien` varchar(255) DEFAULT NULL,
  `DateAjout` date DEFAULT NULL,
  PRIMARY KEY (`ID_Document`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `entreprise`
--

DROP TABLE IF EXISTS `entreprise`;
CREATE TABLE IF NOT EXISTS `entreprise` (
  `ID_Entreprise` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) DEFAULT NULL,
  `StatutRelance` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_Entreprise`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `guide`
--

DROP TABLE IF EXISTS `guide`;
CREATE TABLE IF NOT EXISTS `guide` (
  `ID_Guide` int(11) NOT NULL AUTO_INCREMENT,
  `Titre` varchar(100) DEFAULT NULL,
  `Contenu` text,
  `Type` varchar(50) DEFAULT NULL,
  `DateAjout` date DEFAULT NULL,
  PRIMARY KEY (`ID_Guide`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

DROP TABLE IF EXISTS `notification`;
CREATE TABLE IF NOT EXISTS `notification` (
  `ID_Notification` int(11) NOT NULL AUTO_INCREMENT,
  `Message` text,
  `DateEnvoi` date DEFAULT NULL,
  `ID_Alternant` int(11) DEFAULT NULL,
  `ID_Suiveur` int(11) DEFAULT NULL,
  `ID_Tuteur` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Notification`),
  KEY `ID_Alternant` (`ID_Alternant`),
  KEY `ID_Suiveur` (`ID_Suiveur`),
  KEY `ID_Tuteur` (`ID_Tuteur`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `notification`
--

INSERT INTO `notification` (`ID_Notification`, `Message`, `DateEnvoi`, `ID_Alternant`, `ID_Suiveur`, `ID_Tuteur`) VALUES
(1, 'Rappel : réunion demain à 10h.', '2024-06-12', 1, 1, 1),
(2, 'Nouveau document ajouté pour votre suivi.', '2024-06-13', 2, 2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `planningsuiveur`
--

DROP TABLE IF EXISTS `planningsuiveur`;
CREATE TABLE IF NOT EXISTS `planningsuiveur` (
  `ID_Planning` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Suiveur` int(11) DEFAULT NULL,
  `DateDebut` datetime DEFAULT NULL,
  `DateFin` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_Planning`),
  KEY `ID_Suiveur` (`ID_Suiveur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `rapportsuivi`
--

DROP TABLE IF EXISTS `rapportsuivi`;
CREATE TABLE IF NOT EXISTS `rapportsuivi` (
  `ID_Rapport` int(11) NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `Contenu` text,
  `Statut` varchar(20) DEFAULT NULL,
  `ID_Alternant` int(11) DEFAULT NULL,
  `ID_Suiveur` int(11) DEFAULT NULL,
  `ID_Tuteur` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Rapport`),
  KEY `ID_Alternant` (`ID_Alternant`),
  KEY `ID_Suiveur` (`ID_Suiveur`),
  KEY `ID_Tuteur` (`ID_Tuteur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `rdv`
--

DROP TABLE IF EXISTS `rdv`;
CREATE TABLE IF NOT EXISTS `rdv` (
  `ID_RDV` int(11) NOT NULL AUTO_INCREMENT,
  `Date` datetime DEFAULT NULL,
  `ID_Suiveur` int(11) DEFAULT NULL,
  `ID_Alternant` int(11) DEFAULT NULL,
  `Type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_RDV`),
  KEY `ID_Suiveur` (`ID_Suiveur`),
  KEY `ID_Alternant` (`ID_Alternant`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `relance`
--

DROP TABLE IF EXISTS `relance`;
CREATE TABLE IF NOT EXISTS `relance` (
  `ID_Relance` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Entreprise` int(11) DEFAULT NULL,
  `ID_Suiveur` int(11) DEFAULT NULL,
  `DateRelance` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_Relance`),
  KEY `ID_Entreprise` (`ID_Entreprise`),
  KEY `ID_Suiveur` (`ID_Suiveur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `rgpd`
--

DROP TABLE IF EXISTS `rgpd`;
CREATE TABLE IF NOT EXISTS `rgpd` (
  `ID_RGPD` int(11) NOT NULL AUTO_INCREMENT,
  `Information` text,
  `DateAjout` date DEFAULT NULL,
  PRIMARY KEY (`ID_RGPD`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `suiveur`
--

DROP TABLE IF EXISTS `suiveur`;
CREATE TABLE IF NOT EXISTS `suiveur` (
  `ID_Suiveur` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(50) DEFAULT NULL,
  `Prenom` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Telephone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_Suiveur`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `suiveur`
--

INSERT INTO `suiveur` (`ID_Suiveur`, `Nom`, `Prenom`, `Email`, `Telephone`) VALUES
(1, 'Bernard', 'Paul', 'paul.bernard@example.com', '0608091011'),
(2, 'Durand', 'Sophie', 'sophie.durand@example.com', '0612131415');

-- --------------------------------------------------------

--
-- Structure de la table `tuteurentreprise`
--

DROP TABLE IF EXISTS `tuteurentreprise`;
CREATE TABLE IF NOT EXISTS `tuteurentreprise` (
  `ID_Tuteur` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(50) DEFAULT NULL,
  `Prenom` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Telephone` varchar(20) DEFAULT NULL,
  `Entreprise` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Tuteur`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `tuteurentreprise`
--

INSERT INTO `tuteurentreprise` (`ID_Tuteur`, `Nom`, `Prenom`, `Email`, `Telephone`, `Entreprise`) VALUES
(1, 'Dupont', 'Jean', 'jean.dupont@example.com', '0601020304', 'Entreprise A'),
(2, 'Martin', 'Claire', 'claire.martin@example.com', '0605060708', 'Entreprise B');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
