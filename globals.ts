/// <reference types="cypress" />
/// <reference path="./support/config.ts" />

declare namespace Cypress {
  interface CustomWindow extends Window {}
  type SupportedLanguages = "en" | "fr" | "es" | "it" | "de" | "ne" | "be";
  type LoginModules = "ldapLoginModule" | "standardLoginModule";

  interface Chainable {
    /**
     *  Window object with additional properties used during test.
     */
    window(options?: Partial<Loggable & Timeoutable>): Chainable<CustomWindow>;

    /**
     * Custom command to make taking Percy snapshots with full name formed from the test title + suffix easier
     */
    visualSnapshot(maybeName?: any): Chainable<any>;

    getBySel(dataTestAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;
    getByDataForm(dataFormAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;
    getBySelLike(dataTestPrefixAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;
    getBySelFromForm(form: string, selector: string): Chainable<JQuery<HTMLElement>>;
    getByVal(dataTestAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;

    /**
     * Fetch React component instance associated with received element subject
     */
    reactComponent(): Chainable<any>;

    /**
     * Logs-in user by using UI
     */
    login(): Promise<any>;

    /**
     * allows user to change his password
     */
    changePassword(username: string, password: string, newPassword: string, newPasswordConfirm: string, language: SupportedLanguages, LoginModule?: LoginModules): void;

    /**
     * Reads fixture-translation.csv file and parses its content to array of objects
     */
    csvToArr(fixtureName: string, splitter: string): Chainable<any[]>;
    /**
     * checks if the count displayed in badge is equal to the data returned from associated request
     */
    checkCount(subject: any, count?: any): void;
    /**
     * checks if the pagination behavior works correctly
     */
    paginationTest(): void;
    /**
     * checks if the data displayed is correct
     */
    checkTableData(tableData: any): void;
    /**
     * search data from table
     */
    searchDataFromTable(data: any, index: string): void;
    /**
     * search number of reacords from table
     */
    getRecordsFromTable(dataSection: any): Chainable<any>;
    /**
     * search blob file name from dataSection
     */
    getBlobnameFromDataSection(dataSection: any): Chainable<any>;
    /**
     * excludes a test from execution conditionally
     */
    skipOn(nameOrFlag: string | boolean | (() => boolean), cb?: () => void): Chainable<any>;
    /**
     * runs the test marked by it and excludes the rest
     */
    onlyOn(nameOrFlag: string | boolean | (() => boolean), cb?: () => void): Chainable<any>;
    /**
     * selects a value from a codelist
     */
    selectValueFromCodelist(codelistField: string, modalInputField?: string, value?: string): void;
    /**
     *  Find a row that contains a value itself
     */
    findRowInTable(value: string): Chainable<any>;
  }
}
