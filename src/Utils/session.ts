
export interface SessionData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  img?: string;
  role: string;
  university: number;
  isLoggedIn: boolean;
  APIToken?: string;
  isAdmin: boolean;
}

export const SESSION_KEYS: Record<keyof SessionData, string> = {
  id: 'id',
  firstname: 'firstname',
  lastname: 'lastname',
  email: 'email',
  img: 'img',
  role: 'role',
  university: 'university',
  isLoggedIn: 'isLoggedIn',
  APIToken: 'APIToken',
  isAdmin: 'isAdmin',
};

export const Session = {
  get: {
    id(): number | null {
      const id = localStorage.getItem(SESSION_KEYS.id);
      return id ? Number(id) : null;
    },
    firstname(): string | null {
      return localStorage.getItem(SESSION_KEYS.firstname);
    },
    lastname(): string | null {
      return localStorage.getItem(SESSION_KEYS.lastname);
    },
    email(): string | null {
      return localStorage.getItem(SESSION_KEYS.email);
    },
    img(): string | null {
      return localStorage.getItem(SESSION_KEYS.img);
    },
    role(): string | null {
      return localStorage.getItem(SESSION_KEYS.role);
    },
    university(): number | null {
      const universityId = localStorage.getItem(SESSION_KEYS.university)
      return universityId ? Number(universityId) : null;
    },
    isLoggedIn(): boolean {
      return localStorage.getItem(SESSION_KEYS.isLoggedIn) === 'true';
    },
    APIToken(): string | null {
      return localStorage.getItem(SESSION_KEYS.APIToken);
    },
    isAdmin(): boolean {
      return localStorage.getItem(SESSION_KEYS.isAdmin) === 'true';
    }

  },

  set: {
    id(value: number): void {
      localStorage.setItem(SESSION_KEYS.id, String(value));
    },
    firstname(value: string): void {
      localStorage.setItem(SESSION_KEYS.firstname, value);
    },
    lastname(value: string): void {
      localStorage.setItem(SESSION_KEYS.lastname, value);
    },
    email(value: string): void {
      localStorage.setItem(SESSION_KEYS.email, value);
    },
    img(value: string): void {
      localStorage.setItem(SESSION_KEYS.img, value);
    },
    role(value: string): void {
      localStorage.setItem(SESSION_KEYS.role, value);
    },
    university(value: number): void {
      localStorage.setItem(SESSION_KEYS.university, String(value));
    },
    isLoggedIn(value: boolean): void {
      localStorage.setItem(SESSION_KEYS.isLoggedIn, String(value));
    },
    APIToken(value: string): void {
      localStorage.setItem(SESSION_KEYS.APIToken, value);
    },
    isAdmin(value : boolean): void {
      localStorage.setItem(SESSION_KEYS.isAdmin, String(value));
    }
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

  logAll(): void {
  console.log('Session data:');
  for (const key in SESSION_KEYS) {
    console.log(`${key}:`, localStorage.getItem(SESSION_KEYS[key]));
  }
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
