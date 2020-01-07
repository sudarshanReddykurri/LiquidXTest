import { types } from "mobx-state-tree";

export const User = types.model("User", {
  userId: types.identifier,
  firstName: types.string,
  lastName: types.string,
  emailId: types.string,
  gender: types.enumeration("gender",["male","female","other"]),
  accessType: types.string,
  userType: types.string,
  loggedInAt: types.optional(types.string,"")
});