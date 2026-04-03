import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { User } from "firebase/auth";

let unsubBeverages: Unsubscribe | null = null;

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
    user: null as User | null,
  }),

  actions: {
    async init() {
      const basesSnap = await getDocs(collection(db, "bases"));
      this.bases = basesSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as BaseBeverageType)
        .sort((a, b) => a.id.localeCompare(b.id));

      const creamersSnap = await getDocs(collection(db, "creamers"));
      this.creamers = creamersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as CreamerType)
        .sort((a, b) => a.id.localeCompare(b.id));

      const syrupsSnap = await getDocs(collection(db, "syrups"));
      this.syrups = syrupsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as SyrupType)
        .sort((a, b) => a.id.localeCompare(b.id));

      this.currentBase = this.bases[0] ?? null;
      this.currentCreamer = this.creamers[0] ?? null;
      this.currentSyrup = this.syrups[0] ?? null;
    },

    setUser(user: User | null) {
      this.user = user;

      // Detach previous listener
      if (unsubBeverages) {
        unsubBeverages();
        unsubBeverages = null;
      }

      if (!user) {
        this.beverages = [];
        this.currentBeverage = null;
        return;
      }

      // Start a new listener for this user's beverages
      const q = query(
        collection(db, "beverages"),
        where("userId", "==", user.uid)
      );

      unsubBeverages = onSnapshot(q, (snapshot) => {
        this.beverages = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }) as BeverageType);

        // Update currentBeverage to the latest one, or null if empty
        if (this.beverages.length > 0) {
          this.currentBeverage = this.beverages[this.beverages.length - 1];
        } else {
          this.currentBeverage = null;
        }
      });
    },

    async makeBeverage(): Promise<string> {
      if (!this.user) {
        return "No user logged in, please sign in first.";
      }

      if (!this.currentBase || !this.currentCreamer || !this.currentSyrup || !this.currentName.trim()) {
        return "Please complete all beverage options and the name before making a beverage.";
      }

      const id = `${this.user.uid}_${Date.now()}`;

      const beverage: BeverageType = {
        id,
        name: this.currentName.trim(),
        temp: this.currentTemp,
        base: this.currentBase,
        syrup: this.currentSyrup,
        creamer: this.currentCreamer,
      };

      // Store to Firestore
      await setDoc(doc(db, "beverages", id), {
        ...beverage,
        userId: this.user.uid,
      });

      // Update local state immediately
      this.beverages.push(beverage);
      this.currentBeverage = beverage;

      const name = beverage.name;
      return `Beverage ${name} made successfully!`;
    },

    showBeverage() {},
  },
});
