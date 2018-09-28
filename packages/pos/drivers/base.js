export default () => {
  const defaultGroup = {};
  const groups = { default: defaultGroup };
  let currentGroupName = 'default';
  let currentGroup = defaultGroup;

  const isSlotFilled = (signal, callback) => {
    const callbackList = currentGroup[signal];
    return (
      callbackList && callbackList.length && callbackList.indexOf(callback) > -1
    );
  };

  return {
    getGroups: () => groups,
    group(groupName) {
      currentGroupName = groupName;
      if (groups[groupName]) {
        currentGroup = groups[groupName];
      } else {
        currentGroup = {};
        groups[groupName] = currentGroup;
      }
      return this;
    },

    endGroup() {
      currentGroup = defaultGroup;
      return this;
    },

    /** Connect a callback to a slot */
    on(signal, callback) {
      if (typeof callback === 'function') {
        if (!currentGroup[signal]) {
          currentGroup[signal] = [];
        }
        currentGroup[signal].push(callback);

        this[signal].connect(callback);
      }
      return this;
    },

    /** Disconnect a callback from a slot */
    off(signal, callback) {
      const group = currentGroup;
      /** If no callback passed, disconnect all slots from the signal */
      if (typeof callback === 'undefined') {
        for (let i = group[signal].length; i--; ) {
          this[signal].disconnect(group[signal][i]);
        }
        delete group[signal];
      } else {
        const slotIndex = group[signal].findIndex(
          slotCallback => slotCallback === callback,
        );

        if (slotIndex > -1) {
          this[signal].disconnect(group[signal][slotIndex]);

          group[signal].splice(slotIndex, 1);

          /** Delete the signal slot list if it's empty */
          if (group[signal].length === 0) {
            delete group[signal];
          }
        } else if (__DEV__) {
          console.warn(
            `[@mamba/pos/driver] Tried to disconnect from "${signal}" a non-connected slot (group: ${currentGroupName}).`,
          );
        }
      }

      /** If the current signal group is empty, let's delete it */
      if (currentGroup !== defaultGroup && Object.keys(group).length === 0) {
        delete groups[currentGroupName];
        this.endGroup();
      }

      return this;
    },

    /** Allow only a unique callback on a specific slot */
    unique(signal, callback) {
      if (isSlotFilled(signal, callback)) {
        this.off(signal, callback);
      }
      return this.on(signal, callback);
    },

    /** Execute once a callback when the signal is dispatched and disconnect from it */
    once(signal, callback) {
      return this.race([[signal, callback]]);
    },

    /** The first signal dispatched is executed and automatically cancel all others */
    race(entries) {
      const wrappedCallbacks = {};
      entries.forEach(([signal, callback]) => {
        if (__DEV__) {
          console.log(`Connecting once '${signal}'`);
        }

        /** If the signal's slot is already filled with a callback, disconnect it */
        if (isSlotFilled(signal, callback)) {
          this.off(signal, callback);
        }

        /** Wrap the signal callback to disconnect all slots once one of the signals are emitted */
        wrappedCallbacks[signal] = () => {
          callback();
          Object.keys(wrappedCallbacks).forEach(signalName => {
            if (__DEV__) {
              console.log(`Removing '${signalName}'`);
            }
            this.off(signalName, wrappedCallbacks[signalName]);
          });
        };

        /** Listen to the signal emission */
        this.on(signal, wrappedCallbacks[signal]);
      });

      return this;
    },

    /** Destroy all signal listeners from a specified group */
    destroyGroup(groupName = 'default') {
      if (__DEV__) {
        console.log(`Destroying signal group: ${groupName}`);
      }

      if (!groups[groupName]) {
        console.error(
          `[@mamba/pos/driver] Destroying non existing group: '${groupName}'`,
        );
      }
      this.group(groupName);

      Object.keys(groups[groupName]).forEach(signal => {
        if (__DEV__) {
          console.log(`Disconnecting all slots from signal '${signal}'.`);
        }
        this.off(signal);
      });

      this.endGroup();
    },

    /** Destroy all signal listeners from all groups */
    destroy() {
      Object.keys(groups).forEach(group => this.destroyGroup(group));
    },
  };
};
