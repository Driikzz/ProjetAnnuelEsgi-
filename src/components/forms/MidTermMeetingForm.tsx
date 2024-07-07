import React, { useState, useEffect } from 'react';
import IDuos from '../../interfaces/IDuos';
import MeetingService from '../../services/MeetingService';

interface MidTermMeetingFormProps {
  duo: IDuos;
  token: string;
  onClose: () => void;
  meetingData: any; // Ajoutez cette propriété
}

const MidTermMeetingForm: React.FC<MidTermMeetingFormProps> = ({ duo, token, onClose, meetingData }) => {
  const [form, setForm] = useState({
    studentId: duo.Alternant?.id.toString() || '',
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
    recruitmentPlans: false ,
    duoId: duo.idDuo || '' // Assurez-vous que le duoId est inclus
  });

  useEffect(() => {
    if (meetingData) {
      setForm(meetingData);
    }
  }, [meetingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prevForm => ({
        ...prevForm,
        [name]: checked
      }));
    } else if (type === 'number') {
      setForm(prevForm => ({
        ...prevForm,
        [name]: Number(value)
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
      await MeetingService.submitMidTermMeetingForm(form, duo.idDuo!, token);
      onClose();
    } catch (error) {
      console.error('Failed to submit form:', error);
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
        Réactivité:
        <input type="number" name="reactivityRating" value={form.reactivityRating} onChange={handleChange} required />
      </label>
      <label>
        Persévérance:
        <input type="number" name="perseveranceRating" value={form.perseveranceRating} onChange={handleChange} required />
      </label>
      <label>
        Proactivité:
        <input type="number" name="proactivityRating" value={form.proactivityRating} onChange={handleChange} required />
      </label>
      <label>
        Projets pour le second semestre:
        <textarea name="projectsForSecondSemester" value={form.projectsForSecondSemester} onChange={handleChange} required />
      </label>
      <label>
        Axes d'amélioration:
        <textarea name="improvementAxes" value={form.improvementAxes} onChange={handleChange} required />
      </label>
      <label>
        Forces:
        <textarea name="strengths" value={form.strengths} onChange={handleChange} required />
      </label>
      <label>
        Sujet de la thèse:
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
