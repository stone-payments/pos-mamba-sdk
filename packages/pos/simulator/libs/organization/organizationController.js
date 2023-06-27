import { Registry } from '../../index.js';

const activeOrgFiled = 'active_org';
const packageFolderField = 'org_package_folder';

const organizationFileName = 'appOrgParams.json';

class OrganizationController {
  /**
   * Active organization file on POS root filesystem.
   * Simulate the contents of "orgs/activeOrg.json",
   *
   * @example
   * {
   *   "active_org": "stone",
   *   "org_package_folder": "<pos_mamba_root_folder>/orgs/stone"
   * }
   * @return {{active_org: sring, org_package_folder: string}}
   */
  static activeOrgFile() {
    const {
      current,
      external = {
        consolidatedOrganizations: {},
      },
    } = Registry.persistent.get().$System.Organizations;

    try {
      return {
        active_org: current,
        [packageFolderField]: `${
          external.consolidatedOrganizations[current][__MODULE_ORGANIZATION_CONFIG__.orgPackagePath]
        }`,
      };
    } catch (_) {
      return {
        active_org: current,
        [packageFolderField]: undefined,
      };
    }
  }

  /**
   * Get active organization package path in the POS simulated filesystem
   * @returns {boolean} path string
   */
  static getOrganizationPackagePath() {
    const json = OrganizationController.activeOrgFile();
    return json[packageFolderField];
  }
}

export { OrganizationController, activeOrgFiled, packageFolderField, organizationFileName };
