export default class Organization {
  constructor() {
    /** @type {string=} */
    this.name = undefined;

    /** @type {string=} */
    this.acquirer = undefined;

    /** @type {string=} */
    this.orgAlias = undefined;
  }

  /**
   * @param {string} acquirer
   * @returns {void}
   */
  setAcquirerName(acquirer) {
    this.acquirer = acquirer;
  }

  /**
   * @param {string} name
   * @returns {void}
   */
  setName(name) {
    this.name = name;
  }

  /**
   * @param {string} orgAlias
   * @returns {void}
   */
  setOrgAlias(orgAlias) {
    this.orgAlias = orgAlias;
  }

  /* public:
    const QString& acquirerName() const;
    void setAcquirerName(const QString& acquirer);

    const QString& name(bool useAlias = true) const;
    void setName(const QString& name);

    const QString& orgAlias() const;
    void setOrgAlias(const QString& orgAlias);

    PaymentSettings& paymentSettings();

  private:
    QString m_name;
    QString m_acquirer;
    QString m_orgAlias;
    PaymentSettings m_paymentSettings; */
}

export { Organization };
