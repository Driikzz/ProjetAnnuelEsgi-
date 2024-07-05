import React, { useState } from 'react';
import IDuos from '../../interfaces/IDuos';

interface MidTermMeetingFormProps {
  duo: IDuos;
  onClose: () => void;
}

const MidTermMeetingForm: React.FC<MidTermMeetingFormProps> = ({ duo, onClose }) => {
  const [form, setForm] = useState({
    studentId: duo.Alternant?.id || '',
    studentName: duo.Alternant?.name || '',
    studentFirstName: duo.Alternant?.lastname || '',
    enterpriseName: duo.enterpriseName || '',
    tutorName: duo.Tuteur?.name || '',
    tutorFirstName: duo.Tuteur?.lastname || '',
    tutorPosition: '',
    studentMissions: '',
    meetingDate: '',
    followUpFormat: 'Présentiel',
    reactivityRating: 0,
    perseveranceRating: 0,
    proactivityRating: 0,
    projectsForSecondSemester: '',
    improvementAxes: '',
    strengths: '',
    thesisSubject: '',
    recruitmentPlans: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prevForm => ({
        ...prevForm,
        [name]: checked
      }));
    } else {
      setForm(prevForm => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form); // Remplacez par la logique de soumission réelle
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ID étudiant:
        <input type="text" name="studentId" value={form.studentId} onChange={handleChange} required />
      </label>
      <label>
        Nom de l'étudiant:
        <input type="text" name="studentName" value={form.studentName} onChange={handleChange} required />
      </label>
      <label>
        Prénom de l'étudiant:
        <input type="text" name="studentFirstName" value={form.studentFirstName} onChange={handleChange} required />
      </label>
      <label>
        Nom de l'entreprise:
        <input type="text" name="enterpriseName" value={form.enterpriseName} onChange={handleChange} required />
      </label>
      <label>
        Nom du tuteur:
        <input type="text" name="tutorName" value={form.tutorName} onChange={handleChange} required />
      </label>
      <label>
        Prénom du tuteur:
        <input type="text" name="tutorFirstName" value={form.tutorFirstName} onChange={handleChange} required />
      </label>
      <label>
        Poste du tuteur:
        <input type="text" name="tutorPosition" value={form.tutorPosition} onChange={handleChange} required />
      </label>
      <label>
        Missions de l'étudiant:
        <textarea name="studentMissions" value={form.studentMissions} onChange={handleChange} required />
      </label>
      <label>
        Date du suivi:
        <input type="date" name="meetingDate" value={form.meetingDate} onChange={handleChange} required />
      </label>
      <label>
        Format du suivi:
        <select name="followUpFormat" value={form.followUpFormat} onChange={handleChange} required>
          <option value="Présentiel">Présentiel</option>
          <option value="Distanciel">Distanciel</option>
        </select>
      </label>
      <label>
        Réactivité:
        <input type="number" name="reactivityRating" value={form.reactivityRating} onChange={handleChange} required />
      </label>
      <label>
        Persévérance:
        <input type="number" name="perseveranceRating" value={form.perseveranceRating} onChange={handleChange} required />
      </label>
      <label>
        Force de proposition:
        <input type="number" name="proactivityRating" value={form.proactivityRating} onChange={handleChange} required />
      </label>
      <label>
        Projets pour le deuxième semestre:
        <textarea name="projectsForSecondSemester" value={form.projectsForSecondSemester} onChange={handleChange} required />
      </label>
      <label>
        Axes d'amélioration:
        <textarea name="improvementAxes" value={form.improvementAxes} onChange={handleChange} required />
      </label>
      <label>
        Points forts:
        <textarea name="strengths" value={form.strengths} onChange={handleChange} required />
      </label>
      <label>
        Sujet de mémoire (si applicable):
        <textarea name="thesisSubject" value={form.thesisSubject} onChange={handleChange} />
      </label>
      <label>
        Plans de recrutement:
        <input type="checkbox" name="recruitmentPlans" checked={form.recruitmentPlans} onChange={handleChange} />
      </label>
      <button type="submit">Soumettre</button>
    </form>
  );
};

export default MidTermMeetingForm;
