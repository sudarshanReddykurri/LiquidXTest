import { CurrentAssessmentModel, RootModel } from "./RootStore";
import { onSnapshot, getSnapshot, applySnapshot } from "mobx-state-tree";
import Cookies from "js-cookie";

let user_initial_state = {
  user: {
    // companyName: "Perspect AI",
    userId: "",
    fullName: "",
    emailId: "",
    gender: "",
    mobileNo: -1,
    dob: "",
    registrationImages: false,
    auth_token: "",
    accessType: "",
    assessments: [],
    currentAssessment: {
      assessmentId: "",
      assessmentName: "",
      companyName: "",
      activationTime: -1,
      expiryTime: -1,
      logoUrl: "",
      game_play_order: [],
      games_to_play: [],
      complete_games: [],
      current_game: ""
    }
  }
};
export const setUpRootStore = () => {
  // Storing store in local storage https://egghead.io/lessons/react-store-store-in-local-storage
  if (Cookies.get("userStore")) {
    const json = JSON.parse(Cookies.get("userStore"));
    //const current_assessment = CurrentAssessmentModel.create(json.user.currentAssessment);
    user_initial_state = json;
  }
  const rootTree = RootModel.create(user_initial_state);

  onSnapshot(rootTree, snapshot => {
    // onSnapshot() feature to listen to state changes, I then persist the state with every change in local storage
    // Snapshots are the immutable, structurally shared, representation of tree nodes (models and their children).
    // localStorage.setItem("userStore", JSON.stringify(snapshot));
    Cookies.set("userStore", JSON.stringify(snapshot), { expires: 7 })
    console.log("snapshot: ", snapshot);
  });
  //   const currentRootTree = getSnapshot(rootTree);
  //   applySnapshot(rootTree,{
  //       ...currentRootTree, user: { ...currentRootTree.user, companyName: "Loop Reality"}
  //   });

  return { rootTree };
};
