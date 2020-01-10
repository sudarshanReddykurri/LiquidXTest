// https://github.com/mobxjs/mobx-state-tree/tree/master/packages/mst-example-bookshop/src/stores
import {
  types,
  onSnapshot,
  getRoot,
  getSnapshot,
  applySnapshot,
  getParent,
  onPatch
} from "mobx-state-tree";
import uuid from "uuid";

const AssessmentModel = types.model("Assessment", {
  id: types.identifier,
  assessmentName: types.string,
  companyName: types.string,
  expiryTime: types.number,
  logoUrl: types.string
  // gamesToPlay: types.array(types.string),
  // gamePlayOrder: types.array(types.string),
  // completedGames: types.array(types.string)
});

const UserModel = types
  .model("User", {
    //   companyName: types.string,
    userId: types.string,
    fullName: types.string,
    emailId: types.string,
    gender: types.string,
    mobileNo: types.number,
    dob: types.string,
    registrationImages: types.boolean,
    auth_token: types.string,
    accessType: types.string,
    assessments: types.array(AssessmentModel)
  })
  .actions(self => {
    // Specify list of functions that can alter the tree
    // Only way we should edit the tree is through actions

    function updateUser(
      userId,
      fullName,
      emailId,
      gender,
      mobileNo,
      dob,
      registrationImages,
      auth_token,
      accessType
    ) {
      applySnapshot(self, {
        ...self,
        userId,
        fullName,
        emailId,
        gender,
        mobileNo,
        dob,
        registrationImages,
        auth_token,
        accessType
      });
    }

    function newAssessment(companyName, assessmentName, expiryTime, logoUrl) {
      const id = uuid.v4();
      // applySnapshot() function will create new immutable copy of this state tree
      applySnapshot(self, {
        ...self,
        assessments: [
          {
            id,
            assessmentName,
            companyName,
            expiryTime,
            logoUrl
          },
          ...self.assessments
        ]
      });
    }

    function clearAllAssessments() {
      self.assessments.length = 0;
    }

    function remove() {
      getParent(self, 2).remove(self);
    }

    return { updateUser, newAssessment, clearAllAssessments, remove };
  })
  .views(self => {
    // Here Memoization takes place and Memoization increases performance
    function getAssessmentsCount() {
      return self.assessments.length;
    }

    function parent() {
      getParent(self, 2);
    }

    function getAssessments() {
      return self.assessments;
    }

    return { parent, getAssessments, getAssessmentsCount };
  });

const RootModel = types.model("Root", {
  user: UserModel
});

export { RootModel };
