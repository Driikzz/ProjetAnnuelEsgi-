export interface IDuos {
    Alternant? : any;
    Tuteur? : any;
    Suiveur? : any;
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