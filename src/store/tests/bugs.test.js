import { addBug, resolveBug, getUnresolvedBugs, loadBugs } from "../bugs";
import configureStore from "../configureStore";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;
  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  describe("loadbugs", () => {
    describe("if they exists in cache, they should come from cache", () => {
      it("it should come from the cache if they exist in cache", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get).toHaveLength(1);
      });
    });
    describe("if they dont exist in cache, they should come from the server", () => {
      it("should come from the server if they dont exists in cache and populate the store", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toContainEqual({ id: 1 });
      });

      describe("loading indicator", () => {
        it("should be true while fetching bugs from the server.", async () => {
          let loading;
          fakeAxios.onGet("/bugs").reply(() => {
            loading = bugsSlice().loading;
            return [200, [{ id: 1 }]];
          });

          await store.dispatch(loadBugs());

          expect(loading).toBe(true);
        });

        it("should be false after fetching bugs from the server.", async () => {
          fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });

        it("should be false if the server fails.", async () => {
          fakeAxios.onGet("/bugs").reply(500);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  describe("addBug", () => {
    it("should addBug to the store if it is saved to the server", async () => {
      // AAA ==> Arrange, Act and Assert
      const bug = { description: "hello bug" };
      const savedBug = { ...bug, id: 1 };
      fakeAxios.onPost("/bugs").reply(200, savedBug);

      await store.dispatch(addBug(bug));

      expect(bugsSlice().list).toContainEqual(savedBug);
    });

    it("should not addBug to the store if it is not saved to the server", async () => {
      const bug = { description: "hello bug" };
      fakeAxios.onPost("/bugs").reply(500);

      await store.dispatch(addBug(bug));

      expect(bugsSlice().list).toHaveLength(0);
    });
  });

  describe("resolveBug", () => {
    it("should resolve a bug when bug is resolved on the server", async () => {
      fakeAxios.onPatch("/bugs/1").reply(200, { id: 1, resolved: true });
      fakeAxios.onPost("/bugs").reply(200, { id: 1, resolved: false });

      await store.dispatch(addBug({}));
      await store.dispatch(resolveBug(1));

      expect(bugsSlice().list[0].resolved).toBe(true);
    });

    it("should not resolve a bug when bug is not resolved on the server", async () => {
      fakeAxios.onPatch("/bugs/1").reply(500);
      fakeAxios.onPost("/bugs").reply(200, { id: 1, resolved: false });

      await store.dispatch(addBug({}));
      await store.dispatch(resolveBug(1));

      expect(bugsSlice().list[0].resolved).not.toBe(true);
    });

    it("should get the unresolved bugs from the store", async () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 },
      ];

      const bugs = getUnresolvedBugs(state);

      expect(bugs).toHaveLength(2);
    });
  });
});
