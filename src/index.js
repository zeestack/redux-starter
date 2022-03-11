import configureStore from "./store/configureStore";
import {
  bugAdded,
  bugResolved,
  bugAssignedToUser,
  getUnresolvedBugs,
  getUsersBugs,
  loadBugs,
  addBug,
  resolveBug,
  asignBugToUser,
} from "./store/bugs";
import { projectCreated } from "./store/projects";
import { userAdded } from "./store/users";
import * as actions from "./store/api";

const store = configureStore();

const unsubscribe = store.subscribe(() => {
  console.log("Store changed!", store.getState());
});

// store.dispatch(userAdded({ name: "Zahid" }));

// store.dispatch((dispatch, getState) => {
//   console.log(getState, dispatch);
// });

// store.dispatch({
//   type: "error",
//   payload: { message: "An error occured" },
// });

store.dispatch(loadBugs());

store.dispatch(addBug({ description: "bug 24" }));

store.dispatch(resolveBug(1646634300466));

store.dispatch(asignBugToUser(1, 1646634300466));

// store.dispatch(bugAdded({ description: "Bug 1" }));
// store.dispatch(bugAdded({ description: "Bug 2" }));
// store.dispatch(bugAdded({ description: "Bug 3" }));
// store.dispatch(bugResolved({ id: 1 }));

// store.dispatch(projectCreated({ name: "Project 1" }));

// store.dispatch(bugAssignedToUser({ bugId: 1, userId: 1 }));

// console.log(store.getState());

// const uRbugs = getUnresolvedBugs(store.getState());
// const usersBugs = getUsersBugs(1)(store.getState());

//console.log(usersBugs);

unsubscribe();
