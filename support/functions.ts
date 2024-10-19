import { isEmpty } from "lodash";
import { asArray } from "../../src/app/infrastructure/processing/general/asArray";
import { GpListValue, GpTopic } from "../types";
import cyconstants from "./cyconstants";
import { IDataItemSearch } from "./interfaces";

export function replaceStrageChars(chars: any) {
  if (chars && typeof chars === "string")
    return chars
      .toLowerCase()
      .replace(/[îï]/g, "i")
      .replace(/[àâä]/g, "a")
      .replace(/[ôö]/g, "o")
      .replace(/[éèêë]/g, "e")
      .replace(/ç/g, "c");
  else return "";
}

export function removeExtraSpaces(inputString: string) {
  return inputString.replace(/\s+/g, " ");
}

export function filterDocumentsByBroadcast(list: any[], broadcast: string, type: string, category: string) {
  let arr: any[] = [];
  list.forEach(element => {
    for (let broadcasts in element["broadcast"]) {
      if (!isEmpty(element["broadcast"][broadcasts]["page"])) {
        if (type === "NEW" || type === "INF" || type === "LST") {
          if (
            replaceStrageChars(element["broadcast"][broadcasts]["page"]).indexOf(replaceStrageChars(broadcast)) > -1 &&
            replaceStrageChars(element["broadcast"][broadcasts]["page"]).indexOf(replaceStrageChars(type)) > -1 &&
            replaceStrageChars(element["broadcast"][broadcasts]["page"]).indexOf(replaceStrageChars(category === "SSEMP" ? "employee" : "manager")) > -1
          ) {
            arr.push(element);
          }
        }
        if (type === "HRR" || type === "SLT") {
          if (
            replaceStrageChars(element["broadcast"][broadcasts]["page"]).indexOf(replaceStrageChars(broadcast)) > -1 &&
            replaceStrageChars(element["broadcast"][broadcasts]["page"]).indexOf(replaceStrageChars(type)) > -1
          ) {
            arr.push(element);
          }
        }
      }
    }
  });
}

export const getGpsByTopics = (gepes: GpListValue[]): GpTopic[] => {
  const topics: string[] = [];
  const topicswithgps: GpTopic[] = [];
  gepes.forEach(gp => {
    if (gp.topic && topics.indexOf(gp.topic.name) === -1 && gp.implemented === true) {
      topics.push(gp.topic.name);
    }
  });
  topics.forEach(topic => {
    const gpsbytopic: GpListValue[] = [];
    gepes.forEach(gp => {
      if (gp.topic && gp.topic.name === topic) {
        gpsbytopic.push(gp);
      }
    });

    topicswithgps.push({
      name: topic,
      label: gpsbytopic[0] && gpsbytopic[0].topic ? gpsbytopic[0].topic.label : topic,
      gps: gpsbytopic
    });
  });
  return topicswithgps;
};

const convertValue = (originalDataItem: any, searchDataItem: IDataItemSearch) => {
  if (originalDataItem) {
    if (searchDataItem.type) {
      switch (searchDataItem.type) {
        case "blob": {
          if (originalDataItem.blob) {
            return originalDataItem.blob.filename;
          } else {
            return originalDataItem.value;
          }
        }
        case "date": {
          return originalDataItem.value
            .split("-")
            .reverse()
            .join("/");
        }
      }
    } else {
      return originalDataItem.value;
    }
  }
  return "";
};

const splitValue = (value: string) => {
  return value.split(":")[1];
};

export const getValueFromData = (dataToSearch: any, searchValues: { dataSection?: string; dataItem: IDataItemSearch }[], isModifiedData: boolean = false) => {
  const result: any = {};
  let formattedValue;
  searchValues.forEach(searchValue => {
    const filterData = dataToSearch.find((occ: any) =>
      searchValue.dataSection ? occ["@datasection"] === searchValue.dataSection && occ["@domain"] != "MAIN" : occ["@domain"] != "MAIN"
    );
    let itemData = "";
    asArray(filterData).forEach(fd => {
      itemData = fd.data.find((item: { item: any }) => item.item === searchValue.dataItem.name);
    });

    if (itemData && itemData.value) {
      formattedValue = searchValue.dataItem.type === "blob" ? splitValue(itemData.value) : itemData.value;
    } else {
      formattedValue = "";
    }

    const value = !isModifiedData ? convertValue(itemData, searchValue.dataItem) : formattedValue;

    result[searchValue.dataItem.name] = value;
  });
  return result;
};

export const getLengthFromData = (dataToSearch: any[], dataSection?: string, dossier?: string, domain?: string) => {
  let filteredData: any = [];
  if (dataSection && domain) {
    filteredData = asArray(dataToSearch).filter((occ: any) => occ["@datasection"] === dataSection && occ["@domain"] === domain);
  } else if (dataSection && dossier) {
    filteredData = asArray(dataToSearch).filter((occ: any) => occ["@datasection"] === dataSection && occ["@dossier"] === dossier && occ["@domain"] != "MAIN");
  } else if (dataSection) {
    filteredData = asArray(dataToSearch).filter((occ: any) => occ["@datasection"] === dataSection && occ["@domain"] != "MAIN");
  } else {
    return dataToSearch.length.toString();
  }
  return filteredData.length.toString();
};

export const getLengthFromDirectories = (directories: any[]) => {
  let length = "0";
  if (asArray(directories).length > 0) return asArray(directories).length.toString();
  return length;
};

export const getRolesFromLogin = (rolesList: any[]) => {
  const managerRoleApprover = cyconstants.managerRoleApprover ? rolesList.find((role: any) => role["@name"] === cyconstants.managerRoleApprover) : undefined;
  const managerRole = rolesList.find((role: any) => role["@name"] === cyconstants.managerRole);
  const employeeRole = rolesList.find((role: any) => role["@name"] === cyconstants.employeeRole);
  return {
    managerRoleLabel: managerRole ? managerRole["@label"] : "",
    employeeRoleLabel: employeeRole ? employeeRole["@label"] : "",
    managerRoleApproverLabel: managerRoleApprover ? managerRoleApprover["@label"] : managerRole ? managerRole["@label"] : ""
  };
};

export const uploadFile = (dataItem: string, fileName: string) => {
  return new Cypress.Promise(resolve => {
    cy.get(`input[data-test-id='${dataItem}']`)
      .selectFile(`cypress/fixtures/files/${fileName}`)
      .then(res => {
        resolve();
      });
  });
};

export const checkTableTemplate = (template: any, results: any) => {
  const table = cy.get(`.table-box[data-test-id='${template.id}']`);
  table.scrollIntoView().should("be.visible");
  table.then($el => {
    const readOnly = $el.attr("aria-readonly") === "true";
    template.rows.forEach((row: any, rowIndex: number) => {
      row.data.forEach((cell: any) => {
        const cellFound = cy.getBySel(`table-cell-${rowIndex}-${cell.name}`);
        readOnly ? cellFound.invoke("text").should("eq", results[`${cell.name}_EXT`]) : cellFound.find("input").should("have.value", results[`${cell.name}_EXT`]);
      });
    });
  });
};
