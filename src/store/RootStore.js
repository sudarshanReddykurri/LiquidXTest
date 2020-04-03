// https://github.com/mobxjs/mobx-state-tree/tree/master/packages/mst-example-bookshop/src/stores
// https://www.mydatahack.com/sorting-json-by-multiple-keys-with-javascript/
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
import { now } from "moment";

const AssessmentModel = types.model("Assessment", {
  id: types.identifier,
  assessmentId: types.string,
  assessmentName: types.string,
  companyName: types.string,
  expiryTime: types.number,
  logoUrl: types.string
});

export const CurrentAssessmentModel = types
  .model("CurrentAssessment", {
    assessmentId: types.string,
    assessmentName: types.string,
    companyName: types.string,
    activationTime: types.number,
    expiryTime: types.number,
    logoUrl: types.string,
    game_play_order: types.array(types.string),
    games_to_play: types.array(types.string),
    complete_games: types.array(types.string),
    current_game: types.string
  })
  .actions(self => {
    function update_current_assessment_info(
      assessmentId,
      assessmentName,
      companyName,
      expiryTime,
      logoUrl
    ) {
      console.log("update_current_assessment_info", assessmentId);
      applySnapshot(self, {
        ...self,
        assessmentId: assessmentId,
        assessmentName: assessmentName,
        companyName: companyName,
        expiryTime: expiryTime,
        logoUrl: logoUrl
      });
    }

    function setup_games(
      game_play_order,
      games_to_play,
      complete_games,
      activationTime,
      expiryTime
    ) {
      // self.game_play_order.length = 0;
      // self.games_to_play.length = 0;
      // self.complete_games.length = 0;
      applySnapshot(self, {
        ...self,
        game_play_order: game_play_order,
        games_to_play: games_to_play,
        complete_games: complete_games,
        activationTime: activationTime,
        expiryTime: expiryTime
      });
    }

    function clear_games() {
      applySnapshot(self, {
        ...self,
        game_play_order: [],
        games_to_play: [],
        complete_games: [],
        activationTime: -1,
        expiryTime: -1
      });
    }

    function update_current_game(current_game) {
      applySnapshot(self, {
        ...self,
        current_game: current_game
      });
    }

    function update_activation_time(activationTime) {
      applySnapshot(self, {
        ...self,
        activationTime: activationTime
      });
    }

    function update_expiry_time(expiryTime) {
      applySnapshot(self, {
        ...self,
        expiryTime: expiryTime
      });
    }

    function update_game_play_order(game_play_order) {
      console.log(
        "TCL: functionupdate_game_play_order -> update_game_play_order"
      );
      applySnapshot(self, {
        ...self,
        game_play_order: game_play_order
      });
    }

    function remove_from_games_to_play(game_name) {
      // self.games_to_play.length = 0;
      console.log("TCL: functionupdate_games_to_play -> update_games_to_play");

      var temp_place_holder = self.games_to_play; // make a separate copy of the array
      var index = temp_place_holder.indexOf(game_name);
      if (index !== -1) {
        temp_place_holder.splice(index, 1);
      }
      applySnapshot(self, {
        ...self,
        games_to_play: temp_place_holder
      });
    }

    function add_to_complete_games(game_name) {
      console.log(
        "TCL: functionupdate_complete_games -> update_complete_games"
      );
      applySnapshot(self, {
        ...self,
        complete_games: [...self.complete_games, game_name]
      });
    }
    return {
      setup_games,
      clear_games,
      update_current_game,
      update_activation_time,
      update_expiry_time,
      update_current_assessment_info,
      remove_from_games_to_play,
      update_game_play_order,
      add_to_complete_games
    };
  })
  .views(self => {
    function getGamePlayOrder() {
      return self.game_play_order;
    }
    function getGamesToPlay() {
      return self.games_to_play;
    }
    function getCompleteGames() {
      return self.complete_games;
    }

    return { getGamePlayOrder, getGamesToPlay, getCompleteGames };
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
    assessments: types.optional(types.array(AssessmentModel), []),
    currentAssessment: types.optional(CurrentAssessmentModel, {
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
    })
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

    function newAssessment(
      companyName,
      assessmentId,
      assessmentName,
      expiryTime,
      logoUrl
    ) {
      const id = uuid.v4();
      // applySnapshot() function will create new immutable copy of this state tree
      applySnapshot(self, {
        ...self,
        assessments: [
          {
            id,
            assessmentId,
            assessmentName,
            companyName,
            expiryTime,
            logoUrl
          },
          ...self.assessments
        ]
      });
    }

    function updateRegisterImages(isImagesRegistered){
      self.registrationImages = isImagesRegistered;
    }

    function clearAllAssessments() {
      self.assessments.length = 0;
    }

    function remove() {
      getParent(self, 2).remove(self);
    }

    return { updateUser, newAssessment, updateRegisterImages, clearAllAssessments, remove };
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

    // Sorting Array of JSON's by Name
    // function compareName(a, b) {
    //   // Use toUpperCase() or toLowerCase() to ignore character casing
    //   const nameA = a.Name.toUpperCase();
    //   const nameB = b.Name.toUpperCase();

    //   let comparison = 0;
    //   if (nameA > nameB) {
    //     comparison = 1;
    //   } else if (nameA < nameB) {
    //     comparison = -1;
    //   }
    //   return comparison;
    // }

    // Sorting Array of JSON's by Property (Use this function to sort either strings or numbers)
    function compareValues(key, order = "asc") {
      return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }

        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order === "desc" ? comparison * -1 : comparison;
      };
    }

    // Sorting Single JSON by Key
    function sortByKey(jsObj) {
      var sortedArray = [];
      // Push each JSON Object entry in array by [key, value]
      for (var i in jsObj) {
        sortedArray.push([i, jsObj[i]]);
      }
      // Run native sort function and returns sorted array.
      return sortedArray.sort();
    }

    // Sorting Single JSON by Value
    function sortByValue(jsObj) {
      var sortedArray = [];
      for (var i in jsObj) {
        // Push each JSON Object entry in array by [value, key]
        sortedArray.push([jsObj[i], i]);
      }
      return sortedArray.sort();
    }

    function sortAssessments(key_to_sort) {
      //expiryTime
      let assessments = [];
      if (key_to_sort == "active") {
        self.assessments
          .sort(compareValues(key_to_sort, "asc"))
          .map((assessment, index) => {
            console.log("TCL: sortAssessments -> assessment", assessment);
            const timeLeft =
              assessment.expiryTime * 1000 - new Date().getTime();
            if (timeLeft >= 0) {
              assessments.push(assessment);
            }
          });
        return assessments;
      }
      return self.assessments.sort(compareValues(key_to_sort, "asc"));
      //self.compareValues();
    }

    return { parent, getAssessments, getAssessmentsCount, sortAssessments };
  });

const RootModel = types.model("Root", {
  user: UserModel
});

export { RootModel };
