export interface IDuos {
    idDuo?: number;
    idAlternant: number;
    idTuteur: number;
    idSuiveur: number;
    enterpriseName: string;
    isEnterpriseRecruit: boolean;
    trialPeriodMeeting: boolean;
    midTermMeeting: boolean;
    yearEndMeeting: boolean;
    creationDate?: Date;
  }
export default IDuos;