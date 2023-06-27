/* eslint-disable no-unused-vars */
import {
  OrganizationController,
  organizationFileName,
} from '../libs/organization/organizationController.js';
import { loadVirtualPosFileSync } from '../libs/organization/loadVirtualPosJson.js';
import { Registry } from '../index.js';

export const NAMESPACE = 'Org';

export const PERSISTENT_SETTINGS = {};

/**
 * Check if the organization module is the virtual one or not.
 * @param {string} methodName
 */
function validateExternalOrgModule(methodName) {
  if (
    // If external module doesn't exist or not configured
    !Registry.persistent.get().$System.Organizations.external
  ) {
    throw new Error(`Can't access method "${methodName}", organizations not installed`);
  }
}

export function setup(Org) {
  /**
   * Get the path of the folder containing the organization configuration files.
   * @param {number} appId Id of the app that wants the organization folder path.
   * @returns {string}  the path of the folder containing the organization configuration files.
   */
  function getOrganizationFolderPath(appId) {
    if (typeof appId !== 'number') throw new Error('appId must be a number');
    // Simulation of an invalid app id.
    if (appId !== __APP_MANIFEST__.id) {
      if (__SIMULATOR__) {
        console.log(
          `%c When calling "Org.getOrganizationFolderPath(appId)" method, "appId" it's not really used on simulation environment. Using another application ids do nothing on simulator environment.`,
          'background: #222; color: #bada55',
        );
      }
      return undefined;
    }

    try {
      validateExternalOrgModule('getOrganizationFolderPath');
    } catch (_) {
      // For this method, do not throw
      return undefined;
    }

    /**
     * `appId` It's not really used on simulation environment.
     * The app calls `window.Org.getOrganizationFile(__APP_MANIFEST__.id)` on production,
     * but here, since we do not have an App manager to get the app by it's id to retrieve
     * it's manifest, we infer that in simulator, always will be the same app, so we
     * concatenate the `__APP_MANIFEST__.name`
     */
    const appFolderName = `${__APP_MANIFEST__.id}-${__APP_MANIFEST__.name}`;

    const orgPackagePath = OrganizationController.getOrganizationPackagePath();
    return `${orgPackagePath}/apps/${appFolderName}`;
  }

  /**
   * Get the path to the file containing the changes to be made to the app for the current organization.
   * @private not invokable
   * @param {number} appId Id of the app that wants the organization file.
   * @returns {string} app organization params json file path
   */
  function getOrganizationFilePath(appId) {
    /**
     * getOrganizationFolderPath(appId) -> ex.: orgs/stone/apps/1-payment/
     * organizationFileName -> appOrgParams.json
     * Final path: ex.: orgs/stone/apps/1-payment/appOrgParams.json
     */
    return `${getOrganizationFolderPath(appId)}/${organizationFileName}`;
  }

  /**
   * Get the org customization file contents that defines the changes to be made.
   * @param {number} appId Id of the app that wants the organization file.
   * @returns {any} app organization params file contents
   */
  function getOrganizationFile(appId) {
    validateExternalOrgModule('getOrganizationFile');

    const file = getOrganizationFilePath(appId);

    return loadVirtualPosFileSync(file);
  }

  Org.getOrganizationFile = getOrganizationFile;
  Org.getOrganizationFolderPath = getOrganizationFolderPath;
}
