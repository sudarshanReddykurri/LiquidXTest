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
      self.game_play_order.length = 0;
      self.games_to_play.length = 0;
      self.complete_games.length = 0;
      applySnapshot(self, {
        ...self,
        game_play_order: game_play_order,
        games_to_play: games_to_play,
        complete_games: complete_games,
        activationTime: activationTime,
        expiryTime: expiryTime
      });
    }

    function update_current_game(current_game){
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

    function update_games_to_play(games_to_play) {
      //self.games_to_play.length = 0;
      console.log("TCL: functionupdate_games_to_play -> update_games_to_play");
      applySnapshot(self, {
        ...self,
        games_to_play: games_to_play
      });
    }

    function update_complete_games(complete_games) {
      console.log(
        "TCL: functionupdate_complete_games -> update_complete_games"
      );
      applySnapshot(self, {
        ...self,
        complete_games: complete_games
      });
    }
    return {
      setup_games,
      update_current_game,
      update_activation_time,
      update_expiry_time,
      update_current_assessment_info,
      update_games_to_play,
      update_game_play_order,
      update_complete_games
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
