// src/interfaces/IMeetings.ts

export interface ICommonMeetingInfo {
    studentId: string;
    studentName: string;
    studentFirstName: string;
    enterpriseName: string;
    tutorName: string;
    tutorFirstName: string;
    tutorPosition: string;
    studentMissions: string;
    meetingDate: string;
    followUpFormat: 'Présentiel' | 'Distanciel';
  }
  
  export interface IStartOfYearMeeting extends ICommonMeetingInfo {
    tutorComment: string;
    punctualityRating: number;
    integrationRating: number;
    organizationRating: number;
    communicationRating: number;
    teamworkRating: number;
    projectsForFirstSemester: string;
    improvementAxes: string;
  }
  
  export interface IMidTermMeeting extends ICommonMeetingInfo {
    reactivityRating: number;
    perseveranceRating: number;
    proactivityRating: number;
    projectsForSecondSemester: string;
    improvementAxes: string;
    strengths: string;
    thesisSubject?: string;
    recruitmentPlans: boolean;
  }
  
  export interface IEndOfYearMeeting extends ICommonMeetingInfo {
    projectsForNextYear: string;
    improvementAxes: string;
    strengths: string;
    thesisSubject?: string;
    recruitmentPlans: boolean;
    continuationOfStudies: boolean;
    followUpComment: string;
  }
  