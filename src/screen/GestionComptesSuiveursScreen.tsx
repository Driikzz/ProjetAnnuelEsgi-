import React, { useState } from 'react';
import '../App.css'; // Assurez-vous que le chemin est correct

interface Suiveur {
  id: number;
  nom: string;
  email: string;
}

const GestionComptesSuiveursScreen: React.FC = () => {
  const [form, setForm] = useState({
    nom: '',
    email: '',
  });

  const [suiveurs, setSuiveurs] = useState<Suiveur[]>([
    { id: 1, nom: 'Suiveur 1', email: 'suiveur1@example.com' },
    { id: 2, nom: 'Suiveur 2', email: 'suiveur2@example.com' },
    // Ajoutez plus de suiveurs ici si nécessaire
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSuiveur: Suiveur = {
      id: suiveurs.length + 1,
      nom: form.nom,
      email: form.email,
    };
    setSuiveurs([...suiveurs, newSuiveur]);
    setForm({ nom: '', email: '' });
  };

  const handleDelete = (id: number) => {
    const updatedSuiveurs = suiveurs.filter((suiveur) => suiveur.id !== id);
    setSuiveurs(updatedSuiveurs);
  };

  return (
    <div className="container">
      <h1>Gestion des Comptes Suiveurs Externes</h1>
      
      <div className="form-container">
        <h2>Formulaire de Création de Compte par Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom :</label>
            <input type="text" id="nom" name="nom" value={form.nom} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <button type="submit">Créer Compte</button>
        </form>
      </div>

      <div className="suiveurs-list">
        <h2>Liste des Comptes Suiveurs Externes</h2>
        <ul>
          {suiveurs.map((suiveur) => (
            <li key={suiveur.id}>
              {suiveur.nom} - {suiveur.email}
              <button onClick={() => handleDelete(suiveur.id)}>Supprimer les Données</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GestionComptesSuiveursScreen;
