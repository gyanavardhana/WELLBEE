export function isTokenExpired(token) {
    if (!token) {
      return true; // If there's no token, consider it as expired.
    }
  
    const arrayToken = token.split('.');
    if (arrayToken.length !== 3) {
      return true; // If the token doesn't have three parts, consider it invalid/expired.
    }
  
    try {
      const tokenPayload = JSON.parse(atob(arrayToken[1]));
      return Math.floor(new Date().getTime() / 1000) >= tokenPayload.exp; // Compare with exp instead of sub.
    } catch (e) {
      return true; // If there's an error in decoding, consider the token as expired.
    }
  }
  