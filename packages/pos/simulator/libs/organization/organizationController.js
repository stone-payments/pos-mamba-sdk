import { activeOrgFileName, packageFolderField } from './consts.js';
import { Registry } from '../../index.js';

/**
 * @typedef {import("./organization.js").Organization} Organization
 */

class OrganizationController {
  constructor() {
    /** @type {Organization=} */
    this.activeOrganization = undefined;

    /** @type {number=} */
    this.acquirerId = undefined;
  }

  /**
   * @returns {Organization}
   */
  getActiveOrganization() {
    return this.activeOrganization;
  }

  /**
   * @returns {string}
   */
  getActiveAcquirerName() {}

  // Orgs
  activeOrganizationIsStone() {}

  /**
   * @returns {string}
   */
  activeOrganizationIsTon() {}

  /**
   * @returns {string}
   */
  activeOrganizationIsWLPagarme() {}

  // Acquirers
  /**
   * @returns {string}
   */
  activeAcquirerIsStone() {}

  /**
   * @returns {string}
   */
  activeAcquirerIsTon() {}

  /**
   * @returns {string}
   */
  activeAcquirerIsMarkOne() {}

  /**
   * @returns {number}
   */
  getAcquirerId() {}

  /**
   * informs the active_org.json file path
   * @return {string} string path
   */
  static activeOrgFilePath() {
    // Should be a root simulated kernel folder
    const rootPath = '';

    const standardPathOrgsFolder = `${rootPath}/orgs`;

    const path = `${standardPathOrgsFolder}/${activeOrgFileName}`;
    return path;
  }

  /**
   *
   * @return {any}
   */
  static activeOrgFile() {
    const organizations = Registry.persistent.get().$System.Organizations;
    /**
     * Simulate the contents of "orgs/activeOrg.json"
     *
     * {
     *   "active_org": "stone",
     *   "org_package_folder": "/data/app/MAINAPP/orgs/stone"
     * }
     */

    // import(`@mamba-pkg/module-organization/pos-mamba-apps/orgs/orgs.json`)
    const path = OrganizationController.activeOrgFilePath();
    console.log(path);
    // I/O File
    return {
      active_org: organizations.current,
      org_package_folder: '/data/app/MAINAPP/orgs/stone',
    };
  }

  /**
   * Get active organization package path in the POS simulated filesystem
   * @returns {boolean} path string
   */
  static getOrganizationPackagePath() {
    const json = OrganizationController.activeOrgFile();
    console.log(json);
    return json[packageFolderField];
  }

  // public:
  //   static OrganizationController& instance();
  //   OrganizationController(OrganizationController const&) = delete;
  //   void operator=(OrganizationController const&) = delete;
  //   Organization getActiveOrganization();
  //   QString getActiveAcquirerName();
  //   // Orgs
  //   bool activeOrganizationIsStone();
  //   bool activeOrganizationIsTon();
  //   bool activeOrganizationIsWLPagarme();
  //   // Acquirers
  //   bool activeAcquirerIsStone();
  //   bool activeAcquirerIsTon();
  //   bool activeAcquirerIsMarkOne();
  //   int getAcquirerId();
  //   bool organizationPackageSetup(
  //     std::string const& uncompressedOrganizationPackageFolder);
  //   static bool organizationPackageUpdate(
  //     std::string const& organizationPackageFolder);
  //   /**
  //    * @brief installOrganizationPackageOnFirstStartup installs the default
  //    * organization package that comes with the system out of factory
  //    * @return True if a organization package is set up
  //    */
  //   bool installOrganizationPackageOnFirstStartup();
  //   /**
  //    * @brief getOrganizationPackagePath Get active organization package path in
  //    * the POS filesystem
  //    * @return path string
  //    */
  //   static std::string getOrganizationPackagePath();
  //   static nlohmann::json activeOrgFile();
  // private:
  //   OrganizationController();
  //   /**
  //    * @brief activeOrgFilePath informs the active_org.json file path
  //    * @return string path
  //    */
  //   static std::string const& activeOrgFilePath();
  //   void loadOrganizationInfo();
  //   Organization m_activeOrganization;
  //   int m_acquirerId;
}

/**
 * @type {OrganizationController}
 */
const organizationController = new OrganizationController();

export { OrganizationController };
export default organizationController;
