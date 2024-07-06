import React, { useState } from 'react';
import MeetingService from '../../services/MeetingService';
import IDuos from '../../interfaces/IDuos';

interface StartOfYearMeetingFormProps {
  duo: IDuos;
  token: string;
  onClose: () => void;
}

const StartOfYearMeetingForm: React.FC<StartOfYearMeetingFormProps> = ({ duo, token, onClose }) => {
  const [form, setForm] = useState({
    duoId: duo.idDuo,
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
    tutorComment: '',
    punctualityRating: 0,
    integrationRating: 0,
    organizationRating: 0,
    communicationRating: 0,
    teamworkRating: 0,
    projectsForFirstSemester: '',
    improvementAxes: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await MeetingService.submitStartOfYearMeetingForm(form, token);
      onClose();
    } catch (error) {
      console.error('Failed to submit start of year meeting form:', error);
    }
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
        Commentaire du tuteur:
        <textarea name="tutorComment" value={form.tutorComment} onChange={handleChange} required />
      </label>
      <label>
        Ponctualité:
        <input type="number" name="punctualityRating" value={form.punctualityRating} onChange={handleChange} required />
      </label>
      <label>
        Capacité d'intégration:
        <input type="number" name="integrationRating" value={form.integrationRating} onChange={handleChange} required />
      </label>
      <label>
        Sens de l'organisation:
        <input type="number" name="organizationRating" value={form.organizationRating} onChange={handleChange} required />
      </label>
      <label>
        Sens de la communication:
        <input type="number" name="communicationRating" value={form.communicationRating} onChange={handleChange} required />
      </label>
      <label>
        Travail en équipe:
        <input type="number" name="teamworkRating" value={form.teamworkRating} onChange={handleChange} required />
      </label>
      <label>
        Projets pour le premier semestre:
        <textarea name="projectsForFirstSemester" value={form.projectsForFirstSemester} onChange={handleChange} required />
      </label>
      <label>
        Axes d'amélioration:
        <textarea name="improvementAxes" value={form.improvementAxes} onChange={handleChange} required />
      </label>
      <button type="submit">Soumettre</button>
    </form>
  );
};

export default StartOfYearMeetingForm;
