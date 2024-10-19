interface IGPPath {
  topic: string;
  name: string;
}

export interface IDataItemSearch {
  name: string;
  type?: string | "blob" | "date";
}
interface IDataSearch {
  dataSection: string;
  dataItem: IDataItemSearch;
}

export interface IGPConfig {
  id: string;
  menuPath: IGPPath;
  dataToTypeEmployee?: any;
  dataToTypeManager?: any;
  dataSearch?: IDataSearch[];
  dataSearchTasks?: IDataSearch[];
  dataSearchEmployee?: IDataSearch[];
  dataSearchManager?: IDataSearch[];
}
