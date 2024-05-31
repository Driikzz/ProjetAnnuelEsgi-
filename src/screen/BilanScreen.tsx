import React, { useState } from 'react';
import '../App.css'; // Assurez-vous que le chemin est correct

const BilanScreen: React.FC = () => {
  const [form, setForm] = useState({
    nom: '',
    formation: '',
    entreprise: '',
    bilan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  const handleDownload = () => {
    // Fonction pour télécharger le document de bilan
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(form, null, 2)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "bilan.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="container">
      <h1>Bilan de Fin d'Année</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom">Nom :</label>
          <input type="text" id="nom" name="nom" value={form.nom} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="formation">Formation :</label>
          <input type="text" id="formation" name="formation" value={form.formation} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="entreprise">Entreprise :</label>
          <input type="text" id="entreprise" name="entreprise" value={form.entreprise} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="bilan">Bilan :</label>
          <textarea id="bilan" name="bilan" value={form.bilan} onChange={handleChange}></textarea>
        </div>
        <div className="button-group">
          <button type="button" onClick={handleDownload}>Télécharger</button>
          <button type="submit">Soumettre</button>
        </div>
      </form>
    </div>
  );
};

export default BilanScreen;
