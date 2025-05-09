
export interface SessionData {
  isLoggedIn: boolean;
  isAdmin: boolean;
  username?: string;
  userID?: string;
}

export const SESSION_KEYS: Record<keyof SessionData, string> = {
  isLoggedIn: 'isLoggedIn',
  isAdmin: 'isAdmin',
  username: 'username',
  userID: 'userID',
};

// Session object for method chaining
export const Session = {
  get: {
    username(): string | null {
      return localStorage.getItem(SESSION_KEYS.username);
    },
    isLoggedIn(): boolean {
      return localStorage.getItem(SESSION_KEYS.isLoggedIn) === 'true';
    },
    isAdmin(): boolean {
      return localStorage.getItem(SESSION_KEYS.isAdmin) === 'true';
    },
    userID(): string | null {
      return localStorage.getItem(SESSION_KEYS.userID);
    },
  },

  set: {
    username(value: string): void {
      localStorage.setItem(SESSION_KEYS.username, value);
    },
    isLoggedIn(value: boolean): void {
      localStorage.setItem(SESSION_KEYS.isLoggedIn, String(value));
    },
    isAdmin(value: boolean): void {
      localStorage.setItem(SESSION_KEYS.isAdmin, String(value));
    },
    userID(value: string): void {
      localStorage.setItem(SESSION_KEYS.userID, value);
    },
  },

  update<K extends keyof SessionData>(key: K, value: SessionData[K]): void {
    localStorage.setItem(SESSION_KEYS[key], String(value));
  },

  clear<K extends keyof SessionData>(key: K): void {
    localStorage.removeItem(SESSION_KEYS[key]);
  },

  clearAll() {
    Object.values(SESSION_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};



//#region 
//const username = Session.get.username();  // This returns the username or null if not set

// Set the username in localStorage
//Session.set.username('test_Username');

// Get isLoggedIn status
//const isLoggedIn = Session.get.isLoggedIn();  // This returns a boolean

// Set isLoggedIn status
//Session.set.isLoggedIn(true);

// Update the userID (this works for all keys)
//Session.update('userID', 'test_user_123');

// Clear a specific session key (e.g., username)
//Session.clear('username');

// Clear all session keys
//Session.clearAll();
//#endregion
