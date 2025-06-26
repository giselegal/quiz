
export const getUserDataForEmail = (email: string) => {
  try {
    const userData = localStorage.getItem(`user_${email}`);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const storeUserForHotmart = (email: string, userData: any) => {
  try {
    localStorage.setItem(`user_${email}`, JSON.stringify({
      ...userData,
      timestamp: new Date().toISOString()
    }));
    console.log('User data stored for Hotmart:', email);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};
