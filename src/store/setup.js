import { RootModel } from "./RootStore";
import { onSnapshot, getSnapshot, applySnapshot } from "mobx-state-tree";

export const setUpRootStore = () => {
  const rootTree = RootModel.create({
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
  },{
      // Dependency Injection Here if we want to do it
  })
  onSnapshot(rootTree,(snapshot)=>{
      console.log('snapshot: ',snapshot);
  });
//   const currentRootTree = getSnapshot(rootTree);
//   applySnapshot(rootTree,{
//       ...currentRootTree, user: { ...currentRootTree.user, companyName: "Loop Reality"}
//   });

  return { rootTree }
};
