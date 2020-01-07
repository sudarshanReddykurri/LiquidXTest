import {
  types,
  onSnapshot,
  getRoot,
  getSnapshot,
  applySnapshot,
  getParent,
  onPatch
} from "mobx-state-tree";

import makeInspectable from "mobx-devtools-mst"; // Mobx State Tree dev tools
//   import { User } from "./models/UserProfileModel";

export const User = types.model("User", {
  userId: types.identifier,
  firstName: types.string,
  lastName: types.string,
  emailId: types.string,
  gender: types.enumeration("gender", ["male", "female", "other"]),
  accessType: types.string,
  userType: types.string,
  loggedInAt: types.optional(types.string, "")
});

export const UserStore = types
  .model("UserStore", {
    user: types.optional(User, {
        userId: types.identifier,
        firstName: types.string,
        lastName: types.string,
        emailId: types.string,
        gender: types.enumeration("gender", ["male", "female", "other"]),
        accessType: types.string,
        userType: types.string,
        loggedInAt: types.optional(types.string, "")})
  })
  .actions(self => {
    function saveOrUpdateProfile(args) {
      // applySnapshot(self,{...self, args})
      self = args;
      console.warn("saveOrUpdateProfile", self.user);
    }

    function afterCreate() {
      onSnapshot(self, () => {
        const rootStore = getRoot(self);
        rootStore.save();
      });
      console.warn("afterCreate");
    }

    return { saveOrUpdateProfile, afterCreate };
  })
  .views(self => {
    function parent() {
      getParent(self, 2);
    }

    function getuser() {
      return self.user;
    }

    return { parent, getuser };
  });


// Debugging tools
onPatch(UserStore, patch => {
    console.log(patch); // writes in console.log every changes in the state
  });
makeInspectable(UserStore); // MST dev tools
  
export default UserStore;