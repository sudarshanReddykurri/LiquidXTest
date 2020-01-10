import { RootModel } from "./RootStore";
import { onSnapshot, getSnapshot, applySnapshot } from "mobx-state-tree";

let user_initial_state = {
  user: {
    //   companyName: "Perspect AI",
    userId: "",
    fullName: "",
    emailId: "",
    gender: "",
    mobileNo: 9999999999,
    dob: "",
    registrationImages: false,
    auth_token: "",
    accessType: "",
    assessments: []
  }
};
export const setUpRootStore = () => {
  // Storing store in local storage https://egghead.io/lessons/react-store-store-in-local-storage
  if (localStorage.getItem("userStore")) {
    const json = JSON.parse(localStorage.getItem("userStore"));
    user_initial_state = json;
  }
  const rootTree = RootModel.create(user_initial_state);

  onSnapshot(rootTree, snapshot => {
    // onSnapshot() feature to listen to state changes, I then persist the state with every change in local storage
    // Snapshots are the immutable, structurally shared, representation of tree nodes (models and their children).
    localStorage.setItem("userStore", JSON.stringify(snapshot));
    console.log("snapshot: ", snapshot);
  });
  //   const currentRootTree = getSnapshot(rootTree);
  //   applySnapshot(rootTree,{
  //       ...currentRootTree, user: { ...currentRootTree.user, companyName: "Loop Reality"}
  //   });

  return { rootTree };
};
