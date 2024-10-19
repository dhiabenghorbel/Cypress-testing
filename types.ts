export interface TopicValue {
    label: string;
    name: string;
  }
  
  export interface Value {
    value: string;
  }
  export interface GpListValue {
    name: string;
    apiLabel: string;
    implemented: boolean;
    topic?: TopicValue;
    technologyName: string;
    portalAccessUrl?: string;
    roleTemplate?: Value;
    label?: string;
  }
  
  export interface GpTopic {
    name: string;
    label: string;
    gps: GpListValue[];
  }
  export interface IUserRole {
    "@category": string;
    "@delegable": string;
    "@delegated": string;
    "@dossierID": string;
    "@label": string;
    "@localization": string;
    "@model": string;
    "@modelLabel": string;
    "@name": string;
    "@parameter": string;
    "@rolStruct": string;
    activities: null | any;
  }