/* eslint-disable no-unused-vars */
import { OrganizationController } from '../libs/organization/organizationController.js';
import { organizationFileName } from '../libs/organization/consts.js';

export const NAMESPACE = 'Org';

export const PERSISTENT_SETTINGS = {};

export function setup(Org) {
  /**
   * @param {number} appId Id of the app that wants the organization folder path.
   * @returns {string}  the path of the folder containing the organization configuration files.
   */
  function getOrganizationFolderPath(appId) {
    if (typeof appId !== 'number') throw new Error('appId must be a number');
    /**
     * `appId` It's not really used on simulation environment.
     * The app calls `window.Org.getOrganizationFile(__APP_MANIFEST__.id)` on production,
     * but here, since we do not have an App manager to get the app by it's id to retrieve
     * it's manifest, we infer that in simulator, always will be the same app, so we
     * concatenate the `__APP_MANIFEST__.name`
     */
    const appFolderName = `${appId}-${__APP_MANIFEST__.name}`;
    const orgPackagePath = OrganizationController.getOrganizationPackagePath();
    return `${orgPackagePath}/apps/${appFolderName}`;
  }

  /**
   * @param {number} appId Id of the app that wants the organization file.
   * @returns {string} Id of the app that wants the organization file path.
   */
  function getOrganizationFilePath(appId) {
    return `${getOrganizationFolderPath(appId)}/${organizationFileName}`;
  }

  /**
   * @param {number} appId Id of the app that wants the organization file.
   * @returns {string} the org customization file that defines the changes to be made.
   */
  function getOrganizationFile(appId) {
    /*
     return QString("%1/%2")
      .arg(getOrganizationFolderPath(appId))
      .arg(g_organizationFileName);
    */
    /* fetch(getOrganizationFilePath(appId))
      .then((res) => res.json())
      .then((data) => console.log(data)); */
    return '';
  }

  Org.getOrganizationFile = getOrganizationFile;
  Org.getOrganizationFolderPath = getOrganizationFolderPath;
}
